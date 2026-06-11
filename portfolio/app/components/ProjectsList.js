"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star, GitFork, BookMarked, Eye } from "lucide-react";

const LANG_CLASS = {
  JavaScript: "lang-js", 
  TypeScript: "lang-ts", 
  Python: "lang-py",
  HTML: "lang-html", 
  CSS: "lang-css",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }); // e.g. "11 Jun 2026"
};

function ProjectCard({ repo, index }) {
  const langClass = LANG_CLASS[repo.language] || "lang-default";

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="project-name">
        <span className="project-title-text">
          <BookMarked size={13} className="project-icon" />
          {repo.name}
        </span>
        <ArrowUpRight className="arrow-icon" size={13} />
      </div>
      
      {repo.description ? (
        <p className="project-desc">{repo.description}</p>
      ) : (
        <p className="project-desc no-desc">Tiada penerangan disediakan.</p>
      )}
      
      <div className="project-meta">
        <div className="meta-left">
          <span className="lang-indicator">
            <span className={`lang-dot ${langClass}`} />
            <span className="lang-text">{repo.language || "Web"}</span>
          </span>
          <span className="meta-stat" title="Stars">
            <Star size={11} className="stat-icon star-icon" />
            <span className="stat-value">{repo.stargazers_count}</span>
          </span>
          <span className="meta-stat" title="Forks">
            <GitFork size={11} className="stat-icon fork-icon" />
            <span className="stat-value">{repo.forks_count}</span>
          </span>
          <span className="meta-stat" title="Watching">
            <Eye size={11} className="stat-icon watch-icon" />
            <span className="stat-value">{repo.watchers_count ?? 0}</span>
          </span>
        </div>
        <div className="meta-right">
          <span className="update-date" title="Tarikh push/komit terakhir">
            UP: {formatDate(repo.pushed_at || repo.updated_at)}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line w-75" />
      <div className="skeleton-line w-full" />
      <div className="skeleton-line w-50" />
    </div>
  );
}

export default function ProjectsList({ repos, loading }) {
  // Sort repositories by pushed_at or updated_at descending (latest commit push first)
  const sortedRepos = repos 
    ? [...repos].sort((a, b) => {
        const timeA = new Date(a.pushed_at || a.updated_at).getTime();
        const timeB = new Date(b.pushed_at || b.updated_at).getTime();
        return timeB - timeA;
      })
    : [];

  return (
    <motion.div
      className="right-panel glass-card"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="projects-header">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="header-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 4px var(--accent-green)" }} />
          ACTIVE_REPOSITORIES
        </span>
        {repos && (
          <span className="projects-count">{repos.length}</span>
        )}
      </div>
      
      <div className="projects-list console-scroll">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : sortedRepos && sortedRepos.length > 0 ? (
          sortedRepos.map((repo, i) => <ProjectCard key={repo.name} repo={repo} index={i} />)
        ) : (
          <p className="text-muted mono" style={{ fontSize: "0.7rem", padding: 16 }}>
            Tiada repositori ditemui.
          </p>
        )}
      </div>
    </motion.div>
  );
}
