import React from 'react'

const TaskList = ({ tasks = [], onUpdate, onDelete }) => {
  return (
    <div>
      {tasks.length === 0 && <p>No tasks yet.</p>}
      {tasks.map((t) => (
        <div key={t._id} className="task-row">
          <div>
            <strong>{t.title}</strong>
            <div className="muted">{t.description}</div>
          </div>
          <div className="task-actions">
            <select
              value={t.status}
              onChange={(e) => onUpdate(t._id, { status: e.target.value })}
            >
              <option>Pending</option>
              <option>Complete</option>
              <option>Overdue</option>
            </select>
            <button className="btn danger" onClick={() => onDelete(t._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList
