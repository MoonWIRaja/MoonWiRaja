#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

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
  mkdirSync(coreDir, { recursive: true });
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
  if (!value || value === true) {
    throw new Error(`Missing --${key}`);
  }
  return String(value);
}

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const passwordHash = scryptSync(password, salt, 64).toString('hex');
  return { passwordHash, passwordSalt: salt };
}

function verifyPassword(password, salt, expectedHex) {
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function appendLedger(state, actor, kind, summary) {
  state.ledger ||= [];
  state.ledger.push({ at: now(), actor, kind, summary });
}

function setup(args) {
  const state = readState();
  if (state.initialized) {
    throw new Error('MemoryOfPlanet already initialized.');
  }

  const folderDefault = rootDir.split(/[\\/]/).filter(Boolean).pop() || 'MemoryOfPlanet';
  const projectName = String(args['project-name'] || folderDefault);
  const displayName = requireArg(args, 'name');
  const codename = slug(requireArg(args, 'codename'));
  const password = requireArg(args, 'password');
  const mode = requireArg(args, 'mode').toLowerCase();
  const conversationLanguage = String(args['conversation-language'] || 'Melayu');
  const codingLanguage = String(args['coding-language'] || 'English');
  const githubUrl = String(args['github-url'] || '');
  const gitName = String(args['git-name'] || displayName);
  const gitEmail = String(args['git-email'] || '');
  const githubUsername = String(args['github-username'] || '');
  const joinMode = String(args['join-mode'] || 'owner-approved');

  if (codename.length < 2) throw new Error('Codename too short.');
  if (password.length < 8) throw new Error('Password must be at least 8 characters.');
  if (!['solo', 'team'].includes(mode)) throw new Error('Mode must be solo or team.');
  if (mode === 'team' && !githubUrl) throw new Error('Team mode requires --github-url.');
  if (state.autosync?.requireUserGitEmail !== false && !gitEmail) {
    throw new Error('Git email is required so commits are attributed to the real user, not the AI tool.');
  }
  if (!['open', 'owner-approved', 'invite'].includes(joinMode)) {
    throw new Error('Join mode must be open, owner-approved, or invite.');
  }

  const { passwordHash, passwordSalt } = hashPassword(password);
  state.initialized = true;
  state.projectName = projectName;
  state.projectNameDefault = folderDefault;
  state.ownerCodename = codename;
  state.activeMember = codename;
  state.mode = mode;
  state.joinMode = mode === 'team' ? joinMode : 'owner-approved';
  state.githubUrl = githubUrl;
  state.members = {
    [codename]: {
      codename,
      displayName,
      role: 'owner',
      passwordHash,
      passwordSalt,
      languagePreferences: {
        conversation: conversationLanguage,
        coding: codingLanguage
      },
      gitIdentity: {
        name: gitName,
        email: gitEmail,
        githubUsername
      },
      joinedAt: now()
    }
  };
  appendLedger(state, codename, 'setup', `Initialized ${projectName} in ${mode} mode.`);
  writeState(state);
  console.log(`MemoryOfPlanet initialized. Owner ${displayName} (${codename}) is active.`);
}

function login(args) {
  const state = readState();
  const codename = slug(requireArg(args, 'codename'));
  const password = requireArg(args, 'password');
  const member = state.members?.[codename];
  if (!member || !verifyPassword(password, member.passwordSalt, member.passwordHash)) {
    console.log('Credentials tidak sah.');
    process.exitCode = 1;
    return;
  }
  state.activeMember = codename;
  appendLedger(state, codename, 'login', 'Member authenticated.');
  writeState(state);
  console.log(`Active member: ${codename}`);
}

function agentActivate(args) {
  const state = readState();
  if (!state.initialized) throw new Error('MemoryOfPlanet is not initialized.');
  const actor = slug(requireArg(args, 'actor'));
  if (!state.members?.[actor]) throw new Error('Unknown actor.');

  const role = slug(requireArg(args, 'role'));
  const title = String(args.title || role);
  const name = requireArg(args, 'name').trim();
  const key = name.toLowerCase();
  state.agentRoster ||= [];

  let agent = state.agentRoster.find((item) => item.name.toLowerCase() === key);
  if (agent) {
    agent.owners ||= [];
    if (!agent.owners.includes(actor)) agent.owners.push(actor);
    appendLedger(state, actor, 'agent-share', `${actor} joined agent ${agent.name}.`);
  } else {
    agent = {
      id: `agent-${slug(name)}`,
      role,
      title,
      name,
      owners: [actor],
      createdBy: actor,
      createdAt: now()
    };
    state.agentRoster.push(agent);
    appendLedger(state, actor, 'agent-activate', `Named ${title} as ${name}.`);
  }
  writeState(state);
  console.log(`Agent active: ${agent.name} (${agent.role}) owners=${agent.owners.join(',')}`);
}

function agentList() {
  const state = readState();
  console.log(JSON.stringify(state.agentRoster || [], null, 2));
}

function memberGitIdentity(args) {
  const state = readState();
  if (!state.initialized) throw new Error('MemoryOfPlanet is not initialized.');
  const actor = slug(requireArg(args, 'actor'));
  const member = state.members?.[actor];
  if (!member) throw new Error('Unknown actor.');
  const name = String(args.name || member.displayName || actor);
  const email = requireArg(args, 'email');
  const githubUsername = String(args['github-username'] || member.gitIdentity?.githubUsername || '');
  member.gitIdentity = { name, email, githubUsername };
  appendLedger(state, actor, 'git-identity', `Updated git identity for ${actor}.`);
  writeState(state);
  console.log(`Git identity set for ${actor}: ${name} <${email}>${githubUsername ? ` github=${githubUsername}` : ''}`);
}

function validate() {
  const state = readState();
  const errors = [];
  if (typeof state.initialized !== 'boolean') errors.push('initialized must be boolean');
  if (!state.projectName) errors.push('projectName is required');
  if (!Array.isArray(state.agentRoster)) errors.push('agentRoster must be array');
  if (!Array.isArray(state.ledger)) errors.push('ledger must be array');
  if (state.initialized) {
    if (!state.ownerCodename) errors.push('ownerCodename is required after setup');
    if (!state.members?.[state.ownerCodename]) errors.push('owner member missing');
    if (!['solo', 'team'].includes(state.mode)) errors.push('mode must be solo or team');
    if (state.mode === 'team' && !state.githubUrl) errors.push('team mode requires githubUrl');
    if (state.autosync?.requireUserGitEmail !== false) {
      for (const [codename, member] of Object.entries(state.members || {})) {
        if (!member.gitIdentity?.email && !member.github?.noreplyEmail) {
          errors.push(`member ${codename} is missing git identity email`);
        }
      }
    }
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log('MemoryOfPlanet state OK.');
}

function status() {
  const state = readState();
  console.log(JSON.stringify({
    initialized: state.initialized,
    projectName: state.projectName,
    activeMember: state.activeMember,
    mode: state.mode,
    githubUrl: state.githubUrl,
    members: Object.keys(state.members || {}),
    agents: (state.agentRoster || []).map((agent) => ({
      name: agent.name,
      role: agent.role,
      owners: agent.owners
    })),
    autosync: {
      enabled: state.autosync?.enabled !== false,
      requireUserGitEmail: state.autosync?.requireUserGitEmail !== false
    },
    gitIdentities: Object.fromEntries(Object.entries(state.members || {}).map(([codename, member]) => [
      codename,
      {
        name: member.gitIdentity?.name || member.displayName || codename,
        email: member.gitIdentity?.email || member.github?.noreplyEmail || '',
        githubUsername: member.gitIdentity?.githubUsername || member.github?.username || ''
      }
    ]))
  }, null, 2));
}

function main() {
  if (!existsSync(statePath)) {
    throw new Error(`Missing state file: ${statePath}`);
  }
  const [command, subcommand, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (command === 'setup') return setup(parseArgs([subcommand, ...rest].filter(Boolean)));
  if (command === 'login') return login(parseArgs([subcommand, ...rest].filter(Boolean)));
  if (command === 'validate') return validate();
  if (command === 'status') return status();
  if (command === 'member' && subcommand === 'git-identity') return memberGitIdentity(args);
  if (command === 'agent' && subcommand === 'activate') return agentActivate(args);
  if (command === 'agent' && subcommand === 'list') return agentList();

  console.log(`Usage:
  node .memoryofplanet/scripts/mop-core.mjs status
  node .memoryofplanet/scripts/mop-core.mjs validate
  node .memoryofplanet/scripts/mop-core.mjs setup --project-name NAME --name DISPLAY --codename CODE --password PASS --mode solo|team --conversation-language LANG --coding-language LANG --git-email EMAIL [--git-name NAME] [--github-username USER] [--github-url URL]
  node .memoryofplanet/scripts/mop-core.mjs login --codename CODE --password PASS
  node .memoryofplanet/scripts/mop-core.mjs member git-identity --actor CODE --name NAME --email EMAIL [--github-username USER]
  node .memoryofplanet/scripts/mop-core.mjs agent activate --actor CODE --role ROLE --title TITLE --name NAME
  node .memoryofplanet/scripts/mop-core.mjs agent list`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
