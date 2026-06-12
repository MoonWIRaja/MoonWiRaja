"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TermIcon, Server, Cpu, Monitor, Zap, Shield } from "lucide-react";
import StatusBar from "./components/StatusBar";
import ProfileCard from "./components/ProfileCard";
import ServerMonitor from "./components/ServerMonitor";
import Console from "./components/Console";
import ProjectsList from "./components/ProjectsList";
import Contributions from "./components/Contributions";
import ActivityLog from "./components/ActivityLog";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(basePath + "/api/github?v=" + Date.now())
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
        
        // Fetch live GitHub events client-side to capture org and recent commits
        fetch("https://api.github.com/users/MoonWIRaja/events")
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Events API failed with status " + res.status);
          })
          .then((eventsList) => {
            if (!Array.isArray(eventsList)) return;
            setEvents(eventsList);

            // Group events by repo
            const eventReposMap = {};
            eventsList.forEach((ev) => {
              if (!ev.repo || !ev.repo.name) return;
              const repoName = ev.repo.name;
              const evTime = new Date(ev.created_at).getTime();
              if (!eventReposMap[repoName] || evTime > eventReposMap[repoName].time) {
                eventReposMap[repoName] = {
                  time: evTime,
                  createdAt: ev.created_at,
                  event: ev
                };
              }
            });

            // Merge events data into repos list dynamically
            setData((currentData) => {
              if (!currentData) return currentData;
              const updatedRepos = [...(currentData.repos || [])];

              Object.keys(eventReposMap).forEach((repoName) => {
                const evInfo = eventReposMap[repoName];
                const existingIndex = updatedRepos.findIndex(
                  (r) => r.name.toLowerCase() === repoName.toLowerCase() || 
                         r.name.toLowerCase() === repoName.split("/")[1]?.toLowerCase()
                );

                let commitMsg = null;
                let commitSha = null;
                if (evInfo.event.type === "PushEvent") {
                  const commits = evInfo.event.payload?.commits;
                  if (commits && commits.length > 0) {
                    commitMsg = commits[0].message;
                    commitSha = commits[0].sha ? commits[0].sha.substring(0, 7) : null;
                  }
                }

                if (existingIndex !== -1) {
                  const existingRepo = updatedRepos[existingIndex];
                  const existingTime = new Date(existingRepo.pushed_at || existingRepo.updated_at).getTime();
                  if (evInfo.time > existingTime) {
                    updatedRepos[existingIndex] = {
                      ...existingRepo,
                      pushed_at: evInfo.createdAt,
                      updated_at: evInfo.createdAt,
                      latest_commit_message: commitMsg || existingRepo.latest_commit_message,
                      latest_commit_sha: commitSha || existingRepo.latest_commit_sha
                    };
                  }
                } else {
                  const isOrg = repoName.includes("/");
                  const newRepo = {
                    name: repoName,
                    description: isOrg ? `Contribution to organization repository` : `Public repository`,
                    html_url: `https://github.com/${repoName}`,
                    language: repoName.toLowerCase().includes("web") ? "TypeScript" : "JavaScript",
                    stargazers_count: 0,
                    forks_count: 0,
                    watchers_count: 0,
                    created_at: evInfo.event.type === "CreateEvent" && evInfo.event.payload.ref_type === "repository" 
                      ? evInfo.createdAt 
                      : null,
                    updated_at: evInfo.createdAt,
                    pushed_at: evInfo.createdAt,
                    latest_commit_message: commitMsg || "Pushed commits to repository",
                    latest_commit_sha: commitSha || "0000000"
                  };
                  updatedRepos.push(newRepo);
                }
              });

              return {
                ...currentData,
                repos: updatedRepos,
                stats: {
                  ...currentData.stats,
                  repos: updatedRepos.length
                }
              };
            });
          })
          .catch((e) => {
            console.warn("Could not load live GitHub events, using build-time fallback:", e.message);
          });
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Dashboard Viewport */}
      <div className="dashboard-viewport">
        <StatusBar />

        <div className="dashboard-grid">
          {/* ═══ LEFT PANEL ═══ */}
          <div className="left-panel">
            <ProfileCard profile={data?.profile} stats={data?.stats} />

            {/* SysInfo Widget */}
            <motion.div
              className="info-widget glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="widget-header">
                <span className="header-dot" />
                SYS_INFO
              </div>
              <div className="info-row">
                <span className="info-label"><TermIcon size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />Shell</span>
                <span className="info-value text-cyan">zsh</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Monitor size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />Theme</span>
                <span className="info-value text-accent">Cherry Dark</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Zap size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />Status</span>
                <span className="info-value text-green">● ACTIVE</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Server size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />Mode</span>
                <span className="info-value text-yellow">Solo Core</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Cpu size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />Engine</span>
                <span className="info-value text-violet">Next.js 16</span>
              </div>
              <div className="info-row">
                <span className="info-label"><Shield size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />Uptime</span>
                <span className="info-value text-green">99.9%</span>
              </div>
            </motion.div>


            {/* Contributions Graph */}
            <Contributions
              repos={data?.repos}
              contributions={data?.contributions}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Activity Log */}
            <ActivityLog
              repos={data?.repos}
              contributions={data?.contributions}
              selectedDate={selectedDate}
              events={events}
            />
          </div>

          {/* ═══ CENTER PANEL ═══ */}
          <div className="center-panel">
            <Console />
            <ServerMonitor />
          </div>

          {/* ═══ RIGHT PANEL ═══ */}
          <ProjectsList repos={data?.repos} loading={loading} />
        </div>

        <span className="micro-footer">
          © 2026 MOONWIRAJA — POWERED BY MEMORYOFPLANET
        </span>
      </div>
    </>
  );
}
