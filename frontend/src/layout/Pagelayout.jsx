import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function PageLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isOpen ? "220px 1fr" : "72px 1fr",
        gridTemplateRows: "60px 1fr",
        gridTemplateAreas: `
          "sidebar topnav"
          "sidebar main"
        `,
        height: "100vh",
        overflow: "hidden",
        transition: "grid-template-columns 0.3s ease",
        background: "#0f172a",
      }}
    >
      {/* Top Navbar */}
      <Navbar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Side Navbar */}
      <Sidebar isOpen={isOpen} />

      {/* Page Content */}
      <main className="[grid-area:main] overflow-y-auto p-7 bg-slate-100"className="[grid-area:main] overflow-y-auto p-7 bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}