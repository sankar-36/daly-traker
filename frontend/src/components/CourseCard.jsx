import React from 'react'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="card-meta">
        <span>Progress: {course.progressPercentage || 0}%</span>
        <Link to={`/courses/${course._id}`} className="btn small">Open</Link>
      </div>
    </div>
  )
}

export default CourseCard
