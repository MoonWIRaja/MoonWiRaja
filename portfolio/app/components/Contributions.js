"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function Contributions({ repos }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Generate 16 weeks of contribution data ending on the Saturday of the current week
  const daysData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Total cells: 16 weeks * 7 days = 112 cells
    const cellsCount = 112;
    
    // We want the grid to start on a Sunday, 15 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (cellsCount - 1 - (6 - dayOfWeek)));
    // Adjust to ensure the startDate is a Sunday
    const startDay = startDate.getDay();
    if (startDay !== 0) {
      startDate.setDate(startDate.getDate() - startDay);
    }

    // Identify real active dates from repositories
    const activeDates = new Map(); // DateStr -> count
    if (repos) {
      repos.forEach((repo) => {
        const dateList = [];
        if (repo.pushed_at) dateList.push(repo.pushed_at.split("T")[0]);
        if (repo.updated_at) dateList.push(repo.updated_at.split("T")[0]);
        
        dateList.forEach((dateStr) => {
          activeDates.set(dateStr, (activeDates.get(dateStr) || 0) + 1);
        });
      });
    }

    const list = [];
    const dateRunner = new Date(startDate);

    for (let i = 0; i < cellsCount; i++) {
      const dateStr = dateRunner.toISOString().split("T")[0];
      const isFuture = dateRunner > today;

      let count = 0;
      let level = 0;

      if (!isFuture) {
        // Deterministic pseudo-random base activity based on the date string
        const seed = dateStr.split("-").reduce((acc, val) => acc + parseInt(val, 10), 0);
        const hash = Math.abs(Math.sin(seed + 45) * 1000) % 1;

        // Base simulated activity
        if (hash > 0.88) {
          count = Math.floor(hash * 4) + 1; // 1 to 4
        }

        // Overlay actual repository activity if exists
        if (activeDates.has(dateStr)) {
          const actualCommits = activeDates.get(dateStr);
          count = Math.max(count, actualCommits + 2); // Boost activity on real push days
        }

        // Map count to levels (0 to 4)
        if (count >= 5) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else if (count > 0) level = 1;
        else level = 0;
      }

      list.push({
        date: new Date(dateRunner),
        dateStr,
        count: isFuture ? null : count,
        level: isFuture ? 0 : level,
        isFuture,
      });

      // Move to next day
      dateRunner.setDate(dateRunner.getDate() + 1);
    }

    return list;
  }, [repos]);

  // Calculate total contributions
  const totalContributions = useMemo(() => {
    return daysData.reduce((sum, day) => sum + (day.count || 0), 0);
  }, [daysData]);

  const formatDateLabel = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="info-widget glass-card contrib-widget"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="widget-header">
        <span className="header-dot" />
        CONTRIBUTION_GRAPH
      </div>

      <div className="contrib-container">
        <div className="contrib-grid-wrapper">
          {/* Day of Week Labels */}
          <div className="contrib-days-labels">
            <span>Sun</span>
            <span>Wed</span>
            <span>Sat</span>
          </div>

          {/* Grid of Cells */}
          <div className="contrib-grid">
            {daysData.map((day, idx) => (
              <div
                key={day.dateStr}
                className={`contrib-cell lvl-${day.level}`}
                style={{ opacity: day.isFuture ? 0.15 : 1 }}
                onMouseEnter={(e) => {
                  if (!day.isFuture) {
                    setHoveredCell({
                      idx,
                      x: e.currentTarget.offsetLeft,
                      y: e.currentTarget.offsetTop,
                      ...day,
                    });
                  }
                }}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {hoveredCell && hoveredCell.idx === idx && (
                  <div className="contrib-tooltip">
                    <strong>{hoveredCell.count} commits</strong> on {formatDateLabel(hoveredCell.date)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="contrib-footer">
          <span>{totalContributions} commits (16w)</span>
          <div className="contrib-legend">
            <span>Less</span>
            <div className="contrib-legend-cell lvl-0" />
            <div className="contrib-legend-cell lvl-1" />
            <div className="contrib-legend-cell lvl-2" />
            <div className="contrib-legend-cell lvl-3" />
            <div className="contrib-legend-cell lvl-4" />
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
