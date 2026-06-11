"use client";

import { useState } from "react";
import { 
  Terminal, 
  Folder, 
  Database, 
  Cloud, 
  LayoutGrid, 
  Calendar, 
  Globe, 
  MessageSquare, 
  Zap, 
  Settings, 
  Users, 
  Activity, 
  ArrowLeft 
} from "lucide-react";

export default function SidebarLeft({ activeUser }) {
  const [activeItem, setActiveItem] = useState("consoles");

  const menuSections = [
    {
      title: "Overview",
      items: [
        { id: "consoles", label: "Consoles", icon: Terminal, cmd: "neofetch" }
      ]
    },
    {
      title: "Management",
      items: [
        { id: "files", label: "Files", icon: Folder, cmd: "repos" },
        { id: "databases", label: "Databases", icon: Database, cmd: "skills" },
        { id: "backups", label: "Backups", icon: Cloud, cmd: "help" },
        { id: "split", label: "Split", icon: LayoutGrid, cmd: "about" }
      ]
    },
    {
      title: "Configuration",
      items: [
        { id: "schedules", label: "Schedules", icon: Calendar, cmd: "neofetch" },
        { id: "network", label: "Network", icon: Globe, cmd: "contact" },
        { id: "discord", label: "Discord", icon: MessageSquare, cmd: "contact" },
        { id: "startup", label: "Startup", icon: Zap, cmd: "neofetch" },
        { id: "settings", label: "Settings", icon: Settings, cmd: "help" }
      ]
    },
    {
      title: "Access & Logs",
      items: [
        { id: "users", label: "Users", icon: Users, cmd: "about" },
        { id: "activity", label: "Activity", icon: Activity, cmd: "repos" }
      ]
    }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (window.__consoleExec) {
      window.__consoleExec(item.cmd);
    }
  };

  return (
    <aside className="sidebar-left">
      <div className="sidebar-header">
        <Terminal size={16} className="text-accent" />
        <span>MOON CONSOLE</span>
      </div>

      <nav className="sidebar-nav">
        {menuSections.map((section, idx) => (
          <div key={idx} className="nav-section">
            <span className="nav-section-title">{section.title}</span>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon size={12} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button 
          type="button" 
          className="nav-item" 
          style={{ padding: 0, border: "none", background: "none" }}
          onClick={() => window.__consoleExec?.("help")}
        >
          <ArrowLeft size={12} style={{ marginRight: 6 }} />
          <span style={{ fontSize: "0.6rem" }}>DASHBOARD</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="ping-dot" style={{ width: 6, height: 6 }} />
          <span className="mono" style={{ fontSize: "0.6rem", color: "var(--text-light-secondary)", textTransform: "lowercase" }}>
            {activeUser || "moon"}
          </span>
        </div>
      </div>
    </aside>
  );
}
