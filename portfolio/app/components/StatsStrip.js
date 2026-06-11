"use client";

export default function StatsStrip({ stats }) {
  const items = [
    { icon: "⭐", value: stats?.stars ?? "–", label: "Stars", color: "text-yellow" },
    { icon: "⑂", value: stats?.forks ?? "–", label: "Forks", color: "text-cyan" },
    { icon: "📂", value: stats?.repos ?? "–", label: "Repos", color: "text-accent" },
    { icon: "👥", value: stats?.followers ?? "–", label: "Followers", color: "text-green" },
  ];

  return (
    <div className="stats-strip">
      {items.map((item) => (
        <div key={item.label} className="stat-tile glass-card">
          <div className={`stat-icon ${item.color}`}>{item.icon}</div>
          <div className="stat-number">{item.value}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
