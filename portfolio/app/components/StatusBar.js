"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Terminal, Shield } from "lucide-react";

export default function StatusBar() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const f = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit", minute: "2-digit", hour12: false,
      });
      setTime(f.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
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
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-light)" }}>
          <Terminal size={14} className="text-accent" style={{ color: "var(--text-light)" }} />
          <span style={{ fontWeight: 800 }}>MOON CONSOLE</span>
        </a>
        <button 
          type="button" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            background: "rgba(255, 255, 255, 0.12)", 
            borderRadius: "4px",
            width: "20px", 
            height: "20px",
            marginLeft: "4px"
          }}
          onClick={() => window.__consoleExec?.("help")}
          aria-label="Back to Help"
        >
          <ChevronLeft size={12} style={{ color: "var(--text-light)" }} />
        </button>
      </div>

      <div className="status-center" style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-light)" }}>
        NEO CORE OF PLANET
      </div>

      <div className="status-right">
        <div className="status-badge" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }}>
          <Shield size={9} style={{ color: "var(--accent-green)" }} />
          <span className="mono" style={{ color: "var(--text-light-secondary)", fontSize: "0.58rem" }}>{time} MYT</span>
        </div>
        <span className="status-separator" />
        <span className="mono" style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-light-secondary)" }}>
          V3.0.0 NETA
        </span>
      </div>
    </motion.header>
  );
}
