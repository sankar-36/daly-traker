import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiBook, FiCheckSquare, FiUser,
  FiPieChart,
} from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/courses", icon: FiBook, label: "Courses" },
  { to: "/tasks", icon: FiCheckSquare, label: "Tasks" },
  { to: "/profile", icon: FiUser, label: "Profile" },
  { to: "/progress", icon: FiPieChart, label: "Progress" },
];

export default function Sidebar({ isOpen, onNavigate }) {
  const location = useLocation();

  return (
    <aside
      className={`[grid-area:sidebar] fixed inset-y-0 left-0 z-[90] flex w-[min(82vw,280px)] -translate-x-full flex-col gap-1 overflow-y-auto overflow-x-hidden border-r border-slate-800 bg-slate-900 px-2.5 py-4 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0 md:w-[220px]" : "md:w-[72px]"
      }`}
    >
      <div className="mb-2 flex items-center gap-2.5 overflow-hidden whitespace-nowrap border-b border-slate-800 px-2 pb-5 pt-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 text-[0.85rem] font-extrabold text-slate-900">
          T
        </span>
        {isOpen && (
          <span className="text-[0.95rem] font-bold tracking-[0.01em] text-[#f1f5f9]">
            My Tracker
          </span>
        )}
      </div>

      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive =
          location.pathname === to ||
          (to !== "/dashboard" && location.pathname.startsWith(to));

        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            title={!isOpen ? label : undefined}
            className={`flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-[10px] px-3 py-2.5 text-sm no-underline transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-cyan-900 to-cyan-700 font-semibold text-teal-400 shadow-[0_0_0_1px_#0891b240]"
                : "bg-transparent font-normal text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <Icon size={20} className="shrink-0" />
            {isOpen && <span>{label}</span>}
          </Link>
        );
      })}

      {isOpen && (
        <div className="mt-auto border-t border-slate-800 pt-4 text-center text-[0.75rem] text-[#334155]">
          v1.0.0
        </div>
      )}
    </aside>
  );
}
