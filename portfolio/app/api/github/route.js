import { NextResponse } from "next/server";

const GITHUB_USERNAME = "MoonWIRaja";

export async function GET() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 300 },
        }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    // Calculate totals across all repositories (including forks as requested)
    let totalStars = 0;
    let totalForks = 0;
    let totalWatching = 0;
    let latestUpdate = null;
    let latestRepoName = "";

    const publicRepos = repos; // Include forks and original repositories
    publicRepos.forEach((repo) => {
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
      repos: publicRepos.map((repo) => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count || 0,
        forks_count: repo.forks_count || 0,
        updated_at: repo.updated_at,
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
          public_repos: 5,
          followers: 10,
        },
        stats: { 
          stars: 12, 
          forks: 4, 
          watching: 8, 
          repos: 5, 
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
            stargazers_count: 3,
            forks_count: 1,
            updated_at: new Date().toISOString(),
          },
          {
            name: ".MemoryOfPlanet.core",
            description: "Core pengurusan ejen AI mudah-alih dengan autosync",
            html_url: `https://github.com/${GITHUB_USERNAME}/.MemoryOfPlanet.core`,
            language: "JavaScript",
            stargazers_count: 5,
            forks_count: 2,
            updated_at: new Date().toISOString(),
          },
          {
            name: "myney.core",
            description: "Sistem pengurusan kewangan peribadi moden",
            html_url: `https://github.com/${GITHUB_USERNAME}`,
            language: "TypeScript",
            stargazers_count: 4,
            forks_count: 1,
            updated_at: new Date().toISOString(),
          },
        ],
      },
      { status: 200 }
    );
  }
}
