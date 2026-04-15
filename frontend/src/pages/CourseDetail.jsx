import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourses, updateTopicStatus } from '../api/api'

const CourseDetail = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  const load = async () => {
    try {
      const res = await getCourses()
      const found = res.data.find((c) => c._id === id)
      setCourse(found || null)
    } catch (e) {}
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const toggleTopic = async (topicId, completed) => {
    try {
      await updateTopicStatus(id, topicId, { completed })
      await load()
    } catch (e) {}
  }

  if (!course) return <div>Course not found</div>

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <h3>Topics</h3>
      <ul>
        {course.topics.map((t) => (
          <li key={t._id}>
            <label>
              <input type="checkbox" checked={!!t.completed} onChange={(e) => toggleTopic(t._id, e.target.checked)} />
              {t.title}
            </label>
          </li>
        ))}
      </ul>

      <div>Progress: {course.progressPercentage}%</div>
    </div>
  )
}

export default CourseDetail
