"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TermIcon, Server, Cpu, Monitor, Zap, Shield } from "lucide-react";
import StatusBar from "./components/StatusBar";
import ProfileCard from "./components/ProfileCard";
import ServerMonitor from "./components/ServerMonitor";
import Console from "./components/Console";
import ProjectsList from "./components/ProjectsList";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(basePath + "/api/github")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
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

            {/* Quick Commands */}
            <motion.div
              className="cmd-section glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="widget-header" style={{ padding: "12px 14px 0" }}>
                <span className="header-dot" />
                QUICK_CMDS
              </div>
              <div className="cmd-grid">
                {["about", "repos", "skills", "contact", "neofetch"].map((cmd) => (
                  <button
                    key={cmd}
                    className="cmd-chip"
                    onClick={() => window.__consoleExec?.(cmd)}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </motion.div>
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
