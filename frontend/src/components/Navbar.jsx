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
      <header className="[grid-area:topnav] flex items-center gap-3.5 px-5 bg-[#0f172a] border-b border-[#1e293b] z-[100] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        {/* ── Sidebar Toggle ── */}
        <button
          id="sidebar-toggle-btn"
          onClick={onToggle}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex bg-transparent text-[#94a3b8] border -none cursor-pointer p-1.5 rounded-lg items-center transition-colors duration-200"
          onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* ── Page Title ── */}
        <h1 className="m-0 text-[#f1f5f9] test-base font-semibold  whitespace-nowrap overflow-hidden text-ellipsis" >
          {currentTitle}
        </h1>

        {/* ── Search Bar ── */}
        <div className="ml-auto flex items-center gap-2 bg-[#1e293b] border border-slate-700 focus-within:border-slate-400 rounded-[10px] px-3.5 py-1.5 w-[260px] transition-colors duration-200" >
          <FiSearch size={15} color="#64748b" />
          <input
            id="navbar-search"
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search courses, tasks…"
            className="bg-transparent border-none outline-none text-[#f1f5f9]  text-[0.85rem] w-full"/>
        </div>

        {/* ── Notification Bell ── */}
        <button id="notification-btn" className="bg-none border-none text-[#94a3b8] cursor-pointer p-1.5 rounded-lg relative transition-colors duration-200"
          onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
          onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")} >
          <FiBell size={20} />
          {/* Red badge */}
          <span className="absolute top-[5px] right-[5px] w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
        </button>

        {/* ── User Avatar + Dropdown ── */}
        <div style={{ position: "relative" }}>
          <button
            id="user-avatar-btn"
            onClick={() => setDropdown(d => !d)}
            className="flex items-center gap-2 bg-transparent border border-slate-700 rounded-[10px] cursor-pointer py-[5px] px-[11px] text-[#f1f5f9] transition-colors duration-200"
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#2dd4bf")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#334155")}
          >
            {/* Avatar circle */}
            <span  className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 text-[#0f172a] font-xs flex items-center justify-center" >
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

              <div className="absolute right-0 top-[46px] w-[190px] bg-slate-800 rounded-xl border border-slate-700 p-1.5 z-[100] shadow-[0_12px_32px_rgba(0,0,0,0.5)] animate-[fadeDown_0.15s_ease]"  >
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
                  className="flex items-center gap-2.5 py-[9px] px-3 rounded-lg text-red-500 bg-transparent border-none w-full text-[0.85rem] cursor-pointer text-left transition-colors duration-150 hover:bg-slate-700/50"
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
      className="flex items-center gap-2.5 py-[9px] px-3 rounded-lg text-slate-400 no-underline text-[0.85rem] transition-colors duration-150 hover:bg-slate-800 hover:text-slate-200"
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