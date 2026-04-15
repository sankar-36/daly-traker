import React, { useEffect, useState } from 'react'
import { getCourses, initCourse, addTopics } from '../api/api'
import CourseCard from '../components/CourseCard'
import Modal from '../components/Modal'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topicsInput, setTopicsInput] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCourse, setModalCourse] = useState(null)
  const [modalTopicsInput, setModalTopicsInput] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState(null)

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

  const openModal = (course) => {
    setModalCourse(course)
    setModalTopicsInput('')
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleModalAddTopics = async () => {
    if (!modalCourse) return
    const input = (modalTopicsInput || '').trim()
    if (!input) return
    const topicsArr = input.split(',').map((t) => t.trim()).filter(Boolean)
    if (topicsArr.length === 0) return
    setModalLoading(true)
    setModalError(null)
    try {
      await addTopics(modalCourse._id, topicsArr)
      setIsModalOpen(false)
      setModalCourse(null)
      load()
    } catch (e) {
      setModalError(e.response?.data?.message || 'Failed to add topics')
    } finally {
      setModalLoading(false)
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
            <div style={{ marginTop: 8 }}>
              <button className="btn small" type="button" onClick={() => openModal(c)}>Add topics</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} title={`Add topics to ${modalCourse?.title || ''}`} onClose={() => setIsModalOpen(false)}>
        <label>Topics (comma separated)</label>
        <input value={modalTopicsInput} onChange={(e) => setModalTopicsInput(e.target.value)} />
        {modalError && <div className="error">{modalError}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn" type="button" onClick={handleModalAddTopics} disabled={modalLoading}>
            {modalLoading ? 'Adding...' : 'Add Topics'}
          </button>
          <button className="btn" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}

export default Courses
