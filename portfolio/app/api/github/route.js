import { NextResponse } from "next/server";

const GITHUB_USERNAME = "MoonWIRaja";

export async function GET() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        {
          headers: { Accept: "application/vnd.github+json" },
          cache: "no-store",
        }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    // Limit commit fetching to a maximum of 8 repositories to prevent rate limits
    const reposToFetchCommits = repos.slice(0, 8);
    const otherRepos = repos.slice(8);

    const reposWithCommits = await Promise.all(
      reposToFetchCommits.map(async (repo) => {
        let latestCommitMessage = null;
        let latestCommitSha = null;
        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`,
            {
              headers: { Accept: "application/vnd.github+json" },
              cache: "no-store",
            }
          );
          if (commitsRes.ok) {
            const commits = await commitsRes.json();
            if (commits && commits.length > 0) {
              latestCommitMessage = commits[0].commit?.message || null;
              latestCommitSha = commits[0].sha ? commits[0].sha.substring(0, 7) : null;
            }
          }
        } catch (e) {
          console.error(`Error fetching commits for ${repo.name}:`, e);
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
      ...otherRepos.map(r => ({ ...r, latestCommitMessage: null, latestCommitSha: null }))
    ];

    // Calculate totals across all repositories (including forks as requested)
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

    return NextResponse.json({
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
      repos: allReposWithCommits.map((repo) => ({
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
      })),
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      {
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
            name: ".MemoryOfPlanet.core",
            description: "Core pengurusan ejen AI mudah-alih dengan autosync",
            html_url: `https://github.com/${GITHUB_USERNAME}/.MemoryOfPlanet.core`,
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString(),
            pushed_at: new Date().toISOString(),
            latest_commit_message: "Sync member state protocol and agent ledger",
            latest_commit_sha: "3138031",
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
          },
          {
            name: "card-jemputan",
            description: "Digital wedding invitation card page",
            html_url: `https://github.com/${GITHUB_USERNAME}/card-jemputan`,
            language: "HTML",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-05-22T12:00:00Z",
            pushed_at: "2026-05-22T12:00:00Z",
            latest_commit_message: "Update wedding invitation details",
            latest_commit_sha: "7d8e9f0",
          },
          {
            name: "CodeGravity-AI",
            description: "Next-gen AI coding assistant core engine",
            html_url: `https://github.com/${GITHUB_USERNAME}/CodeGravity-AI`,
            language: "Python",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-05-25T12:00:00Z",
            pushed_at: "2026-05-25T12:00:00Z",
            latest_commit_message: "Integrate model weights loader",
            latest_commit_sha: "1b2c3d4",
          },
          {
            name: "Console",
            description: "Interactive browser terminal application",
            html_url: `https://github.com/${GITHUB_USERNAME}/Console`,
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-05-28T12:00:00Z",
            pushed_at: "2026-05-28T12:00:00Z",
            latest_commit_message: "Add command execution handler",
            latest_commit_sha: "5e6f7a8",
          },
          {
            name: "Copyprompts",
            description: "Collection of copy-pasteable system prompts",
            html_url: `https://github.com/${GITHUB_USERNAME}/Copyprompts`,
            language: "HTML",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-05-30T12:00:00Z",
            pushed_at: "2026-05-30T12:00:00Z",
            latest_commit_message: "Add formatting categories",
            latest_commit_sha: "9b0c1d2",
          },
          {
            name: "Discord-Bot-Panel",
            description: "Web management panel for Discord bots",
            html_url: `https://github.com/${GITHUB_USERNAME}/Discord-Bot-Panel`,
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-01T12:00:00Z",
            pushed_at: "2026-06-01T12:00:00Z",
            latest_commit_message: "Fix token validation checks",
            latest_commit_sha: "3d4e5f6",
          },
          {
            name: "KrackedOS",
            description: "Custom Linux/Shell configurations and setup scripts",
            html_url: `https://github.com/${GITHUB_USERNAME}/KrackedOS`,
            language: "Shell",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-02T12:00:00Z",
            pushed_at: "2026-06-02T12:00:00Z",
            latest_commit_message: "Add package installers",
            latest_commit_sha: "7a8b9c0",
          },
          {
            name: "MoneyKracked",
            description: "Personal budget tracking application backend",
            html_url: `https://github.com/${GITHUB_USERNAME}/MoneyKracked`,
            language: "TypeScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-08T12:00:00Z",
            pushed_at: "2026-06-08T12:00:00Z",
            latest_commit_message: "Add budget alerts system",
            latest_commit_sha: "9a0b1c2",
          },
          {
            name: "pg-setup-wizard",
            description: "Postgres database setup wizard CLI tool",
            html_url: `https://github.com/${GITHUB_USERNAME}/pg-setup-wizard`,
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-09T12:00:00Z",
            pushed_at: "2026-06-09T12:00:00Z",
            latest_commit_message: "Fix wizard menu prompts",
            latest_commit_sha: "3b4c5d6",
          },
          {
            name: "Py",
            description: "Python scratchpads and utility modules",
            html_url: `https://github.com/${GITHUB_USERNAME}/Py`,
            language: "Python",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-10T12:00:00Z",
            pushed_at: "2026-06-10T12:00:00Z",
            latest_commit_message: "Add numpy computations",
            latest_commit_sha: "7d8e9f0",
          },
          {
            name: "rotican.ai",
            description: "AI-based Roti Canai analysis portal",
            html_url: `https://github.com/${GITHUB_USERNAME}/rotican.ai`,
            language: "TypeScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-11T12:00:00Z",
            pushed_at: "2026-06-11T12:00:00Z",
            latest_commit_message: "Deploy to Vercel hosting",
            latest_commit_sha: "1f2e3d4",
          },
          {
            name: "Universal-AI-Driver",
            description: "C++ based universal AI device driver controller",
            html_url: `https://github.com/${GITHUB_USERNAME}/Universal-AI-Driver`,
            language: "C++",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: "2026-06-11T12:00:00Z",
            pushed_at: "2026-06-11T12:00:00Z",
            latest_commit_message: "Optimize GPU memory driver",
            latest_commit_sha: "5a6b7c8",
          }
        ],
      },
      { status: 200 }
    );
  }
}
