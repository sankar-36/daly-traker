import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LandingPage from '../pages/LandingPage'
import Dashboard from '../pages/Dashboard'
import { useState } from 'react'
import SidebarLayout from './Sidebar'


const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const[showLanding, setShowLanding] = useState(false)
  const handleLogout = () => {
    logout()
    navigate('/')
  }
   const handleLoginClick = () => {
    setShowLanding(true)
    navigate('/login')
  }
  const handleRegisterClick = () => {
    setShowLanding(true)
    navigate('/register')
  }

  return (
    <div>
    <nav className="nav">
      <div className="nav-left">
        <Link  className="brand">Task Analysis</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <a href="">Courses</a>
            <a href=""><Link to="/tasks">Tasks</Link></a>
            <a href=""><Link to="/profile">Profile</Link></a>
            <button onClick={handleLogout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} className="btn">Login</button>
            <button onClick={handleRegisterClick} className="btn">Register</button>
          </>
        )}
      </div>
      
    </nav>
    <body>
    
    </body>
  </div>
  )
}

export default Navbar
