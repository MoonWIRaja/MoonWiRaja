"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ServerControl() {
  const [status, setStatus] = useState("RUNNING");

  const handleAction = (action) => {
    if (!window.__consoleExec) return;

    if (action === "start") {
      setStatus("RUNNING");
      window.__consoleExec("neofetch");
    } else if (action === "restart") {
      setStatus("REBOOTING");
      window.__consoleExec("clear");
      setTimeout(() => {
        window.__consoleExec("neofetch");
        setStatus("RUNNING");
      }, 1000);
    } else if (action === "stop") {
      setStatus("STOPPED");
      window.__consoleExec("clear");
      // Simulate stopping message
      setTimeout(() => {
        if (window.__consoleExec) {
          // Send a message directly or log it
          console.log("Server stopped");
        }
      }, 500);
    }
  };

  return (
    <motion.div
      className="glass-card server-control-widget"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="projects-header" style={{ padding: "0 0 6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="header-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-red)" }} />
          SERVER_CONTROL
        </span>
      </div>

      <div className="control-row">
        <span className="control-label">IP Address</span>
        <span className="control-value">127.0.0.1:3000</span>
      </div>
      <div className="control-row">
        <span className="control-label">Subdomain</span>
        <span className="control-value">moon.wiraja.dev</span>
      </div>
      <div className="control-row">
        <span className="control-label">Status</span>
        <span className="control-value" style={{ 
          color: status === "RUNNING" ? "var(--highlight-green)" : status === "REBOOTING" ? "var(--accent-amber)" : "var(--highlight-red)" 
        }}>
          ● {status}
        </span>
      </div>
      <div className="control-row">
        <span className="control-label">Mode</span>
        <span className="control-value text-accent">SOLO CORE</span>
      </div>
      <div className="control-row">
        <span className="control-label">Server ID</span>
        <span className="control-value mono" style={{ fontSize: "0.55rem" }}>0x3f5c9e2b</span>
      </div>

      <div className="control-actions">
        <button
          type="button"
          className="btn-control start"
          onClick={() => handleAction("start")}
        >
          Start Server
        </button>
        <button
          type="button"
          className="btn-control restart"
          onClick={() => handleAction("restart")}
        >
          Restart Server
        </button>
        <button
          type="button"
          className="btn-control stop"
          onClick={() => handleAction("stop")}
        >
          Stop Server
        </button>
      </div>
    </motion.div>
  );
}
