"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star, GitFork, BookMarked } from "lucide-react";

const LANG_CLASS = {
  JavaScript: "lang-js", 
  TypeScript: "lang-ts", 
  Python: "lang-py",
  HTML: "lang-html", 
  CSS: "lang-css",
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
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <BookMarked size={11} className="text-secondary" />
          {repo.name}
        </span>
        <ArrowUpRight className="arrow-icon" />
      </div>
      <p className="project-desc">
        {repo.description || "Tiada penerangan disediakan."}
      </p>
      <div className="project-meta">
        <span className="lang-indicator">
          <span className={`lang-dot ${langClass}`} />
          <span>{repo.language || "Web"}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }} className="mono">
          <Star size={9} className="text-yellow" /> {repo.stargazers_count}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }} className="mono">
          <GitFork size={9} className="text-cyan" /> {repo.forks_count}
        </span>
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
        ) : repos && repos.length > 0 ? (
          repos.map((repo, i) => <ProjectCard key={repo.name} repo={repo} index={i} />)
        ) : (
          <p className="text-muted mono" style={{ fontSize: "0.7rem", padding: 16 }}>
            Tiada repositori ditemui.
          </p>
        )}
      </div>
    </motion.div>
  );
}
