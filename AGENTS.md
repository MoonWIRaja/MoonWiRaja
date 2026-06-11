# MemoryOfPlanet Core - Cross-Agent Instructions

## Authentication Gate - First Action

Before doing anything in this workspace, read `.memoryofplanet/STATE.json` and
follow `.memoryofplanet/PROTOCOL.md`.

- `initialized: false` -> output `MemoryOfPlanet belum di-setup. Jalankan /mop-setup.` Run the setup wizard only.
- `initialized: true` with no `activeMember` -> output `Codename dan password.` Do not continue until verified.
- Verify credentials through `node .memoryofplanet/scripts/mop-core.mjs login --codename <codename> --password "<password>"`.
- Wrong credentials -> output `Credentials tidak sah.`

For `/mop-setup`, ask in order: project name (default folder name), owner display
name, owner codename, password, solo/team, conversation language, coding
language, GitHub link, GitHub username, Git commit email, and join mode if team.

Agent role/template names are not personal AI names. When a role agent is first
needed, ask the user to name it and save it with `mop-core.mjs agent activate`.
In team mode, the same agent name is shared across members; different names are
different agents.

Default skill: `autosycn`. After meaningful changes, use
`.memoryofplanet/scripts/mop-autosycn.mjs`. It must commit and merge with the
real member Git identity from state, never with the AI tool identity.

This directory is a portable Ruflo / Claude Flow agent core. It must work across
Claude Code, Codex / ChatGPT coding surfaces, Gemini CLI, and Google
Antigravity. Treat this file as the provider-neutral source of truth.

## Provider Entry Points

- Claude Code: read `CLAUDE.md` and `.claude/settings.json`.
- Codex / ChatGPT coding agents: read this `AGENTS.md`.
- Gemini CLI: read `GEMINI.md`, which imports this file, and `.gemini/settings.json`.
- Antigravity managed agents: read `.agents/AGENTS.md` and `.agents/skills/`.

## Core Rules

- Do what the user asked, with the smallest safe change.
- Always read an existing file before editing it.
- Do not create root working files, throwaway tests, or generated logs.
- Never read, print, copy, commit, or summarize `.env` or `.env.*` files.
- Validate JSON, TOML, YAML, and Markdown after changing configuration.
- Keep provider-specific commands isolated. If a tool name is unavailable in the
  current agent surface, use the nearest local shell or MCP equivalent.
- Prefer `rg` or `rg --files` for search. If unavailable, use the next fastest
  platform-native search.
- Do not assume Claude-only hooks, slash commands, or Agent tools exist outside
  Claude Code. Translate the workflow into the current provider's tools.

## Ruflo Runtime

The Ruflo runtime lives in `.claude-flow/`. The shared MCP declaration is in
`.mcp.json`. Claude-specific hooks and helper scripts live in `.claude/`.

Use these commands when the current environment supports shell execution:

```bash
npx -y ruflo@latest doctor --fix
npx -y ruflo@latest mcp start
npx -y ruflo@latest swarm status
npx -y ruflo@latest memory search --query "task keywords"
```

Do not start long-running daemons unless the user asked for it. Prefer status and
diagnostic commands before making changes.

## Cross-Provider Adaptation

- If instructions mention `SendMessage`, `Agent`, or Claude subagents, map the
  idea to the current provider's delegation model. If no delegation tool exists,
  perform the task directly and keep a clear checklist.
- If instructions mention Claude hooks, treat them as policy guidance in Codex,
  Gemini, or Antigravity unless that provider has an equivalent hook system.
- If instructions mention `.claude/skills`, use those files as references. For
  Antigravity, canonical portable skills should be placed under `.agents/skills/`.
- If MCP is available, prefer MCP for live tools and stateful integrations. If
  MCP is unavailable, continue with filesystem and shell inspection.

## Verification

Before finishing any configuration change in this core:

- Parse `.mcp.json`, `.claude/settings.json`, and `.gemini/settings.json` when
  present.
- Check TOML files with a parser if one is available.
- Confirm no secrets were introduced.
- Report which provider surfaces are covered and which need manual auth.
