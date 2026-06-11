# MemoryOfPlanet Core - Antigravity Instructions

This is the Antigravity managed-agent entry point. The provider-neutral project
rules are in the root `AGENTS.md`; apply those rules first when the root is
available in the environment.

## Authentication Gate

Before doing anything, read `.memoryofplanet/STATE.json` and follow
`.memoryofplanet/PROTOCOL.md`.

- If setup is pending, run only the setup wizard.
- If login is required, ask only for codename and password.
- When a role agent first appears, ask the user to name it before using it as a
  personal agent.

## Operating Rules

- Treat this workspace as a Ruflo / Claude Flow portable agent core.
- Use `.agents/skills/` for Antigravity-native skills.
- Use `.claude/skills/` as reference material only; do not assume Claude Code
  tools are available in Antigravity.
- Do not read or expose `.env` or `.env.*`.
- Run validation after configuration edits.
- Stop once the requested task is complete; do not keep expanding scope.

## Useful Local Paths

- Root instructions: `AGENTS.md`
- Claude instructions: `CLAUDE.md`
- Gemini instructions: `GEMINI.md`
- MCP server map: `.mcp.json`
- Ruflo runtime config: `.claude-flow/config.yaml`
- Antigravity skills: `.agents/skills/`
