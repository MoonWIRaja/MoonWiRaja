"use client";

import { motion } from "framer-motion";
import { Star, GitFork, FolderGit2, Users } from "lucide-react";

const items = [
  { key: "stars", icon: Star, label: "Stars", color: "var(--accent-amber)" },
  { key: "forks", icon: GitFork, label: "Forks", color: "var(--accent-cyan)" },
  { key: "repos", icon: FolderGit2, label: "Repos", color: "var(--accent-red)" },
  { key: "followers", icon: Users, label: "Followers", color: "var(--accent-green)" },
];

export default function StatsStrip({ stats }) {
  return (
    <div className="stats-strip">
      {items.map((item, i) => {
        const Icon = item.icon;
        const value = stats?.[item.key] ?? "–";
        return (
          <motion.div
            key={item.key}
            className="stat-tile glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
          >
            <div className="tile-accent" />
            <div className="stat-icon">
              <Icon size={18} style={{ color: item.color }} />
            </div>
            <motion.div
              className="stat-number"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.div>
            <div className="stat-label">{item.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
