"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Wifi } from "lucide-react";

// Local Github icon SVG since Lucide v1 removed brand icons
const GithubIcon = ({ size = 9, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function StatusBar() {
  const [time, setTime] = useState("--:--:--");
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    const tick = () => {
      const f = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      });
      setTime(f.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    fetch("/api/github").then(r => setApiOk(r.ok)).catch(() => setApiOk(false));
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      className="status-bar"
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="status-left">
        <span className="ping-dot" />
        <span style={{ color: "var(--text-secondary)" }}>CONSOLE ACTIVE</span>
        <span className="status-separator" />
        <Activity size={10} style={{ color: "var(--accent-green)" }} />
        <span>MOONWIRAJA.DEV</span>
      </div>
      <div className="status-right">
        <div className="status-badge">
          <Clock size={9} />
          <span>{time} MYT</span>
        </div>
        <span className="status-separator" />
        <div className="status-badge">
          <GithubIcon size={9} />
          <span className={apiOk === true ? "text-green" : apiOk === false ? "text-yellow" : ""}>
            {apiOk === null ? "..." : apiOk ? "ONLINE" : "CACHED"}
          </span>
        </div>
        <span className="status-separator" />
        <div className="status-badge">
          <Wifi size={9} />
          <span className="text-green">CONNECTED</span>
        </div>
      </div>
    </motion.header>
  );
}
