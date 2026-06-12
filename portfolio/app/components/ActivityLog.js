"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GitCommit, BookMarked, ArrowUpRight } from "lucide-react";

const LANG_CLASS = {
  JavaScript: "lang-js",
  TypeScript: "lang-ts",
  Python: "lang-py",
  HTML: "lang-html",
  CSS: "lang-css",
};

export default function ActivityLog({ repos, contributions, selectedDate, setSelectedDate, events }) {
  const selectedYear = selectedDate.getFullYear();

  // Generate available years from current year down to 2024
  const years = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const list = [];
    for (let y = currentYear; y >= 2024; y--) {
      list.push(y);
    }
    return list;
  }, []);

  // Generate months to display (December down to January, or starting from current month if current year)
  const monthsInYear = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startMonth = (selectedYear === currentYear) ? today.getMonth() : 11;
    
    const list = [];
    for (let m = startMonth; m >= 0; m--) {
      list.push(m);
    }
    return list;
  }, [selectedYear]);

  // Group activities and events by month for the selected year
  const monthlyTimeline = useMemo(() => {
    return monthsInYear.map((m) => {
      const monthDate = new Date(selectedYear, m, 1);
      const monthName = monthDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
      
      // Calculate commits for this month from calendar contributions
      const monthCommits = contributions ? contributions.reduce((sum, c) => {
        const d = new Date(c.date);
        if (d.getFullYear() === selectedYear && d.getMonth() === m) {
          return sum + (c.count || 0);
        }
        return sum;
      }, 0) : 0;

      // Extract public events for this month
      const monthEvents = events ? events.filter((ev) => {
        if (!ev.created_at) return false;
        const d = new Date(ev.created_at);
        return d.getFullYear() === selectedYear && d.getMonth() === m;
      }) : [];

      let commitActivities = [];
      let createdRepos = [];
      let totalCommitsCount = monthCommits;

      if (monthEvents.length > 0) {
        const pushes = monthEvents.filter((ev) => ev.type === "PushEvent");
        const creates = monthEvents.filter((ev) => ev.type === "CreateEvent" && ev.payload?.ref_type === "repository");
        
        const commitsByRepo = {};
        let tCommits = 0;
        pushes.forEach((p) => {
          const repoName = p.repo.name;
          const commits = p.payload?.commits || [];
          if (commits.length === 0) return;
          if (!commitsByRepo[repoName]) {
            commitsByRepo[repoName] = {
              name: repoName,
              htmlUrl: `https://github.com/${repoName}`,
              commitsList: [],
              commitsCount: 0
            };
          }
          commits.forEach((c) => {
            commitsByRepo[repoName].commitsList.push({
              sha: c.sha ? c.sha.substring(0, 7) : "0000000",
              message: c.message || "Pushed commits"
            });
            commitsByRepo[repoName].commitsCount++;
            tCommits++;
          });
        });
        
        commitActivities = Object.values(commitsByRepo).map((repo) => ({
          ...repo,
          percentage: tCommits > 0 ? (repo.commitsCount / tCommits) * 100 : 0
        }));
        
        createdRepos = creates.map((c) => {
          const d = new Date(c.created_at);
          return {
            name: c.repo.name,
            htmlUrl: `https://github.com/${c.repo.name}`,
            language: c.repo.name.toLowerCase().includes("web") ? "TypeScript" : "JavaScript",
            createdDate: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          };
        });

        totalCommitsCount = tCommits;
      } else {
        // Fallback simulation
        const activeRepos = repos ? repos.filter((repo) => {
          if (!repo.pushed_at) return false;
          const d = new Date(repo.pushed_at);
          return d.getFullYear() === selectedYear && d.getMonth() === m;
        }).sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)) : [];
        
        if (monthCommits > 0 && activeRepos.length > 0) {
          const counts = new Array(activeRepos.length).fill(0);
          let remaining = monthCommits;
          for (let i = 0; i < activeRepos.length && remaining > 0; i++) {
            counts[i] = 1;
            remaining--;
          }
          if (remaining > 0) {
            if (activeRepos.length === 1) {
              counts[0] += remaining;
            } else {
              const firstShare = Math.floor(remaining * 0.75);
              counts[0] += firstShare;
              remaining -= firstShare;
              if (remaining > 0 && activeRepos.length > 1) {
                const secondShare = Math.floor(remaining * 0.6);
                counts[1] += secondShare;
                remaining -= secondShare;
              }
              let idx = 0;
              while (remaining > 0) {
                counts[idx % activeRepos.length]++;
                remaining--;
                idx++;
              }
            }
          }
          commitActivities = activeRepos.map((repo, idx) => ({
            name: repo.name,
            htmlUrl: repo.html_url,
            commitsCount: counts[idx],
            percentage: (counts[idx] / monthCommits) * 100
          }));
        }

        createdRepos = repos ? repos.filter((repo) => {
          if (!repo.created_at) return false;
          const d = new Date(repo.created_at);
          return d.getFullYear() === selectedYear && d.getMonth() === m;
        }).map((repo) => {
          const d = new Date(repo.created_at);
          return {
            name: repo.name,
            htmlUrl: repo.html_url,
            language: repo.language || "Web",
            createdDate: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          };
        }) : [];
      }

      return {
        month: m,
        monthName,
        totalCommits: totalCommitsCount,
        commitActivities,
        createdRepos,
        hasActivity: commitActivities.length > 0 || createdRepos.length > 0
      };
    }).filter((monthData) => monthData.hasActivity);
  }, [monthsInYear, selectedYear, repos, contributions, events]);

  const hasActivity = monthlyTimeline.length > 0;

  return (
    <motion.div
      className="info-widget glass-card activity-widget"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="widget-header" style={{ marginBottom: 12 }}>
        <span className="header-dot" />
        ACTIVITY_LOG
      </div>

      {!hasActivity ? (
        <div className="activity-empty text-muted mono">
          Tiada aktiviti dicatatkan untuk tahun {selectedYear}.
        </div>
      ) : (
        <div className="activity-timeline-container">
          <div className="activity-scroll">
            {monthlyTimeline.map((monthData) => (
              <div key={monthData.monthName} className="activity-month-section" style={{ marginBottom: 20 }}>
                {/* Month Marker Header */}
                <div className="activity-month-header" style={{ marginBottom: 8 }}>
                  <span className="month-bullet" />
                  <span className="month-text">{monthData.monthName}</span>
                  <span className="month-line" />
                </div>

                <div className="activity-timeline-track">
                  {/* 1. Commit Activity Node */}
                  {monthData.commitActivities.length > 0 && (
                    <div className="activity-item">
                      <div className="activity-node">
                        <div className="node-icon-bg">
                          <GitCommit size={12} className="text-green" />
                        </div>
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">
                          Created {monthData.totalCommits} {monthData.totalCommits > 1 ? "commits" : "commit"} in {monthData.commitActivities.length} {monthData.commitActivities.length > 1 ? "repositories" : "repository"}
                        </div>
                        <div className="activity-repos-list">
                          {monthData.commitActivities.map((act) => (
                            <div key={act.name} className="activity-repo-row">
                              <div className="activity-repo-link-wrap">
                                <a
                                  href={act.htmlUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="activity-repo-link"
                                >
                                  {act.name}
                                  <ArrowUpRight size={10} className="arrow-icon" />
                                </a>
                                <span className="activity-repo-commits-count">
                                  {act.commitsCount} {act.commitsCount > 1 ? "commits" : "commit"}
                                </span>
                              </div>
                              
                              {/* Commits Visual Progress Bar */}
                              <div className="activity-progress-track">
                                <div
                                  className="activity-progress-fill"
                                  style={{ width: `${act.percentage}%` }}
                                />
                              </div>

                              {/* Live Commit Messages Feed */}
                              {act.commitsList && act.commitsList.length > 0 && (
                                <div className="activity-commits-feed" style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                                  {act.commitsList.slice(0, 3).map((c, cIdx) => (
                                    <div key={c.sha + "-" + cIdx} className="activity-commit-detail">
                                      <span className="activity-commit-sha">{c.sha}</span>
                                      <span className="activity-commit-msg" title={c.message}>{c.message.split("\n")[0]}</span>
                                    </div>
                                  ))}
                                  {act.commitsList.length > 3 && (
                                    <span className="activity-commits-more text-muted mono" style={{ fontSize: "0.5rem", paddingLeft: 8, opacity: 0.7 }}>
                                      + {act.commitsList.length - 3} more commits...
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Repository Creation Node */}
                  {monthData.createdRepos.length > 0 && (
                    <div className="activity-item">
                      <div className="activity-node">
                        <div className="node-icon-bg">
                          <BookMarked size={12} className="text-yellow" />
                        </div>
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">
                          Created {monthData.createdRepos.length} {monthData.createdRepos.length > 1 ? "repositories" : "repository"}
                        </div>
                        <div className="activity-created-list">
                          {monthData.createdRepos.map((repo) => {
                            const langClass = LANG_CLASS[repo.language] || "lang-default";
                            return (
                              <div key={repo.name} className="activity-created-row">
                                <a
                                  href={repo.htmlUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="activity-repo-link"
                                >
                                  {repo.name}
                                  <ArrowUpRight size={10} className="arrow-icon" />
                                </a>
                                <div className="activity-created-meta">
                                  <span className="lang-indicator" style={{ display: "inline-flex" }}>
                                    <span className={`lang-dot ${langClass}`} />
                                    <span className="lang-text" style={{ fontSize: "0.55rem" }}>
                                      {repo.language}
                                    </span>
                                  </span>
                                  <span className="activity-created-date">{repo.createdDate}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
