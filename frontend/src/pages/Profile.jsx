import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getProfile } from '../api/api'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [preferences, setPreferences] = useState(user?.preferences || { theme: 'light', notifications: true })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile()
        setUsername(res.data.username)
        setEmail(res.data.email)
        setPreferences(res.data.preferences || preferences)
      } catch (e) {}
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile({ username, email, preferences })
      setMessage('Profile updated')
    } catch (e) {
      setMessage('Update failed')
    }
  }

  return (
    <div>
      <h2>Profile</h2>
      <form className="form" onSubmit={submit}>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Theme</label>
        <select value={preferences.theme} onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <label>
          <input type="checkbox" checked={preferences.notifications} onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })} />
          Enable notifications
        </label>

        <button className="btn" type="submit">Save</button>
        {message && <div className="muted">{message}</div>}
      </form>
    </div>
  )
}

export default Profile
