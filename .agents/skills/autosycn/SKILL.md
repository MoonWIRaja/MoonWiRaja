---
name: autosycn
description: Use this after every meaningful MemoryOfPlanet state or file change to save memory, commit as the real active user, push to the correct branch, and merge to main when allowed.
---

# Autosycn

Autosycn is MemoryOfPlanet's identity-safe autosync skill. The name keeps the
project spelling `autosycn`, but the behavior is autosync.

## Required Identity Rule

Never let commits fall back to the AI tool identity. Before pushing, the helper
must have a user Git identity:

```bash
node .memoryofplanet/scripts/mop-core.mjs member git-identity --actor <codename> --name "<display name>" --email "<github-verified-email>" --github-username "<github-login>"
```

Use a GitHub-verified email or the user's GitHub noreply email. The branch name
alone, such as `sync/moon`, does not make GitHub attribute the commit to Moon.
GitHub maps commit authors by email, and push actor by the credentials or SSH
key used for `git push`.

## Flow

First-time git setup:

```bash
node .memoryofplanet/scripts/mop-autosycn.mjs init --actor <owner-codename> --url "<github-url>"
```

After a state or file change:

```bash
node .memoryofplanet/scripts/mop-autosycn.mjs run --actor <codename> --reason "<what changed>"
```

Manual steps:

```bash
node .memoryofplanet/scripts/mop-autosycn.mjs memory --actor <codename> --summary "<what changed>"
node .memoryofplanet/scripts/mop-autosycn.mjs push --actor <codename> --reason "<what changed>"
node .memoryofplanet/scripts/mop-autosycn.mjs merge --actor <owner-codename> --from <codename> --reason "Merge sync/<codename>: <what changed>"
```

## Guarantees

- Can initialize a missing git repository, set `origin`, commit a baseline, and
  push `main`.
- Sets `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, and
  `GIT_COMMITTER_EMAIL` from MemoryOfPlanet member state.
- Sets local `git config user.name` and `user.email` before commit/merge.
- Refuses to push when the user's Git email is missing.
- If a GitHub username is configured, refuses to push unless `gh api user`
  verifies the same username. Disable `verifyGhUserWhenConfigured` only for
  deliberate SSH-only workflows.

## Limit

No script can fake the GitHub push actor. The push actor is controlled by the
GitHub credential or SSH key on the machine. If GitHub still shows a bot as the
pusher, fix `gh auth login`, Git Credential Manager, or the SSH key account.
