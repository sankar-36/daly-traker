import { useState } from "react";
 
const priorityConfig = {
  "NORMAL PRIORITY": "bg-gray-100 text-gray-500",
  "NEW PRIORITY":    "bg-blue-100 text-blue-600",
  "LOW PRIORITY":    "bg-green-100 text-green-600",
  URGENT:            "bg-red-100 text-red-500",
};
 
const initialTasks = [
  {
    id: 1,
    title: "Study Macroeconomics Chapter 4",
    priority: "NORMAL PRIORITY",
    description: "Review aggregate demand and supply curves for the upcoming quiz.",
    tags: [
      { icon: "📖", label: "IN COURSE: ECONOMICS 101" },
      { icon: "🕐", label: "9:30 AM" },
    ],
    completed: true,
  },
  {
    id: 2,
    title: "Draft Research Proposal",
    priority: "NEW PRIORITY",
    description: "Outline the methodology section and finalize the research questions.",
    tags: [
      { icon: "📁", label: "IN PROJECT: THESIS" },
      { icon: "🕐", label: "DUE IN 2 DAYS" },
    ],
    completed: false,
  },
  {
    id: 3,
    title: "Review Literature for Sociology",
    priority: "LOW PRIORITY",
    description: "Read the three assigned papers on social stratification in the library.",
    tags: [
      { icon: "📚", label: "LIBRARY" },
      { icon: "🕐", label: "4:00 PM" },
    ],
    completed: false,
  },
  {
    id: 4,
    title: "Submit Abstract for Conference",
    priority: "URGENT",
    description: "Submit the final draft of the conference abstract through the portal.",
    tags: [
      { icon: "🎤", label: "CONFERENCE" },
      { icon: "🕐", label: "11:45 PM" },
    ],
    completed: false,
  },
];
 
// ── Modal ──────────────────────────────────────────────
function TaskModal({ onClose, onSave, editTask }) {
  const [form, setForm] = useState(
    editTask || { title: "", priority: "NORMAL PRIORITY", description: "", tag: "", time: "" }
  );
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
      <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            {editTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-gray-600">×</button>
        </div>
 
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 block">Task Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Study Chapter 4"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>
 
          {/* Priority */}
          <div>
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 block">Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            >
              {Object.keys(priorityConfig).map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
 
          {/* Description */}
          <div>
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 block">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Short task description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition resize-none"
            />
          </div>
 
          {/* Tag + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 block">Category</label>
              <input
                type="text"
                value={form.tag}
                onChange={e => setForm({ ...form, tag: e.target.value })}
                placeholder="e.g. LIBRARY"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 block">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
              />
            </div>
          </div>
 
          {/* Buttons */}
          <div className="flex gap-3 mt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              onClick={() => { onSave(form); onClose(); }}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition"
            >
              {editTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ── Main Page ──────────────────────────────────────────
export default function TaskPage() {
  const [tasks, setTasks]           = useState(initialTasks);
  const [showAdd, setShowAdd]       = useState(false);
  const [editTask, setEditTask]     = useState(null);
 
  const today = new Date();
  const day   = today.getDate();
  const month = today.toLocaleString("en-US", { month: "long" }).toUpperCase();
 
  const completed = tasks.filter(t => t.completed).length;
  const progress  = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
 
  const toggleTask = id =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
 
  const handleAdd = form => {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        title: form.title,
        priority: form.priority,
        description: form.description,
        tags: [
          ...(form.tag  ? [{ icon: "📁", label: form.tag.toUpperCase() }]  : []),
          ...(form.time ? [{ icon: "🕐", label: form.time }]               : []),
        ],
        completed: false,
      },
    ]);
  };
 
  const handleEdit = form => {
    setTasks(prev =>
      prev.map(t =>
        t.id === editTask.id
          ? { ...t, title: form.title, priority: form.priority, description: form.description }
          : t
      )
    );
    setEditTask(null);
  };
 
  return (
    <div className="w-full min-h-screen px-4 py-8 font-sans bg-white sm:px-6 lg:px-10">
      <div className="w-full max-w-2xl mx-auto">
 
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Personal Planner
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Daily Focus.
            </h1>
          </div>
 
          {/* Date */}
          <div className="text-right">
            <p className="text-3xl font-extrabold leading-none text-gray-900 sm:text-4xl">
              {String(day).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
              {month}
            </p>
          </div>
        </div>
 
        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Add Task
          </button>
          <button
            onClick={() => tasks.length && setEditTask(tasks[0])}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            <span>✏</span>
            Edit Task
          </button>
        </div>
 
        {/* ── Divider ── */}
        <div className="h-px mb-6 bg-gray-100" />
 
        {/* ── Task List ── */}
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`flex gap-3 p-4 rounded-2xl border transition-all duration-200 ${
                task.completed
                  ? "bg-gray-50 border-gray-100"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {task.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
 
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title + Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                    {task.title}
                  </span>
                  <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase ${priorityConfig[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
 
                {/* Description */}
                <p className="mb-2 text-xs leading-relaxed text-gray-400">
                  {task.description}
                </p>
 
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 tracking-wide">
                      <span>{tag.icon}</span>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
 
        {/* ── Empty State ── */}
        {tasks.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <p className="mb-3 text-4xl">✅</p>
            <p className="text-sm font-medium">No tasks yet — add one!</p>
          </div>
        )}
 
        {/* ── Daily Progress ── */}
        <div className="pt-6 mt-8 border-t border-gray-100">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-bold text-gray-900">Daily Progress</p>
              <p className="text-xs text-gray-400">
                You have completed{" "}
                <span className="font-semibold text-gray-600">{completed} of {tasks.length}</span>{" "}
                tasks today. Keep pushing!
              </p>
            </div>
 
            {/* Vertical Progress Bar */}
            <div className="flex flex-col items-center flex-shrink-0 gap-1">
              <div className="flex flex-col-reverse w-6 h-20 overflow-hidden bg-gray-100 rounded-full">
                <div
                  className="w-full transition-all duration-700 rounded-full bg-emerald-500"
                  style={{ height: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{progress}%</span>
            </div>
          </div>
        </div>
 
      </div>
 
      {/* ── Modals ── */}
      {showAdd  && <TaskModal onClose={() => setShowAdd(false)}  onSave={handleAdd} />}
      {editTask && <TaskModal onClose={() => setEditTask(null)}  onSave={handleEdit} editTask={editTask} />}
    </div>
  );
}