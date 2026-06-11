"use client";

import { motion } from "framer-motion";

export default function ProfileCard({ profile }) {
  return (
    <motion.div
      className="profile-card glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="avatar-wrap">
        <motion.div
          className="avatar-ring"
          style={{
            background: "conic-gradient(var(--accent-green), var(--accent-cyan), var(--accent-cherry), var(--accent-green))"
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <img
          src={profile?.avatar_url || "https://github.com/MoonWIRaja.png"}
          alt={profile?.name || "MoonWiRaja"}
          className="avatar-img"
          width={64}
          height={64}
        />
      </div>

      <h1 className="profile-name">{profile?.name || "moonwiraja"}</h1>
      <span 
        className="mono" 
        style={{ 
          fontSize: "0.58rem", 
          color: "var(--accent-green)",
          fontWeight: 700,
          letterSpacing: "0.03em"
        }}
      >
        {profile?.login ? `${profile.login.toLowerCase()}@wiraja.dev` : "moonwiraja@wiraja.dev"}
      </span>
    </motion.div>
  );
}
