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

export default function ActivityLog({ repos, contributions, selectedDate, events }) {
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();

  const formattedMonthName = useMemo(() => {
    return selectedDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }, [selectedDate]);

  // Extract total commits in this month from real scraped contributions
  const totalMonthCommits = useMemo(() => {
    if (!contributions) return 0;
    return contributions.reduce((sum, c) => {
      const d = new Date(c.date);
      if (d.getFullYear() === selectedYear && d.getMonth() === selectedMonth) {
        return sum + (c.count || 0);
      }
      return sum;
    }, 0);
  }, [contributions, selectedYear, selectedMonth]);

  // Extract commit activity per repository (distributing monthly total commits to active repos)
  const commitActivities = useMemo(() => {
    if (!repos) return [];
    
    // Filter repos updated/pushed in the selected month
    const activeRepos = repos
      .filter((repo) => {
        if (!repo.pushed_at) return false;
        const d = new Date(repo.pushed_at);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      })
      // Sort by push date descending
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (totalMonthCommits === 0 || activeRepos.length === 0) return [];

    const counts = new Array(activeRepos.length).fill(0);
    let remaining = totalMonthCommits;

    // Distribute at least 1 commit to each active repository
    for (let i = 0; i < activeRepos.length && remaining > 0; i++) {
      counts[i] = 1;
      remaining--;
    }

    // Allocate the remaining commits (skewed heavily to the most recently pushed repos)
    if (remaining > 0) {
      if (activeRepos.length === 1) {
        counts[0] += remaining;
      } else {
        // First repo gets 75% of remaining, second gets 15%, rest divided
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

    return activeRepos.map((repo, idx) => ({
      name: repo.name,
      htmlUrl: repo.html_url,
      commitsCount: counts[idx],
      percentage: (counts[idx] / totalMonthCommits) * 100,
    }));
  }, [repos, totalMonthCommits, selectedYear, selectedMonth]);

  // Extract repository creation logs in selected month
  const createdRepos = useMemo(() => {
    if (!repos) return [];
    return repos
      .filter((repo) => {
        if (!repo.created_at) return false;
        const d = new Date(repo.created_at);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      })
      .map((repo) => {
        const d = new Date(repo.created_at);
        const formattedDate = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return {
          name: repo.name,
          htmlUrl: repo.html_url,
          language: repo.language || "Web",
          createdDate: formattedDate,
        };
      });
  }, [repos, selectedYear, selectedMonth]);

  // Extract actual live events for this month if available
  const liveMonthEvents = useMemo(() => {
    if (!events || events.length === 0) return null;
    
    const filtered = events.filter((ev) => {
      if (!ev.created_at) return false;
      const d = new Date(ev.created_at);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });

    if (filtered.length === 0) return null;

    const pushes = filtered.filter((ev) => ev.type === "PushEvent");
    const creates = filtered.filter((ev) => ev.type === "CreateEvent" && ev.payload?.ref_type === "repository");

    const commitsByRepo = {};
    let totalCommits = 0;

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
        totalCommits++;
      });
    });

    const repoCommitsArray = Object.values(commitsByRepo).map((repo) => ({
      ...repo,
      percentage: totalCommits > 0 ? (repo.commitsCount / totalCommits) * 100 : 0
    }));

    const createdReposList = creates.map((c) => {
      const d = new Date(c.created_at);
      const formattedDate = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      return {
        name: c.repo.name,
        htmlUrl: `https://github.com/${c.repo.name}`,
        language: c.repo.name.toLowerCase().includes("web") ? "TypeScript" : "JavaScript",
        createdDate: formattedDate
      };
    });

    if (repoCommitsArray.length === 0 && createdReposList.length === 0) return null;

    return {
      totalCommits,
      commitActivities: repoCommitsArray,
      createdRepos: createdReposList
    };
  }, [events, selectedYear, selectedMonth]);

  const displayTotalCommits = liveMonthEvents ? liveMonthEvents.totalCommits : totalMonthCommits;
  const displayCommitActivities = liveMonthEvents ? liveMonthEvents.commitActivities : commitActivities;
  const displayCreatedRepos = liveMonthEvents ? liveMonthEvents.createdRepos : createdRepos;
  const hasActivity = displayCommitActivities.length > 0 || displayCreatedRepos.length > 0;

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
          Tiada aktiviti dicatatkan untuk bulan ini.
        </div>
      ) : (
        <div className="activity-timeline-container">
          {/* Month Marker Header */}
          <div className="activity-month-header">
            <span className="month-bullet" />
            <span className="month-text">{formattedMonthName}</span>
            <span className="month-line" />
          </div>

          <div className="activity-scroll">
            <div className="activity-timeline-track">
              {/* 1. Commit Activity Node */}
              {displayCommitActivities.length > 0 && (
                <div className="activity-item">
                  <div className="activity-node">
                    <div className="node-icon-bg">
                      <GitCommit size={12} className="text-green" />
                    </div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      Created {displayTotalCommits} {displayTotalCommits > 1 ? "commits" : "commit"} in {displayCommitActivities.length} {displayCommitActivities.length > 1 ? "repositories" : "repository"}
                    </div>
                    <div className="activity-repos-list">
                      {displayCommitActivities.map((act) => (
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
              {displayCreatedRepos.length > 0 && (
                <div className="activity-item">
                  <div className="activity-node">
                    <div className="node-icon-bg">
                      <BookMarked size={12} className="text-yellow" />
                    </div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      Created {displayCreatedRepos.length} {displayCreatedRepos.length > 1 ? "repositories" : "repository"}
                    </div>
                    <div className="activity-created-list">
                      {displayCreatedRepos.map((repo) => {
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
        </div>
      )}
    </motion.div>
  );
}
