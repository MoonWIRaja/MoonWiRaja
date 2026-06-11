---
name: autosycn
description: Use this after every meaningful MemoryOfPlanet state or file change to save memory, commit as the real active user, push to the correct branch, and merge to main when allowed.
---

# Autosycn

Autosycn is MemoryOfPlanet's identity-safe autosync skill. Use:

```bash
node .memoryofplanet/scripts/mop-autosycn.mjs init --actor <owner-codename> --url "<github-url>"
node .memoryofplanet/scripts/mop-autosycn.mjs run --actor <codename> --reason "<what changed>"
```

Before first use, configure the user's real Git identity:

```bash
node .memoryofplanet/scripts/mop-core.mjs member git-identity --actor <codename> --name "<display name>" --email "<github-verified-email>" --github-username "<github-login>"
```

The helper sets Git author and committer environment variables and local git
config from MemoryOfPlanet state. It refuses to push without a configured email.
If a GitHub username is configured, it also refuses to push unless `gh api user`
matches that username. The branch name does not control GitHub attribution;
commit email and push credentials do.
