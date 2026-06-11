"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Activity, Thermometer } from "lucide-react";

export default function ServerMonitor() {
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(4.12); // GB
  const [network, setNetwork] = useState({ rx: 45.2, tx: 12.8 });
  const [temp, setTemp] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time server activity fluctuations
      setCpu((prev) => {
        const delta = Math.floor(Math.random() * 15) - 7;
        const next = prev + delta;
        return Math.max(10, Math.min(95, next));
      });

      setNetwork(() => ({
        rx: parseFloat((Math.random() * 80 + 10).toFixed(1)),
        tx: parseFloat((Math.random() * 30 + 5).toFixed(1)),
      }));

      setTemp((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1.5;
        const next = Math.round(prev + delta);
        return Math.max(42, Math.min(68, next));
      });

      setRam((prev) => {
        const delta = (Math.random() * 0.08) - 0.04;
        const next = prev + delta;
        return parseFloat(Math.max(3.9, Math.min(4.8, next)).toFixed(2));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const ramPercentage = ((ram / 8.0) * 100).toFixed(1);

  return (
    <motion.div
      className="info-widget glass-card server-monitor-widget"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="widget-header">
        <span className="header-dot" />
        SRV_MONITOR
      </div>

      {/* CPU Section */}
      <div className="monitor-section">
        <div className="monitor-header">
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Cpu size={11} className="text-accent" />
            CPU LOAD
          </span>
          <span className="mono" style={{ color: cpu > 80 ? "var(--accent-red)" : cpu > 60 ? "var(--accent-amber)" : "var(--accent-green)" }}>
            {cpu}%
          </span>
        </div>
        <div className="monitor-bar-bg">
          <motion.div
            className="monitor-bar-fill"
            style={{
              width: `${cpu}%`,
              backgroundColor: cpu > 80 ? "var(--accent-red)" : cpu > 60 ? "var(--accent-amber)" : "var(--accent-green)",
            }}
            animate={{ width: `${cpu}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
          />
        </div>
      </div>

      {/* RAM Section */}
      <div className="monitor-section">
        <div className="monitor-header">
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <HardDrive size={11} className="text-cyan" />
            RAM USAGE
          </span>
          <span className="mono text-cyan">
            {ram} / 8.0 GB ({ramPercentage}%)
          </span>
        </div>
        <div className="monitor-bar-bg">
          <motion.div
            className="monitor-bar-fill"
            style={{
              width: `${ramPercentage}%`,
              backgroundColor: "var(--accent-cyan)",
            }}
            animate={{ width: `${ramPercentage}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
          />
        </div>
      </div>

      {/* Network & Temp Grid */}
      <div className="monitor-grid">
        <div className="mini-monitor-card">
          <span className="mini-monitor-label" style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Activity size={9} className="text-yellow" />
            NETWORK
          </span>
          <span className="mini-monitor-val text-yellow" style={{ fontSize: "0.6rem" }}>
            ↓{network.rx} KB/s
          </span>
          <span className="mini-monitor-val text-yellow" style={{ fontSize: "0.6rem", opacity: 0.7 }}>
            ↑{network.tx} KB/s
          </span>
        </div>

        <div className="mini-monitor-card">
          <span className="mini-monitor-label" style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Thermometer size={9} style={{ color: temp > 60 ? "var(--accent-rose)" : "var(--accent-green)" }} />
            CORE TEMP
          </span>
          <span className="mini-monitor-val" style={{ color: temp > 60 ? "var(--accent-rose)" : "var(--text-primary)" }}>
            {temp}°C
          </span>
          <span className="mini-monitor-val text-muted" style={{ fontSize: "0.5rem", textTransform: "uppercase" }}>
            {temp > 60 ? "WARNING" : temp > 50 ? "WARM" : "STABLE"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
