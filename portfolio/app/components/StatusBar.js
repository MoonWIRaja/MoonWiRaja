"use client";

import { useState, useEffect } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("--:--:--");
  const [apiStatus, setApiStatus] = useState("CHECKING");

  useEffect(() => {
    const updateClock = () => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(formatter.format(new Date()));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Check API status
    fetch("/api/github")
      .then((r) => {
        setApiStatus(r.ok ? "ONLINE" : "FALLBACK");
      })
      .catch(() => setApiStatus("OFFLINE"));

    return () => clearInterval(interval);
  }, []);

  const statusColor =
    apiStatus === "ONLINE"
      ? "text-green"
      : apiStatus === "FALLBACK"
      ? "text-yellow"
      : "text-accent";

  return (
    <header className="status-bar">
      <div className="status-left">
        <span className="ping-dot" />
        <span>CONSOLE ACTIVE // MOONWIRAJA.DEV</span>
      </div>
      <div className="status-right">
        <span>⏱ {time} MYT</span>
        <span>
          ⟐ API: <span className={statusColor}>{apiStatus}</span>
        </span>
      </div>
    </header>
  );
}
