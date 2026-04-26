import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import { useLocation } from 'react-router-dom'
import SidebarLayout from './components/Sidebar'


const App = () => {
      const location = useLocation();
      const showNavbar = location.pathname !== "/login" && location.pathname !== "/register";
      const showSidebar = location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/" && location.pathname =="/home";
     
  return (
    <>
      {showNavbar && <Navbar />}
      {showSidebar && <SidebarLayout />}
      
      <main >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashbord"
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default App
