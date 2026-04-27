import React, { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../api/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('userInfo')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('userInfo', JSON.stringify(user))
    else localStorage.removeItem('userInfo')
  }, [user])

  const login = async (email, password) => {
    const res = await api.login({ email, password })
    setUser(res.data)
    // ProtectedRoute checks localStorage.getItem("token") — write it here
    if (res.data?.token) localStorage.setItem('token', res.data.token)
    return res
  }

  const register = async (username, email, password) => {
    const res = await api.register({ username, email, password })
    setUser(res.data)
    // ProtectedRoute checks localStorage.getItem("token") — write it here
    if (res.data?.token) localStorage.setItem('token', res.data.token)
    return res
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  const updateProfile = async (payload) => {
    const res = await api.updateProfile(payload)
    setUser(res.data)
    return res
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
