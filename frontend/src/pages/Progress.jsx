import React, { useEffect, useState } from "react";
import { getProgressOverview } from "../api/api";
import "../styles/progress.css";

// ── SVG Icons for stat cards ─────────────────────────
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ── Donut Chart Component (pure SVG) ─────────────────
const DonutChart = ({ distribution }) => {
  const total = distribution.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return <div className="no-data">No tasks yet</div>;
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const colors = ["#1b3a4b", "#38a169", "#a0aec0"];
  let offset = 0;

  // Find the largest category for center display
  const sorted = [...distribution].sort((a, b) => b.percentage - a.percentage);
  const topCategory = sorted[0];

  return (
    <div className="donut-wrapper">
      <div className="donut-chart">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {distribution.map((item, idx) => {
            const pct = item.count / total;
            const dashLen = pct * circumference;
            const dashOffset = -offset;
            offset += dashLen;
            return (
              <circle
                key={item.name}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={colors[idx % colors.length]}
                strokeWidth="24"
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            );
          })}
        </svg>
        <div className="donut-center">
          <div className="donut-pct">{topCategory.percentage}%</div>
          <div className="donut-label">{topCategory.name}</div>
        </div>
      </div>
      <div className="donut-legend">
        {distribution.map((item, idx) => (
          <div key={item.name} className="donut-legend-item">
            <span className="dl-dot" style={{ background: colors[idx % colors.length] }} />
            <span className="dl-name">{item.name}</span>
            <span className="dl-pct">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Weekly Line Chart (pure SVG) ─────────────────────
const WeeklyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">No weekly data</div>;
  }

  const width = 600;
  const height = 200;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const maxVal = Math.max(...data.map(d => Math.max(d.actual, d.target)), 1);
  const yStep = chartH / maxVal;
  const xStep = chartW / (data.length - 1 || 1);

  const toX = (i) => padL + i * xStep;
  const toY = (v) => padT + chartH - v * yStep;

  const actualPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.actual)}`).join(" ");
  const targetPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.target)}`).join(" ");

  // Y-axis labels
  const yLabels = [];
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const val = Math.round((maxVal / yTicks) * i);
    yLabels.push({ val, y: toY(val) });
  }

  return (
    <div className="weekly-chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yLabels.map((lbl) => (
          <g key={lbl.val}>
            <line x1={padL} y1={lbl.y} x2={width - padR} y2={lbl.y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={padL - 8} y={lbl.y + 4} textAnchor="end" fontSize="10" fill="#a0aec0">{lbl.val}h</text>
          </g>
        ))}

        {/* Target line */}
        <path d={targetPath} fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Actual line */}
        <path d={actualPath} fill="none" stroke="#1b3a4b" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Actual dots */}
        {data.map((d, i) => (
          <circle key={`a-${i}`} cx={toX(i)} cy={toY(d.actual)} r="4" fill="#1b3a4b" />
        ))}

        {/* Target dots */}
        {data.map((d, i) => (
          <circle key={`t-${i}`} cx={toX(i)} cy={toY(d.target)} r="4" fill="#38a169" />
        ))}

        {/* Day labels */}
        {data.map((d, i) => (
          <text key={`d-${i}`} x={toX(i)} y={height - 6} textAnchor="middle" fontSize="11" fill="#718096" fontWeight="500">
            {d.day}
          </text>
        ))}
      </svg>
    </div>
  );
};

// ── Main Progress Page ───────────────────────────────
const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProgressOverview();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="progress-page">
        <div className="progress-loading">
          <div className="progress-spinner" />
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-page">
        <div className="progress-error">
          <p>{error}</p>
          <button onClick={fetchData}>Try Again</button>
        </div>
      </div>
    );
  }

  const { stats, weeklyPerformance, taskDistribution, activeCourses } = data;

  const changeClass = stats.studyTimeChange > 0 ? "positive" : stats.studyTimeChange < 0 ? "negative" : "neutral";
  const changePrefix = stats.studyTimeChange > 0 ? "↑" : stats.studyTimeChange < 0 ? "↓" : "";

  return (
    <div className="progress-page">

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className="stat-cards-row">

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Study Time</span>
            <span className="stat-card-icon time"><ClockIcon /></span>
          </div>
          <div className="stat-card-value">{stats.totalStudyTime}</div>
          <div className="stat-card-sub">
            <span className={changeClass}>
              {changePrefix}{Math.abs(stats.studyTimeChange)}% from last week
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Tasks Completed</span>
            <span className="stat-card-icon tasks"><CheckIcon /></span>
          </div>
          <div className="stat-card-value">{stats.tasksCompleted}</div>
          <div className="stat-card-sub">
            <span className={stats.tasksSinceYesterday >= 0 ? "positive" : "neutral"}>
              {stats.tasksSinceYesterday >= 0 ? "↑" : ""}{stats.tasksSinceYesterday} since yesterday
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Courses Finished</span>
            <span className="stat-card-icon courses"><BookIcon /></span>
          </div>
          <div className="stat-card-value">{stats.coursesFinished}</div>
          <div className="stat-card-sub">
            <span className="neutral">
              {stats.totalCourses > 0
                ? `On track for ${stats.totalCourses} course${stats.totalCourses !== 1 ? "s" : ""} goal`
                : "No courses yet"}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Focus Efficiency</span>
            <span className="stat-card-icon efficiency"><TargetIcon /></span>
          </div>
          <div className="stat-card-value">{stats.focusEfficiency}%</div>
          <div className="stat-card-sub">
            <span className={stats.focusEfficiency >= 80 ? "positive" : "neutral"}>
              {stats.focusEfficiency >= 80 ? "↑ Top performers range" : "Keep going!"}
            </span>
          </div>
        </div>

      </div>

      {/* ── Weekly Performance ────────────────────────── */}
      <div className="weekly-card">
        <div className="weekly-card-header">
          <h2>Weekly Performance Overview</h2>
          <p>Hours engaged per day vs. target goal</p>
        </div>
        <div className="weekly-legend">
          <span><span className="legend-dot actual" /> Actual</span>
          <span><span className="legend-dot target" /> Target (6h)</span>
        </div>
        <WeeklyChart data={weeklyPerformance} />
      </div>

      {/* ── Bottom Grid ──────────────────────────────── */}
      <div className="bottom-grid">

        {/* Task Distribution */}
        <div className="task-dist-card">
          <h2>Task Distribution</h2>
          <DonutChart distribution={taskDistribution} />
        </div>

        {/* Active Course Progress */}
        <div className="course-prog-card">
          <h2>Active Course Progress</h2>
          {activeCourses.length === 0 ? (
            <div className="no-data">No active courses</div>
          ) : (
            <div className="course-prog-list">
              {activeCourses.map((course) => {
                const barClass =
                  course.progress >= 70 ? "cpb-high" :
                  course.progress >= 40 ? "cpb-mid" : "cpb-low";
                return (
                  <div key={course.title} className="course-prog-item">
                    <div className="course-prog-info">
                      <span className="cp-title">{course.title}</span>
                      <span className="cp-pct">{course.progress}%</span>
                    </div>
                    <div className="course-prog-bar">
                      <div
                        className={`course-prog-bar-fill ${barClass}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Progress;