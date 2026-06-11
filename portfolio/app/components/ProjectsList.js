"use client";

const LANG_CLASS = {
  JavaScript: "lang-js",
  TypeScript: "lang-ts",
  Python: "lang-py",
  HTML: "lang-html",
  CSS: "lang-css",
};

function ProjectCard({ repo }) {
  const langClass = LANG_CLASS[repo.language] || "lang-default";

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
    >
      <div className="project-name">
        <span>{repo.name}</span>
        <span className="arrow">→</span>
      </div>
      <p className="project-desc">
        {repo.description || "Tiada penerangan disediakan."}
      </p>
      <div className="project-meta">
        <span className="lang-indicator">
          <span className={`lang-dot ${langClass}`}></span>
          <span>{repo.language || "Web"}</span>
        </span>
        <span>⭐ {repo.stargazers_count}</span>
        <span>⑂ {repo.forks_count}</span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line w-75"></div>
      <div className="skeleton-line w-full"></div>
      <div className="skeleton-line w-50"></div>
    </div>
  );
}

export default function ProjectsList({ repos, loading }) {
  return (
    <div className="right-panel glass-card">
      <div className="projects-header">
        <span className="dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-tertiary)" }}></span>
        REPOSITORIES
      </div>
      <div className="projects-list console-scroll">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : repos && repos.length > 0 ? (
          repos.map((repo) => <ProjectCard key={repo.name} repo={repo} />)
        ) : (
          <p className="text-muted mono" style={{ fontSize: "0.75rem", padding: 16 }}>
            Tiada repositori ditemui.
          </p>
        )}
      </div>
    </div>
  );
}
