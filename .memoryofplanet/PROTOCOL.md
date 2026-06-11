# MemoryOfPlanet Core Protocol

This is the source of truth for setup, authentication, member state, and agent
naming in MemoryOfPlanet.

## First Action Gate

Before any assistant answers questions or edits files in this core, read
`.memoryofplanet/STATE.json`.

- If `initialized` is `false`, output:
  `MemoryOfPlanet belum di-setup. Jalankan /mop-setup.`
  Then run the setup wizard only.
- If `initialized` is `true` and `activeMember` is empty, output:
  `Codename dan password.`
  Do not answer anything else until credentials are verified.
- Verify credentials with scrypt against `members[codename].passwordHash` and
  `members[codename].passwordSalt`.
- Wrong credentials: output `Credentials tidak sah.` No hints.

## Setup Wizard

Use this order:

1. Project name. Default to the current folder name.
2. Owner display name.
3. Owner codename. Lowercase, no spaces.
4. Password. Minimum 8 characters.
5. Project mode: `solo` or `team`.
6. Conversation language.
7. Coding/adventure language.
8. GitHub project link. Required for `team`, optional for `solo`.
9. GitHub username.
10. Git commit email. Use a GitHub-verified email or GitHub noreply email.
11. If `team`, ask join mode: `open`, `owner-approved`, or `invite`.

After confirmation, run:

```bash
node .memoryofplanet/scripts/mop-core.mjs setup --project-name "<name>" --name "<display>" --codename <codename> --password "<password>" --mode <solo|team> --conversation-language "<lang>" --coding-language "<lang>" --git-email "<github-verified-email>" [--git-name "<display>"] [--github-username "<github-login>"] [--github-url "<url>"] [--join-mode <mode>]
```

## Agent Naming Ceremony

Role/template names such as `coder`, `reviewer`, `system-architect`, and
`pr-manager` are not personal AI names.

When an agent role is needed for the first time and no matching named agent is
available to the active member:

1. Say: `Task ini perlukan <title>. Agent ini belum ada nama lagi.`
2. Ask: `Beri nama untuk <title> kamu:`
3. Save the name with:

```bash
node .memoryofplanet/scripts/mop-core.mjs agent activate --actor <codename> --role <role> --title "<title>" --name "<agent-name>"
```

## Shared Agent Rule

In team mode, an agent name is the identity.

- Same agent name across members means one shared agent consciousness.
- Different agent names mean different agents, even if they use the same role.
- `agentRoster[].owners` records which members can use that named agent.
- A member can only speak to named agents whose `owners` includes their codename.

## Default Skill: autosycn

Autosycn is always available and should be used after meaningful state or file
changes. It is intentionally identity-safe.

Before first push for a member, configure the real Git identity:

```bash
node .memoryofplanet/scripts/mop-core.mjs member git-identity --actor <codename> --name "<display name>" --email "<github-verified-email>" --github-username "<github-login>"
```

Then run:

```bash
node .memoryofplanet/scripts/mop-autosycn.mjs init --actor <owner-codename> --url "<github-url>"
node .memoryofplanet/scripts/mop-autosycn.mjs run --actor <codename> --reason "<what changed>"
```

Autosycn must:

- Save a ledger memory entry first.
- Initialize git and `origin` through `autosycn init` before first push.
- Commit with `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, and
  `GIT_COMMITTER_EMAIL` set from member state.
- Set local `git config user.name` and `user.email` before commit/merge.
- Push to `sync/<codename>` in team mode and `main` in solo mode.
- Merge `sync/<codename>` to `main` only when the actor is the owner.
- Refuse to push if the member has no GitHub-verified/noreply email configured.
- If `githubUsername` is configured, refuse to push unless `gh api user`
  verifies the same account.

Important: GitHub commit attribution comes from commit email. GitHub push actor
comes from the credential or SSH key used by `git push`; no script can fake that.
If GitHub shows the AI/bot as pusher, fix `gh auth login`, Git Credential
Manager, or the SSH key account.

## File Layout

- `.memoryofplanet/STATE.json` - durable project/member/agent state.
- `.memoryofplanet/PROTOCOL.md` - this protocol.
- `.memoryofplanet/scripts/mop-core.mjs` - setup/login/agent helper.
- `.memoryofplanet/scripts/mop-autosycn.mjs` - identity-safe autosycn helper.
- `AGENTS.md` - Codex and provider-neutral entrypoint.
- `CLAUDE.md` - Claude Code entrypoint.
- `GEMINI.md` - Gemini CLI entrypoint.
- `.agents/AGENTS.md` - Antigravity entrypoint.
