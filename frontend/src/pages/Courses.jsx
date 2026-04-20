import React, { useEffect, useState } from 'react'
import { getCourses, initCourse, addTopics } from '../api/api'
import CourseCard from '../components/CourseCard'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topicsInput, setTopicsInput] = useState('')

  // per-course inline add-topic input, loading and error state
  const [topicInputs, setTopicInputs] = useState({})
  const [topicLoading, setTopicLoading] = useState({})
  const [topicError, setTopicError] = useState({})

  const load = async () => {
    try {
      const res = await getCourses()
      setCourses(res.data)
    } catch (e) {}
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => ({ title: t }))

    try {
      await initCourse({ title, description, topics })
      setTitle('')
      setDescription('')
      setTopicsInput('')
      load()
    } catch (e) {}
  }

  const handleTopicInputChange = (courseId, value) => {
    setTopicInputs((p) => ({ ...p, [courseId]: value }))
    setTopicError((p) => ({ ...p, [courseId]: null }))
  }

  const handleAddTopic = async (courseId) => {
    const input = (topicInputs[courseId] || '').trim()
    if (!input) return

    // support single entry or comma-separated multiple topics
    const topicsArr = input.includes(',')
      ? input.split(',').map((t) => t.trim()).filter(Boolean)
      : [input]

    setTopicLoading((p) => ({ ...p, [courseId]: true }))
    setTopicError((p) => ({ ...p, [courseId]: null }))

    try {
      await addTopics(courseId, topicsArr)
      setTopicInputs((p) => ({ ...p, [courseId]: '' }))
      load()
    } catch (e) {
      setTopicError((p) => ({ ...p, [courseId]: e.response?.data?.message || 'Failed to add topics' }))
    } finally {
      setTopicLoading((p) => ({ ...p, [courseId]: false }))
    }
  }

  return (
    <div>
      <h2>Courses</h2>

      <form className="form" onSubmit={submit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Topics (comma separated)</label>
        <input value={topicsInput} onChange={(e) => setTopicsInput(e.target.value)} />

        <button className="btn" type="submit">Create Course</button>
      </form>

      <div className="list">
        {courses.map((c) => (
          <div key={c._id}>
            <CourseCard course={c} />
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  placeholder="Add topic(s) — comma to add multiple"
                  value={topicInputs[c._id] || ''}
                  onChange={(e) => handleTopicInputChange(c._id, e.target.value)}
                />
                <button
                  className="btn small"
                  type="button"
                  onClick={() => handleAddTopic(c._id)}
                  disabled={topicLoading[c._id]}
                >
                  {topicLoading[c._id] ? 'Adding...' : 'Add'}
                </button>
              </div>
              {topicError[c._id] && <div className="error">{topicError[c._id]}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
