import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiBell, FiChevronDown, FiLogOut, FiMenu,
  FiSearch, FiSettings, FiUser, FiX,
} from "react-icons/fi";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/courses": "Courses",
  "/courses/add": "Add Course",
  "/tasks": "Tasks",
  "/profile": "Profile",
  "/progress": "Progress",
};

export default function Navbar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const currentTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith("/courses/") ? "Course Detail" : "My Tracker");

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate("/login");
  };

  return (
    <>
      <header className="[grid-area:topnav] z-30 flex min-w-0 items-center gap-2 border-b border-slate-800 bg-slate-900 px-3 shadow-lg sm:gap-3 sm:px-4 lg:px-5">
        <button
          id="sidebar-toggle-btn"
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex shrink-0 cursor-pointer items-center rounded-lg border-none bg-transparent p-1.5 text-[#94a3b8] transition-colors duration-200 hover:bg-[#1e293b] hover:text-[#f1f5f9]"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <h1 className="m-0 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-[#f1f5f9] sm:text-lg">
          {currentTitle}
        </h1>

        <div className="ml-auto hidden w-[clamp(180px,24vw,280px)] items-center gap-2 rounded-[10px] border border-slate-700 bg-[#1e293b] px-3.5 py-1.5 transition-colors duration-200 focus-within:border-slate-400 md:flex">
          <FiSearch size={15} color="#64748b" className="shrink-0" />
          <input
            id="navbar-search"
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search courses, tasks..."
            className="w-full min-w-0 border-none bg-transparent text-[0.85rem] text-[#f1f5f9] outline-none placeholder:text-slate-500"
          />
        </div>

        <button
          id="notification-btn"
          type="button"
          aria-label="Notifications"
          className="relative shrink-0 cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-[#94a3b8] transition-colors duration-200 hover:text-[#f1f5f9]"
        >
          <FiBell size={20} />
          <span className="absolute right-[5px] top-[5px] h-2 w-2 rounded-full border-2 border-slate-900 bg-red-500" />
        </button>

        <div className="relative shrink-0">
          <button
            id="user-avatar-btn"
            type="button"
            onClick={() => setDropdown(d => !d)}
            className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-slate-700 bg-transparent px-2 py-[5px] text-[#f1f5f9] transition-colors duration-200 hover:border-teal-400 sm:px-[11px]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 text-xs font-semibold text-[#0f172a]">
              {initials}
            </span>
            <span className="hidden max-w-[90px] overflow-hidden text-ellipsis whitespace-nowrap text-[0.85rem] lg:block">
              {user?.username || user?.email || "User"}
            </span>
            <FiChevronDown
              size={14}
              color="#64748b"
              className={`hidden transition-transform duration-200 sm:block ${
                dropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {dropdown && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setDropdown(false)}
                className="fixed inset-0 z-[99] cursor-default border-none bg-transparent"
              />

              <div className="absolute right-0 top-[46px] z-[100] w-[190px] rounded-xl border border-slate-700 bg-slate-800 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-150 ease-out max-[420px]:fixed max-[420px]:left-3 max-[420px]:right-3 max-[420px]:top-[62px] max-[420px]:w-auto">
                <DropItem to="/profile" icon={<FiUser size={15} />} label="Profile" onClick={() => setDropdown(false)} />
                <DropItem to="/settings" icon={<FiSettings size={15} />} label="Settings" onClick={() => setDropdown(false)} />

                <div className="my-1 h-px bg-[#334155]" />

                <button
                  id="logout-btn"
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none bg-transparent px-3 py-[9px] text-left text-[0.85rem] text-red-500 transition-colors duration-150 hover:bg-[#0f172a]"
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}

function DropItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[0.85rem] text-slate-400 no-underline transition-colors duration-150 hover:bg-[#0f172a] hover:text-[#f1f5f9]"
    >
      {icon}
      {label}
    </Link>
  );
}
