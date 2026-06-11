#!/usr/bin/env node
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const coreDir = resolve(here, '..');
const rootDir = resolve(coreDir, '..');
const statePath = join(coreDir, 'STATE.json');

function now() {
  return new Date().toISOString();
}

function readState() {
  return JSON.parse(readFileSync(statePath, 'utf8'));
}

function writeState(state) {
  const tmp = `${statePath}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  renameSync(tmp, statePath);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('--')) {
      out._.push(item);
      continue;
    }
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function requireArg(args, key) {
  const value = args[key];
  if (!value || value === true) throw new Error(`Missing --${key}`);
  return String(value);
}

function runGit(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: rootDir,
    env: { ...process.env, ...(options.env || {}) },
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    const detail = `${result.stderr || result.stdout}`.trim();
    throw new Error(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return (result.stdout || '').trim();
}

function runGitAllowFailure(args, options = {}) {
  return spawnSync('git', args, {
    cwd: rootDir,
    env: { ...process.env, ...(options.env || {}) },
    encoding: 'utf8'
  });
}

function runOptional(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: { ...process.env, ...(options.env || {}) },
    encoding: 'utf8'
  });
  return {
    ok: result.status === 0,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim()
  };
}

function appendLedger(state, actor, kind, summary) {
  state.ledger ||= [];
  state.ledger.push({ at: now(), actor, kind, summary });
}

function getMember(state, actor) {
  const member = state.members?.[actor];
  if (!member) throw new Error(`Unknown actor: ${actor}`);
  return member;
}

function identityFor(state, actor) {
  const member = getMember(state, actor);
  const identity = member.gitIdentity || {};
  const name = identity.name || member.displayName || actor;
  const email = identity.email || member.github?.noreplyEmail || '';
  if (!email && state.autosync?.requireUserGitEmail !== false) {
    throw new Error([
      `Missing git email for ${actor}.`,
      'Set a GitHub-verified email or noreply email first:',
      `node .memoryofplanet/scripts/mop-core.mjs member git-identity --actor ${actor} --name "${name}" --email "<github-verified-email>" [--github-username "<username>"]`
    ].join(' '));
  }
  return {
    name,
    email,
    githubUsername: identity.githubUsername || member.github?.username || ''
  };
}

function identityEnv(identity) {
  return {
    GIT_AUTHOR_NAME: identity.name,
    GIT_AUTHOR_EMAIL: identity.email,
    GIT_COMMITTER_NAME: identity.name,
    GIT_COMMITTER_EMAIL: identity.email
  };
}

function ensureGitRepo() {
  if (!existsSync(join(rootDir, '.git'))) {
    throw new Error(`Not a git repository: ${rootDir}`);
  }
  runGit(['rev-parse', '--show-toplevel']);
}

function ensureGitRepoForInit() {
  if (!existsSync(join(rootDir, '.git'))) {
    const init = runGitAllowFailure(['init', '-b', 'main']);
    if (init.status !== 0) {
      runGit(['init']);
      runGit(['branch', '-M', 'main']);
    }
  }
  runGit(['rev-parse', '--show-toplevel']);
}

function remoteBranchExists(branch) {
  const result = runOptional('git', ['ls-remote', '--exit-code', '--heads', 'origin', branch]);
  return result.ok;
}

function configureLocalIdentity(identity) {
  runGit(['config', '--local', 'user.name', identity.name]);
  runGit(['config', '--local', 'user.email', identity.email]);
}

function configureRemote(url, replaceRemote = false) {
  const existing = runOptional('git', ['remote', 'get-url', 'origin']);
  if (existing.ok) {
    if (url && existing.stdout !== url) {
      if (!replaceRemote) {
        throw new Error(`origin already points to ${existing.stdout}. Re-run with --replace-remote to set ${url}.`);
      }
      runGit(['remote', 'set-url', 'origin', url]);
      return url;
    }
    return existing.stdout;
  }
  if (!url) throw new Error('Missing --url and no origin remote is configured.');
  runGit(['remote', 'add', 'origin', url]);
  return url;
}

function verifyGhUser(identity, state) {
  if (!identity.githubUsername || state.autosync?.verifyGhUserWhenConfigured === false) return 'skipped';
  const gh = runOptional('gh', ['api', 'user', '--jq', '.login']);
  if (!gh.ok) {
    throw new Error('GitHub username is configured, but gh could not verify the active account. Run gh auth login as the real user or set autosync.verifyGhUserWhenConfigured=false for SSH-only workflows.');
  }
  if (gh.stdout.toLowerCase() !== identity.githubUsername.toLowerCase()) {
    throw new Error(`GitHub CLI authenticated as ${gh.stdout}, expected ${identity.githubUsername}. Refusing to push as the wrong account.`);
  }
  return `verified:${gh.stdout}`;
}

function commitIfNeeded(reason, env) {
  runGit(['add', '-A']);
  const status = runGit(['status', '--porcelain']);
  if (!status) return 'nothing-to-commit';
  runGit(['commit', '-m', reason], { env });
  return runGit(['rev-parse', '--short', 'HEAD']);
}

function currentBranch() {
  return runGit(['branch', '--show-current']);
}

function ensureBranch(branch) {
  runGit(['fetch', 'origin']);
  if (remoteBranchExists(branch)) {
    runGit(['checkout', '-B', branch, `origin/${branch}`]);
  } else {
    runGit(['checkout', '-B', branch]);
  }
}

function saveMemory(actor, summary) {
  const state = readState();
  appendLedger(state, actor, 'memory', summary);
  writeState(state);
  return state;
}

function push(args) {
  ensureGitRepo();
  const state = readState();
  if (!state.initialized) throw new Error('MemoryOfPlanet is not initialized.');
  const actor = requireArg(args, 'actor');
  const reason = String(args.reason || 'MemoryOfPlanet autosycn');
  const identity = identityFor(state, actor);
  const env = identityEnv(identity);
  const ghStatus = verifyGhUser(identity, state);
  configureLocalIdentity(identity);

  const mainBranch = state.autosync?.targetMainBranch || 'main';
  const prefix = state.autosync?.syncBranchPrefix || 'sync';
  const target = state.mode === 'team' ? `${prefix}/${actor}` : mainBranch;
  const before = currentBranch();
  ensureBranch(target);
  const commit = commitIfNeeded(reason, env);
  runGit(['push', '-u', 'origin', target], { env });

  console.log(JSON.stringify({
    ok: true,
    actor,
    author: `${identity.name} <${identity.email}>`,
    ghStatus,
    branch: target,
    previousBranch: before,
    commit
  }, null, 2));
}

function init(args) {
  const state = readState();
  if (!state.initialized) throw new Error('MemoryOfPlanet is not initialized.');
  const actor = requireArg(args, 'actor');
  if (actor !== state.ownerCodename) throw new Error('Only the owner can initialize autosycn.');
  const identity = identityFor(state, actor);
  const env = identityEnv(identity);
  const url = String(args.url || state.githubUrl || '');
  const ghStatus = verifyGhUser(identity, state);

  ensureGitRepoForInit();
  configureLocalIdentity(identity);
  const remote = configureRemote(url, args['replace-remote'] === true);
  runGit(['checkout', '-B', state.autosync?.targetMainBranch || 'main']);

  appendLedger(state, actor, 'autosycn-init', `Initialized autosycn remote ${remote}.`);
  if (url) state.githubUrl = url;
  writeState(state);
  const commit = commitIfNeeded('Initialize MemoryOfPlanet autosycn baseline', env);
  runGit(['push', '-u', 'origin', state.autosync?.targetMainBranch || 'main'], { env });

  console.log(JSON.stringify({
    ok: true,
    actor,
    author: `${identity.name} <${identity.email}>`,
    ghStatus,
    remote,
    branch: state.autosync?.targetMainBranch || 'main',
    commit
  }, null, 2));
}

function mergeMain(args) {
  ensureGitRepo();
  const state = readState();
  if (!state.initialized) throw new Error('MemoryOfPlanet is not initialized.');
  const actor = requireArg(args, 'actor');
  if (actor !== state.ownerCodename) throw new Error('Only the owner can merge autosycn branches to main.');
  const from = String(args.from || actor);
  const reason = String(args.reason || `Merge sync/${from}`);
  const identity = identityFor(state, actor);
  const env = identityEnv(identity);
  const ghStatus = verifyGhUser(identity, state);
  configureLocalIdentity(identity);

  const mainBranch = state.autosync?.targetMainBranch || 'main';
  const prefix = state.autosync?.syncBranchPrefix || 'sync';
  const source = `origin/${prefix}/${from}`;
  runGit(['checkout', mainBranch]);
  runGit(['pull', 'origin', mainBranch], { env });
  runGit(['fetch', 'origin']);
  const merge = runGitAllowFailure(['merge', '--no-ff', source, '-m', reason], { env });
  if (merge.status !== 0) {
    const conflicted = runOptional('git', ['diff', '--name-only', '--diff-filter=U']);
    const files = conflicted.stdout.split(/\r?\n/).filter(Boolean);
    if (files.length === 1 && files[0].replaceAll('\\', '/') === '.memoryofplanet/STATE.json') {
      runGit(['checkout', '--ours', '--', '.memoryofplanet/STATE.json']);
      runGit(['add', '.memoryofplanet/STATE.json']);
      runGit(['commit', '-m', reason], { env });
    } else {
      runOptional('git', ['merge', '--abort']);
      const detail = `${merge.stderr || merge.stdout}`.trim();
      throw new Error(`Merge conflict outside STATE.json. Merge aborted.${detail ? ` ${detail}` : ''}`);
    }
  }
  runGit(['push', 'origin', mainBranch], { env });

  console.log(JSON.stringify({
    ok: true,
    actor,
    author: `${identity.name} <${identity.email}>`,
    ghStatus,
    merged: source,
    branch: mainBranch,
    head: runGit(['rev-parse', '--short', 'HEAD'])
  }, null, 2));
}

function runAll(args) {
  const actor = requireArg(args, 'actor');
  const reason = String(args.reason || 'MemoryOfPlanet autosycn');
  saveMemory(actor, reason);
  push({ ...args, actor, reason });
  const state = readState();
  if (state.mode === 'team' && actor === state.ownerCodename) {
    mergeMain({ actor, from: actor, reason: `Merge sync/${actor}: ${reason}` });
  }
}

function status() {
  const state = readState();
  console.log(JSON.stringify({
    enabled: state.autosync?.enabled !== false,
    main: state.autosync?.targetMainBranch || 'main',
    syncBranchPrefix: state.autosync?.syncBranchPrefix || 'sync',
    requireUserGitEmail: state.autosync?.requireUserGitEmail !== false,
    initialized: state.initialized,
    activeMember: state.activeMember,
    members: Object.fromEntries(Object.entries(state.members || {}).map(([key, member]) => [
      key,
      {
        displayName: member.displayName,
        gitIdentityConfigured: Boolean(member.gitIdentity?.email || member.github?.noreplyEmail),
        gitName: member.gitIdentity?.name || member.displayName || key,
        gitEmail: member.gitIdentity?.email || member.github?.noreplyEmail || ''
      }
    ]))
  }, null, 2));
}

function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  if (command === 'status') return status();
  if (command === 'init') return init(args);
  if (command === 'memory') {
    const actor = requireArg(args, 'actor');
    const summary = String(args.summary || args.reason || 'MemoryOfPlanet conversation');
    saveMemory(actor, summary);
    console.log(`Memory saved for ${actor}.`);
    return;
  }
  if (command === 'push') return push(args);
  if (command === 'merge') return mergeMain(args);
  if (command === 'run') return runAll(args);

  console.log(`Usage:
  node .memoryofplanet/scripts/mop-autosycn.mjs status
  node .memoryofplanet/scripts/mop-autosycn.mjs init --actor <owner-codename> --url <github-url>
  node .memoryofplanet/scripts/mop-autosycn.mjs memory --actor <codename> --summary "what happened"
  node .memoryofplanet/scripts/mop-autosycn.mjs push --actor <codename> --reason "what changed"
  node .memoryofplanet/scripts/mop-autosycn.mjs merge --actor <owner> --from <codename> --reason "merge reason"
  node .memoryofplanet/scripts/mop-autosycn.mjs run --actor <codename> --reason "what changed"`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
