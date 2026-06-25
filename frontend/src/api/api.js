import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL })

const clearStoredAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

const getStoredToken = () => {
  const token = localStorage.getItem('token')
  if (token) return token

  const raw = localStorage.getItem('userInfo')
  if (!raw) return null

  try {
    return JSON.parse(raw).token || null
  } catch (e) {
    clearStoredAuth()
    return null
  }
}

// Attach token if available
api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || ''

    if (
      error?.response?.status === 401 &&
      message.toLowerCase().includes('token expired')
    ) {
      clearStoredAuth()

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  }
)

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (payload) => api.put('/auth/profile', payload)

export const getCourses = () => api.get('/courses')
export const initCourse = (payload) => api.post('/courses/init', payload)
export const editCourse = (courseId, payload) => api.patch(`/courses/${courseId}/editcourse`, payload)
export const updateTopicStatus = (courseId, moduleId, topicId, payload) =>
  api.patch(`/courses/${courseId}/modules/${moduleId}/topics/${topicId}/status`, payload)
export const addTopics = (courseId, topics) => api.post(`/courses/${courseId}/topics`, { topics })

export const getTasks = () => api.get('/tasks')
export const addTask = (payload) => api.post('/tasks/add', payload)
export const updateTask = (id, payload) => api.patch(`/tasks/${id}/edittask`, payload)
export const toggleTaskStatus = (id) => api.patch(`/tasks/${id}/toggletaskstatus`)
export const deleteTask = (id) => api.delete(`/tasks/${id}/deletetask`)

export const getProgressSummary = () => api.get('/progress/summary')
export const getProgressOverview = () => api.get('/progress/overview')
export const getProfileStreak = () => api.get('/progress/streak')
export const getTodayStreak = () => api.get('/streak/today')
export const getDashboard = () => api.get('/dashboard')

// AI-powered course generation
export const generateCourseAI = (title) => api.post('/ai/generate-course', { title }).then(res => res.data.course)

export default api
