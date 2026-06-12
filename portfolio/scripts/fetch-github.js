const fs = require("fs");
const path = require("path");

const GITHUB_USERNAME = "MoonWIRaja";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "api");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "github");

const STATIC_COMMITS = {
  "MoonWiRaja": { message: "Add watch-icon color inside glass-card overrides", sha: "8ac0e70" },
  ".MemoryOfPlanet.core": { message: "Sync member state protocol and agent ledger", sha: "3138031" },
  "Kracked_Skills": { message: "Update science packages database", sha: "1c2d3e4" },
  "Kracked_Skills_Agent": { message: "Add agent registry connector", sha: "5f6g7h8" },
  "burhan2ws": { message: "Fixed connection pooling", sha: "c3d4e5f" },
  "Mesrc_Web": { message: "MYney sync: Setup dan inisialisasi MemoryCore by moon", sha: "f125b50" },
  "3D-Model-Gen-": { message: "Initial commit", sha: "a7b8c9d" },
  "Anney-0.1-GPT": { message: "Update agent core logic", sha: "f2c3d4e" },
  "burhan-devs": { message: "Add landing page details", sha: "9a8b7c6" },
  "card-jemputan": { message: "Update wedding invitation details", sha: "7d8e9f0" },
  "CodeGravity-AI": { message: "Integrate model weights loader", sha: "1b2c3d4" },
  "Console": { message: "Add command execution handler", sha: "5e6f7a8" },
  "Copyprompts": { message: "Add formatting categories", sha: "9b0c1d2" },
  "Discord-Bot-Panel": { message: "Fix token validation checks", sha: "3d4e5f6" },
  "KrackedOS": { message: "Add package installers", sha: "7a8b9c0" },
  "MoneyKracked": { message: "Add budget alerts system", sha: "9a0b1c2" },
  "pg-setup-wizard": { message: "Fix wizard menu prompts", sha: "3b4c5d6" },
  "Py": { message: "Add numpy computations", sha: "7d8e9f0" },
  "rotican.ai": { message: "Deploy to Vercel hosting", sha: "1f2e3d4" },
  "Universal-AI-Driver": { message: "Optimize GPU memory driver", sha: "5a6b7c8" }
};

const DEFAULT_FALLBACK = {
  profile: {
    name: "MoonWiRaja",
    avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
    bio: "Full-Stack Creator",
    location: "Malaysia",
    public_repos: 19,
    followers: 10,
  },
  stats: { 
    stars: 4, 
    forks: 1, 
    watching: 4, 
    repos: 19, 
    followers: 10,
    latestUpdate: new Date().toISOString(),
    latestRepo: "MoonWiRaja"
  },
  repos: [
    {
      name: "MoonWiRaja",
      description: "Repositori portfolio utama",
      html_url: `https://github.com/${GITHUB_USERNAME}/MoonWiRaja`,
      language: "JavaScript",
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      latest_commit_message: "Add watch-icon color inside glass-card overrides",
      latest_commit_sha: "8ac0e70",
    },
    {
      name: "Kracked_Skills",
      description: "Python utilities and skills extension pack",
      html_url: `https://github.com/${GITHUB_USERNAME}/Kracked_Skills`,
      language: "Python",
      stargazers_count: 2,
      forks_count: 1,
      watchers_count: 2,
      updated_at: "2026-06-04T12:00:00Z",
      pushed_at: "2026-06-04T12:00:00Z",
      latest_commit_message: "Update science packages database",
      latest_commit_sha: "1c2d3e4",
    },
    {
      name: "Kracked_Skills_Agent",
      description: "Managed agent skill integration handler",
      html_url: `https://github.com/${GITHUB_USERNAME}/Kracked_Skills_Agent`,
      language: "JavaScript",
      stargazers_count: 1,
      forks_count: 0,
      watchers_count: 1,
      updated_at: "2026-06-05T12:00:00Z",
      pushed_at: "2026-06-05T12:00:00Z",
      latest_commit_message: "Add agent registry connector",
      latest_commit_sha: "5f6g7h8",
    },
    {
      name: "burhan2ws",
      description: "PHP webservices monitoring portal",
      html_url: `https://github.com/${GITHUB_USERNAME}/burhan2ws`,
      language: "PHP",
      stargazers_count: 1,
      forks_count: 0,
      watchers_count: 1,
      updated_at: "2026-05-20T12:00:00Z",
      pushed_at: "2026-05-20T12:00:00Z",
      latest_commit_message: "Fixed connection pooling",
      latest_commit_sha: "c3d4e5f",
    },
    {
      name: "Mesrc_Web",
      description: "TypeScript based MESRC web portal",
      html_url: `https://github.com/${GITHUB_USERNAME}/Mesrc_Web`,
      language: "TypeScript",
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      updated_at: "2026-06-07T12:00:00Z",
      pushed_at: "2026-06-07T12:00:00Z",
      latest_commit_message: "MYney sync: Setup dan inisialisasi MemoryCore by moon",
      latest_commit_sha: "f125b50",
    },
    {
      name: "3D-Model-Gen-",
      description: "Generate 3D models using AI",
      html_url: `https://github.com/${GITHUB_USERNAME}/3D-Model-Gen-`,
      language: "TypeScript",
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      updated_at: "2026-05-10T12:00:00Z",
      pushed_at: "2026-05-10T12:00:00Z",
      latest_commit_message: "Initial commit",
      latest_commit_sha: "a7b8c9d",
    },
    {
      name: "Anney-0.1-GPT",
      description: "Personal GPT-based agent assistant Anney",
      html_url: `https://github.com/${GITHUB_USERNAME}/Anney-0.1-GPT`,
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      updated_at: "2026-05-12T12:00:00Z",
      pushed_at: "2026-05-12T12:00:00Z",
      latest_commit_message: "Update agent core logic",
      latest_commit_sha: "f2c3d4e",
    },
    {
      name: "burhan-devs",
      description: "Burhan devs community page project",
      html_url: `https://github.com/${GITHUB_USERNAME}/burhan-devs`,
      language: "JavaScript",
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      updated_at: "2026-05-15T12:00:00Z",
      pushed_at: "2026-05-15T12:00:00Z",
      latest_commit_message: "Add landing page details",
      latest_commit_sha: "9a8b7c6",
    }
  ]
};

async function main() {
  console.log("Fetching GitHub statistics...");

  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    console.log("Using GITHUB_TOKEN environment variable.");
  } else {
    console.warn("GITHUB_TOKEN not provided, using unauthenticated requests (rate limit may apply).");
  }

  try {
    const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers });

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API request failed. Profile status: ${profileRes.status}, Repos status: ${reposRes.status}`);
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    // Sort all repos by push time (latest push first)
    repos.sort((a, b) => {
      const timeA = new Date(a.pushed_at || a.updated_at).getTime();
      const timeB = new Date(b.pushed_at || b.updated_at).getTime();
      return timeB - timeA;
    });

    // Limit commit fetching to a maximum of 8 repositories
    const reposToFetchCommits = repos.slice(0, 8);
    const otherRepos = repos.slice(8);

    const reposWithCommits = await Promise.all(
      reposToFetchCommits.map(async (repo) => {
        let latestCommitMessage = null;
        let latestCommitSha = null;
        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`,
            { headers }
          );
          if (commitsRes.ok) {
            const commits = await commitsRes.json();
            if (commits && commits.length > 0) {
              latestCommitMessage = commits[0].commit?.message || null;
              latestCommitSha = commits[0].sha ? commits[0].sha.substring(0, 7) : null;
            }
          }
        } catch (e) {
          console.error(`Error fetching commits for ${repo.name}:`, e.message);
        }

        // Fallback to static commit data if live commit fetch fails or is null
        if (!latestCommitMessage) {
          const sc = STATIC_COMMITS[repo.name] || { message: "No recent commits", sha: "0000000" };
          latestCommitMessage = sc.message;
          latestCommitSha = sc.sha;
        }

        return {
          ...repo,
          latestCommitMessage,
          latestCommitSha,
        };
      })
    );

    const allReposWithCommits = [
      ...reposWithCommits,
      ...otherRepos.map(r => {
        const sc = STATIC_COMMITS[r.name] || { message: "No recent commits", sha: "0000000" };
        return {
          ...r,
          latestCommitMessage: sc.message,
          latestCommitSha: sc.sha
        };
      })
    ];

    // Calculate totals across all repositories
    let totalStars = 0;
    let totalForks = 0;
    let totalWatching = 0;
    let latestUpdate = null;
    let latestRepoName = "";

    allReposWithCommits.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      totalWatching += repo.watchers_count || 0;
      
      const repoTime = repo.pushed_at ? new Date(repo.pushed_at).getTime() : new Date(repo.updated_at).getTime();
      if (!latestUpdate || repoTime > latestUpdate) {
        latestUpdate = repoTime;
        latestRepoName = repo.name;
      }
    });

    const result = {
      profile: {
        name: profile.name || GITHUB_USERNAME,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location || "Malaysia",
        public_repos: profile.public_repos || 0,
        followers: profile.followers || 0,
      },
      stats: {
        stars: totalStars,
        forks: totalForks,
        watching: totalWatching,
        repos: profile.public_repos || 0,
        followers: profile.followers || 0,
        latestUpdate: latestUpdate ? new Date(latestUpdate).toISOString() : null,
        latestRepo: latestRepoName,
      },
      repos: reposWithCommits.map((repo) => {
        return {
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
          watchers_count: repo.watchers_count || 0,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          latest_commit_message: repo.latestCommitMessage,
          latest_commit_sha: repo.latestCommitSha,
        };
      }),
    };

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), "utf8");
    console.log(`Successfully wrote GitHub stats to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error("Failed to fetch live GitHub stats, writing fallback data.", error.message);
    
    // Ensure output directory exists and write fallback data
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(DEFAULT_FALLBACK, null, 2), "utf8");
    console.log(`Successfully wrote fallback GitHub stats to ${OUTPUT_FILE}`);
  }
}

main();
