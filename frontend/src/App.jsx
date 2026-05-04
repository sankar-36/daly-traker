import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// Layout
import PageLayout from "./layout/Pagelayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import CourseDetail from "./pages/CourseDetail";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import NotFound from "./pages/404";
import Progress from "./pages/Progress";


export default function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── ✅ Fix: ProtectedRoute → AppLayout → Pages (3 layer) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PageLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />          {/* Layer 3: Pages */}
            <Route path="/courses/add" element={<AddCourse />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
          
        </Route>

        {/* ── Fallback ── */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
