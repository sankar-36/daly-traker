import React, { useEffect, useState } from 'react'
import { getTasks, addTask, updateTask, deleteTask } from '../api/api'
import TaskList from '../components/TaskList'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const load = async () => {
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (e) {}
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await addTask({ title, description, dueDate })
      setTitle('')
      setDescription('')
      setDueDate('')
      load()
    } catch (e) {}
  }

  const handleUpdate = async (id, payload) => {
    try {
      await updateTask(id, payload)
      load()
    } catch (e) {}
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      load()
    } catch (e) {}
  }

  return (
    <div>
      <h2>Tasks</h2>

      <form className="form" onSubmit={submit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <button className="btn" type="submit">Add Task</button>
      </form>

      <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  )
}

export default Tasks
