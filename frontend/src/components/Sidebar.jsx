import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiBook, FiCheckSquare, FiUser,
} from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/dashboard", icon: FiHome,        label: "Dashboard" },
  { to: "/courses",   icon: FiBook,        label: "Courses"   },
  { to: "/tasks",     icon: FiCheckSquare, label: "Tasks"     },
  { to: "/profile",   icon: FiUser,        label: "Profile"   },
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <aside
      style={{
        gridArea:    "sidebar",
        display:     "flex",
        flexDirection:"column",
        gap:         "4px",
        padding:     "16px 10px",
        background:  "#0f172a",
        borderRight: "1px solid #1e293b",
        overflowY:   "auto",
        overflowX:   "hidden",
        transition:  "width 0.3s ease",
      }}
    >
      {/* ── Logo / Brand at top ── */}
      <div
        style={{
          display:       "flex",
          alignItems:    "center",
          gap:           "10px",
          padding:       "10px 8px 20px",
          borderBottom:  "1px solid #1e293b",
          marginBottom:  "8px",
          overflow:      "hidden",
          whiteSpace:    "nowrap",
        }}
      >
        {/* Brand icon */}
        <span
          style={{
            width:          "32px",
            height:         "32px",
            borderRadius:   "8px",
            background:     "linear-gradient(135deg,#2dd4bf,#0891b2)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
            fontWeight:     800,
            fontSize:       "0.85rem",
            color:          "#0f172a",
          }}
        >
          T
        </span>
        {isOpen && (
          <span
            style={{
              color:      "#f1f5f9",
              fontWeight: 700,
              fontSize:   "0.95rem",
              letterSpacing: "0.01em",
            }}
          >
            My Tracker
          </span>
        )}
      </div>

      {/* ── Nav Links ── */}
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to ||
          (to !== "/dashboard" && location.pathname.startsWith(to));

        return (
          <Link
            key={to}
            to={to}
            title={!isOpen ? label : undefined}   // tooltip when collapsed
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "12px",
              padding:        "10px 12px",
              borderRadius:   "10px",
              textDecoration: "none",
              background:     isActive
                ? "linear-gradient(90deg,#164e63,#0e7490)"
                : "transparent",
              color:          isActive ? "#2dd4bf" : "#64748b",
              fontWeight:     isActive ? 600 : 400,
              fontSize:       "0.875rem",
              whiteSpace:     "nowrap",
              overflow:       "hidden",
              transition:     "background 0.2s, color 0.2s",
              boxShadow:      isActive ? "0 0 0 1px #0891b240" : "none",
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = "#1e293b";
              if (!isActive) e.currentTarget.style.color = "#f1f5f9";
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = "transparent";
              if (!isActive) e.currentTarget.style.color = "#64748b";
            }}
          >
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
        <div
          style={{
            marginTop:  "auto",
            paddingTop: "16px",
            borderTop:  "1px solid #1e293b",
            color:      "#334155",
            fontSize:   "0.75rem",
            textAlign:  "center",
          }}
        >
          v1.0.0
        </div>
      )}
    </aside>
  );
}