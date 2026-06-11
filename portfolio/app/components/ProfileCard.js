"use client";

export default function ProfileCard({ profile }) {
  return (
    <div className="profile-card glass-card">
      <div className="avatar-wrap">
        <div className="avatar-ring" />
        <img
          src={profile?.avatar_url || "https://github.com/MoonWIRaja.png"}
          alt={profile?.name || "MoonWiRaja"}
          className="avatar-img"
          width={80}
          height={80}
        />
      </div>
      <h1 className="profile-name">{profile?.name || "MoonWiRaja"}</h1>
      <span className="profile-role">FULL-STACK CREATOR</span>
      <p className="profile-location">
        📍 {profile?.location || "Malaysia"}
      </p>
    </div>
  );
}
