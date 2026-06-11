"use client";

import { useState, useEffect } from "react";
import StatusBar from "./components/StatusBar";
import ProfileCard from "./components/ProfileCard";
import Console from "./components/Console";
import StatsStrip from "./components/StatsStrip";
import ProjectsList from "./components/ProjectsList";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Background effects */}
      <div className="gradient-mesh" />
      <div className="noise-overlay" />

      {/* Full-screen dashboard */}
      <div className="dashboard-viewport">
        <StatusBar />

        <div className="dashboard-grid">
          {/* Left Panel: Profile + Info + Quick Commands */}
          <div className="left-panel">
            <ProfileCard profile={data?.profile} />

            <div className="info-widget glass-card">
              <div className="widget-header">
                <span className="dot" />
                SYS_INFO
              </div>
              <div className="info-row">
                <span className="info-label">Shell</span>
                <span className="info-value text-cyan">zsh</span>
              </div>
              <div className="info-row">
                <span className="info-label">Theme</span>
                <span className="info-value text-accent">Cherry Dark</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="info-value text-green">● ACTIVE</span>
              </div>
              <div className="info-row">
                <span className="info-label">Mode</span>
                <span className="info-value text-yellow">Solo Core</span>
              </div>
              <div className="info-row">
                <span className="info-label">Engine</span>
                <span className="info-value text-violet">Next.js 15</span>
              </div>
            </div>

            <div className="glass-card">
              <div className="widget-header" style={{ padding: "12px 16px 0" }}>
                <span className="dot" />
                QUICK_CMDS
              </div>
              <div className="cmd-grid">
                <button className="cmd-chip" onClick={() => window.__consoleExec?.("about")}>
                  about
                </button>
                <button className="cmd-chip" onClick={() => window.__consoleExec?.("repos")}>
                  repos
                </button>
                <button className="cmd-chip" onClick={() => window.__consoleExec?.("skills")}>
                  skills
                </button>
                <button className="cmd-chip" onClick={() => window.__consoleExec?.("contact")}>
                  contact
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel: Console + Stats */}
          <div className="center-panel">
            <Console />
            <StatsStrip stats={data?.stats} />
          </div>

          {/* Right Panel: Projects */}
          <ProjectsList repos={data?.repos} loading={loading} />
        </div>

        <span className="micro-footer">
          © 2026 MOONWIRAJA — POWERED BY MEMORYOFPLANET
        </span>
      </div>
    </>
  );
}
