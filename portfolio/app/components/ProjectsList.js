"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Settings, BookMarked } from "lucide-react";

const LANG_COLOR = {
  JavaScript: "var(--highlight-yellow)", 
  TypeScript: "var(--accent-cyan)", 
  Python: "var(--accent-amber)",
  HTML: "var(--accent-rose)", 
  CSS: "var(--accent-violet)",
};

function ProjectCard({ repo, index }) {
  const langColor = LANG_COLOR[repo.language] || "var(--accent-green)";

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
        {/* Mock avatar / language block */}
        <div 
          style={{ 
            width: "24px", 
            height: "24px", 
            borderRadius: "4px", 
            backgroundColor: "var(--border-default)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <BookMarked size={10} style={{ color: langColor }} />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <span className="project-name" style={{ fontSize: "0.68rem", marginBottom: 0 }}>
            {repo.name.toLowerCase()}
          </span>
          <span className="mono" style={{ fontSize: "0.52rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
            {repo.language || "Web"} · ★ {repo.stargazers_count}
          </span>
        </div>
      </div>

      <button 
        type="button" 
        style={{ padding: 4, opacity: 0.6 }}
        onClick={(e) => {
          e.preventDefault();
          window.open(repo.html_url, "_blank");
        }}
        aria-label={`Open repository ${repo.name}`}
      >
        <Settings size={10} className="text-secondary" />
      </button>
    </motion.a>
  );
}

function SkeletonCard() {
  return (
    <div className="project-card" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "4px", backgroundColor: "rgba(0,0,0,0.06)", animation: "shimmer 1.8s infinite" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: "8px", width: "60%", backgroundColor: "rgba(0,0,0,0.06)", borderRadius: "4px", marginBottom: "4px", animation: "shimmer 1.8s infinite" }} />
        <div style={{ height: "6px", width: "40%", backgroundColor: "rgba(0,0,0,0.04)", borderRadius: "4px", animation: "shimmer 1.8s infinite" }} />
      </div>
    </div>
  );
}

export default function ProjectsList({ repos, loading }) {
  const [filter, setFilter] = useState("");

  const filteredRepos = repos 
    ? repos.filter(r => r.name.toLowerCase().includes(filter.toLowerCase())) 
    : [];

  return (
    <motion.div
      className="right-panel glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="projects-header">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="header-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-green)" }} />
          ACTIVE_PROCESSES
        </span>
        {repos && (
          <span className="projects-count" style={{ background: "rgba(0,0,0,0.08)", color: "var(--text-primary)" }}>
            {filteredRepos.length}
          </span>
        )}
      </div>

      <div style={{ padding: "6px 8px 0", position: "relative" }}>
        <input 
          type="text" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by Name or Language..." 
          style={{ 
            border: "1px solid var(--border-subtle)", 
            borderRadius: "var(--r-sm)", 
            padding: "5px 8px 5px 22px", 
            fontSize: "0.55rem", 
            background: "rgba(0,0,0,0.02)", 
            width: "100%", 
            fontFamily: "var(--font-mono)",
            outline: "none",
            color: "var(--text-primary)"
          }} 
        />
        <Search size={8} style={{ position: "absolute", left: "14px", top: "14px", opacity: 0.4 }} />
      </div>
      
      <div className="projects-list console-scroll">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredRepos.length > 0 ? (
          filteredRepos.map((repo, i) => <ProjectCard key={repo.name} repo={repo} index={i} />)
        ) : (
          <p className="text-muted mono" style={{ fontSize: "0.55rem", padding: "12px 6px" }}>
            Tiada proses ditemui.
          </p>
        )}
      </div>
    </motion.div>
  );
}
