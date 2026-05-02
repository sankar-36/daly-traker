import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiBook, FiCheckSquare, FiUser,
  FiPieChart,
} from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/dashboard", icon: FiHome,        label: "Dashboard" },
  { to: "/courses",   icon: FiBook,        label: "Courses"   },
  { to: "/tasks",     icon: FiCheckSquare, label: "Tasks"     },
  { to: "/profile",   icon: FiUser,        label: "Profile"   },
  { to: "/progress",  icon: FiPieChart,    label: "Progress"  },
  
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <aside className="[grid-area:sidebar] flex flex-col gap-1 py-4 px-2.5 bg-slate-900 border-r border-slate-800 overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-in-out">
      {/* ── Logo / Brand at top ── */}
      <div className="flex items-center gap-2.5 pt-2.5 px-2 pb-5 border-b border-slate-800 mb-2 overflow-hidden whitespace-nowrap">
        {/* Brand icon */}
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shrink-0 font-extrabold text-[0.85rem] text-slate-900">
          T
        </span>
        {isOpen && (
          <span className="text-[#f1f5f9] font-bold text-[][0.95rem] tracking-[0.01em]">
            My Tracker
          </span>
        )}
      </div>
     
      {/* ── Nav Links ── */}
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
       const isActive = location.pathname === to ||(to !== "/dashboard" && location.pathname.startsWith(to));

        return (
          <Link
            key={to}
            to={to}
            title={!isOpen ? label : undefined}   // tooltip when collapsed
            className={`flex items-center gap-3 py-2.5 px-3 rounded-[10px] no-underline text-sm whitespace-nowrap overflow-hidden transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-900 to-cyan-700 text-teal-400 font-semibold shadow-[0_0_0_1px_#0891b240]"
                  : "bg-transparent text-slate-500 font-normal hover:bg-slate-800/50 hover:text-slate-300"
              }`}>
            <Icon
              size={20}
              style={{ flexShrink: 0 }}
            />
            {isOpen && <span>{label}</span>}
          </Link>
        );
      })}

      {/* ── Bottom spacer / version ── */}
      {isOpen && (
        <div className="mt-auto pt-[16px] border-t border-slate-800 text-[#334155],text-[0.75rem],text-center">
          v1.0.0
        </div>
      )}
    </aside>
  );
}