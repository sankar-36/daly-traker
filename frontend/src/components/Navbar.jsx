import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiMenu, FiX, FiBell, FiUser, FiLogOut,
  FiSettings, FiSearch, FiChevronDown,
} from "react-icons/fi";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/courses":   "Courses",
  "/tasks":     "Tasks",
  "/profile":   "Profile",
};

export default function Navbar({ isOpen, onToggle }) {
  const navigate           = useNavigate();
  const location           = useLocation();
  const { user, logout }   = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const currentTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith("/courses/") ? "Course Detail" : "My Tracker");

  // Initials from username or email
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    logout();                     // clears user + token (AuthContext)
    setDropdown(false);
    navigate("/login");
  };

  return (
    <>
      <header
        style={{
          gridArea:     "topnav",
          display:      "flex",
          alignItems:   "center",
          gap:          "14px",
          padding:      "0 20px",
          background:   "#0f172a",
          borderBottom: "1px solid #1e293b",
          zIndex:       100,
          boxShadow:    "0 1px 8px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Sidebar Toggle ── */}
        <button
          id="sidebar-toggle-btn"
          onClick={onToggle}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            background:   "none",
            border:       "none",
            color:        "#2dd4bf",
            cursor:       "pointer",
            padding:      "6px",
            borderRadius: "8px",
            display:      "flex",
            alignItems:   "center",
            transition:   "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* ── Page Title ── */}
        <h1
          style={{
            margin:     0,
            color:      "#f1f5f9",
            fontSize:   "1rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {currentTitle}
        </h1>

        {/* ── Search Bar ── */}
        <div
          style={{
            marginLeft:   "auto",
            display:      "flex",
            alignItems:   "center",
            gap:          "8px",
            background:   "#1e293b",
            border:       "1px solid #334155",
            borderRadius: "10px",
            padding:      "6px 14px",
            width:        "260px",
            transition:   "border-color 0.2s",
          }}
        >
          <FiSearch size={15} color="#64748b" />
          <input
            id="navbar-search"
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search courses, tasks…"
            style={{
              background: "none",
              border:     "none",
              outline:    "none",
              color:      "#f1f5f9",
              fontSize:   "0.85rem",
              width:      "100%",
            }}
          />
        </div>

        {/* ── Notification Bell ── */}
        <button
          id="notification-btn"
          style={{
            background:   "none",
            border:       "none",
            color:        "#94a3b8",
            cursor:       "pointer",
            padding:      "6px",
            borderRadius: "8px",
            display:      "flex",
            alignItems:   "center",
            position:     "relative",
            transition:   "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
        >
          <FiBell size={20} />
          {/* Red badge */}
          <span
            style={{
              position:     "absolute",
              top:          "5px",
              right:        "5px",
              width:        "8px",
              height:       "8px",
              background:   "#ef4444",
              borderRadius: "50%",
              border:       "2px solid #0f172a",
            }}
          />
        </button>

        {/* ── User Avatar + Dropdown ── */}
        <div style={{ position: "relative" }}>
          <button
            id="user-avatar-btn"
            onClick={() => setDropdown(d => !d)}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "8px",
              background:     "none",
              border:         "1px solid #334155",
              borderRadius:   "10px",
              padding:        "5px 10px",
              cursor:         "pointer",
              color:          "#f1f5f9",
              transition:     "border-color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#2dd4bf")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#334155")}
          >
            {/* Avatar circle */}
            <span
              style={{
                width:          "28px",
                height:         "28px",
                borderRadius:   "50%",
                background:     "linear-gradient(135deg,#2dd4bf,#0891b2)",
                color:          "#0f172a",
                fontWeight:     700,
                fontSize:       "0.75rem",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              {initials}
            </span>
            <span style={{ fontSize: "0.85rem", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.username || user?.email || "User"}
            </span>
            <FiChevronDown
              size={14}
              color="#64748b"
              style={{ transform: dropdown ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
            />
          </button>

          {/* Dropdown Panel */}
          {dropdown && (
            <>
              {/* Click-outside overlay */}
              <div
                onClick={() => setDropdown(false)}
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
              />

              <div
                style={{
                  position:     "absolute",
                  right:        0,
                  top:          "46px",
                  width:        "190px",
                  background:   "#1e293b",
                  borderRadius: "12px",
                  border:       "1px solid #334155",
                  padding:      "6px",
                  zIndex:       100,
                  boxShadow:    "0 12px 32px rgba(0,0,0,0.5)",
                  animation:    "fadeDown 0.15s ease",
                }}
              >
                {/* Profile */}
                <DropItem to="/profile" icon={<FiUser size={15} />} label="Profile" onClick={() => setDropdown(false)} />
                {/* Settings */}
                <DropItem to="/settings" icon={<FiSettings size={15} />} label="Settings" onClick={() => setDropdown(false)} />

                {/* Divider */}
                <div style={{ height: "1px", background: "#334155", margin: "4px 0" }} />

                {/* Logout */}
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "10px",
                    padding:    "9px 12px",
                    borderRadius:"8px",
                    color:      "#ef4444",
                    background: "none",
                    border:     "none",
                    width:      "100%",
                    fontSize:   "0.85rem",
                    cursor:     "pointer",
                    textAlign:  "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0f172a")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* CSS for dropdown animation */}
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ── Reusable dropdown link item ──
function DropItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            "10px",
        padding:        "9px 12px",
        borderRadius:   "8px",
        color:          "#94a3b8",
        textDecoration: "none",
        fontSize:       "0.85rem",
        transition:     "background 0.15s, color 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "#0f172a";
        e.currentTarget.style.color = "#f1f5f9";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#94a3b8";
      }}
    >
      {icon}
      {label}
    </Link>
  );
}