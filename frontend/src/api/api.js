import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL })

// Attach token if available
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('userInfo')
    if (raw) {
      const token = JSON.parse(raw).token
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (payload) => api.put('/auth/profile', payload)

export const getCourses = () => api.get('/courses')
export const initCourse = (payload) => api.post('/courses/init', payload)
export const updateTopicStatus = (courseId, moduleId, topicId, payload) =>
  api.patch(`/courses/${courseId}/modules/${moduleId}/topics/${topicId}/status`, payload)
export const addTopics = (courseId, topics) => api.post(`/courses/${courseId}/topics`, { topics })

export const getTasks = () => api.get('/tasks')
export const addTask = (payload) => api.post('/tasks/add', payload)
export const updateTask = (id, payload) => api.patch(`/tasks/${id}/edittask`, payload)
export const toggleTaskStatus = (id) => api.patch(`/tasks/${id}/toggletaskstatus`)
export const deleteTask = (id) => api.delete(`/tasks/${id}/deletetask`)

export const getProgressSummary = () => api.get('/progress/summary')

export default api
