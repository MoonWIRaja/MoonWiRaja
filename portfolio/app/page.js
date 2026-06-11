"use client";

import { useState, useEffect } from "react";
import StatusBar from "./components/StatusBar";
import SidebarLeft from "./components/SidebarLeft";
import Console from "./components/Console";
import ServerMonitor from "./components/ServerMonitor";
import ProfileCard from "./components/ProfileCard";
import ServerControl from "./components/ServerControl";
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
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Dashboard Viewport */}
      <div className="dashboard-viewport">
        <StatusBar />

        <div className="dashboard-grid">
          {/* Lajur 1: Sidebar Kiri (Hijau Hutan Gelap) */}
          <SidebarLeft activeUser={data?.profile?.name || "moonwiraja"} />

          {/* Lajur 2: Panel Tengah (Live Console + Server Statistics) */}
          <div className="center-panel">
            <Console />
            <ServerMonitor />
          </div>

          {/* Lajur 3: Panel Kanan (Profile + Control Panel + Active Processes) */}
          <div className="right-panel-wrapper">
            <ProfileCard profile={data?.profile} />
            <ServerControl />
            <ProjectsList repos={data?.repos} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}
