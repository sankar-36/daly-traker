import React, { useEffect, useState } from 'react'
import { getCourses, getProgressSummary, getTasks } from '../api/api'
import CourseCard from '../components/CourseCard'
import ProgressChart from '../components/ProgressChart'


const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState(null)
  const [tasksCount, setTasksCount] = useState(0)

  const load = async () => {
    try {
      const c = await getCourses()
      setCourses(c.data)
    } catch (e) {}
    try {
      const p = await getProgressSummary()
      setProgress(p.data.data)
    } catch (e) {}
    try {
      const t = await getTasks()
      setTasksCount(t.data.length)
    } catch (e) {}
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
     
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Courses</h3>
          <div>{courses.length} course(s)</div>
        </div>
        <div className="card">
          <h3>Tasks</h3>
          <div>{tasksCount} task(s)</div>
        </div>
      </div>

      <section>
        <h3>Your Courses</h3>
        <div className="list">
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      </section>

      <section>
        <h3>Progress Summary</h3>
        <ProgressChart data={progress} />
      </section>
    </div>
  )
}

export default Dashboard
