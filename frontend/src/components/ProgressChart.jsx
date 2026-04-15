import React from 'react'

// Simple SVG grouped bar chart for recent labels
const ProgressChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) return <div>No progress data</div>

  const labels = data.labels.slice(-7)
  const completed = data.completed.slice(-7)
  const pending = data.pending.slice(-7)
  const overdue = data.overdue.slice(-7)

  const max = Math.max(
    ...[...completed, ...pending, ...overdue].map((v) => (typeof v === 'number' ? v : 0)),
    1
  )

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${labels.length * 60} 120`} preserveAspectRatio="xMidYMid meet">
        {labels.map((label, i) => {
          const x = i * 60 + 10
          const cw = 12
          const ph = 40
          const completedH = Math.round((completed[i] || 0) / max * ph)
          const pendingH = Math.round((pending[i] || 0) / max * ph)
          const overdueH = Math.round((overdue[i] || 0) / max * ph)
          return (
            <g key={label}>
              <rect x={x} y={80 - completedH} width={cw} height={completedH} fill="#4caf50" />
              <rect x={x + cw + 4} y={80 - pendingH} width={cw} height={pendingH} fill="#ff9800" />
              <rect x={x + 2 * (cw + 4)} y={80 - overdueH} width={cw} height={overdueH} fill="#f44336" />
              <text x={x} y={100} fontSize="8">{label}</text>
            </g>
          )
        })}
      </svg>
      <div className="legend">
        <span><span className="dot" style={{ background: '#4caf50' }} />Completed</span>
        <span><span className="dot" style={{ background: '#ff9800' }} />Pending</span>
        <span><span className="dot" style={{ background: '#f44336' }} />Overdue</span>
      </div>
    </div>
  )
}

export default ProgressChart
