import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function PageLayout() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncSidebar = event => {
      setIsOpen(!event.matches);
    };

    syncSidebar(mediaQuery);
    mediaQuery.addEventListener("change", syncSidebar);

    return () => mediaQuery.removeEventListener("change", syncSidebar);
  }, []);

  const closeMobileSidebar = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`page-shell ${isOpen ? "sidebar-open" : "sidebar-collapsed"}`}
    >
      {/* Top Navbar */}
      <Navbar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Side Navbar */}
      <Sidebar isOpen={isOpen} onNavigate={closeMobileSidebar} />

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="mobile-sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Page Content */}
     <main className="[grid-area:main] overflow-y-auto bg-slate-100">
        <Outlet />
      </main>

      <style>{`
        .page-shell {
          --sidebar-width: 220px;
          display: grid;
          grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
          grid-template-rows: 60px minmax(0, 1fr);
          grid-template-areas:
            "sidebar topnav"
            "sidebar main";
          height: 100vh;
          overflow: hidden;
          background: #0f172a;
          transition: grid-template-columns 0.3s ease;
        }

        .page-shell.sidebar-collapsed {
          --sidebar-width: 72px;
        }

        .mobile-sidebar-backdrop {
          display: none;
        }

        @media (max-width: 767px) {
          .page-shell,
          .page-shell.sidebar-collapsed,
          .page-shell.sidebar-open {
            --sidebar-width: 0px;
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: 56px minmax(0, 1fr);
            grid-template-areas:
              "topnav"
              "main";
          }

          .mobile-sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 56px 0 0;
            z-index: 80;
            border: 0;
            background: rgba(15, 23, 42, 0.58);
            backdrop-filter: blur(2px);
          }
        }
      `}</style>
    </div>
  );
}
