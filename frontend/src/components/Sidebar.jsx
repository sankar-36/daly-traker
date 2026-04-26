import React, { useState } from 'react';
import { FiHome, FiCheckSquare, FiPieChart, FiSettings, FiMenu, FiX,FiBook } from 'react-icons/fi';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import Tasks from '../pages/Tasks';
import ProgressChart from './ProgressChart';
import { Router,Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';


const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const[bodyComponent, setBodyComponent] = useState(''); // State to manage body component

  return (
    <div className="flex h-screen bg-slate-50 font-sans">

      {/* ── 1. SIDEBAR ── */}
      <div className={`
        ${isOpen ? 'w-64' : 'w-20'}
        bg-slate-900 text-white flex flex-col
        transition-all duration-300 shrink-0
      `}>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 h-16">
          {isOpen && (
            <span className="text-xl font-bold text-teal-400 whitespace-nowrap">
              My Tracker
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-slate-800 text-teal-400 focus:outline-none"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-6 space-y-2 px-2">
          {[
            { icon: <FiHome size={22} />, label: 'Dashboard', id: 'dashboard' },
            { icon: <FiCheckSquare size={22} />, label: 'My Tasks', id: 'tasks' },
            {icon: <FiBook size={22} />, label: 'Courses', id: 'courses'},
            { icon: <FiPieChart size={22} />, label: 'Progress', id: 'progress' },

            
          ].map(({ icon, label, id }) => (
            <a
              key={id }
              href="#" 
    onClick={(e) => {
      e.preventDefault(); 
      setBodyComponent(id);
    }}
              className="relative flex items-center p-3 rounded-lg hover:bg-slate-800
                         hover:text-teal-400 transition-colors cursor-pointer group"
            >
              <span className="min-w-[22px]">{icon}</span>
              {isOpen && <span className="ml-4 font-medium">{label}</span>}
              {/* Tooltip shown only when sidebar is collapsed */}
              {!isOpen && (
                <span className="absolute left-16 ml-2 bg-slate-800 text-white text-sm
                                 px-2 py-1 rounded opacity-0 group-hover:opacity-100
                                 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {label}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Settings (bottom) */}
        <div className="p-4 border-t border-slate-700">
          <a
            href="#"
            className="relative flex items-center p-2 rounded-lg hover:bg-slate-800
                       hover:text-teal-400 transition-colors cursor-pointer group"
          >
            <span className="min-w-[22px]"><FiSettings size={22} /></span>
            {isOpen && <span className="ml-4 font-medium">Settings</span>}
            {!isOpen && (
              <span className="absolute left-16 ml-2 bg-slate-800 text-white text-sm
                               px-2 py-1 rounded opacity-0 group-hover:opacity-100
                               transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Settings
              </span>
            )}
          </a>
        </div>
      </div>

      {/* ── 2. MAIN CONTENT ── ✅ THIS IS WHAT WAS MISSING */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-6">
            {bodyComponent === 'dashboard' && 
            <Route
            path="/dashbord"
            element={
           
                <Dashboard/>
             
 }
          />}
            {bodyComponent === 'tasks' && <Tasks/>}
            {bodyComponent === 'progress' && <ProgressChart/>}
            {bodyComponent === 'courses' && <Courses/>}
        </main>

      </div>

    </div>
  );
};

export default SidebarLayout;
