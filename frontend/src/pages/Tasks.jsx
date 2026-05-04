import { useEffect, useState } from "react";
import { addTask, getTasks, toggleTaskStatus, updateTask } from "../api/api";

const priorityConfig = {
  high: "bg-red-100 text-red-600",
  medium: "bg-blue-100 text-blue-600",
  low: "bg-green-100 text-green-600",
};

const categoryConfig = {
  work: "bg-slate-100 text-slate-600",
  personal: "bg-purple-100 text-purple-600",
  study: "bg-amber-100 text-amber-700",
};

const emptyTaskForm = {
  title: "",
  description: "",
  priority: "medium",
  category: "study",
  time: "",
  isCompleted: false,
};

function TaskModal({ onClose, onSave, editTask, saving, error }) {
  const [form, setForm] = useState(() =>
    editTask
      ? {
          title: editTask.title || "",
          description: editTask.description || "",
          priority: editTask.priority || "medium",
          category: editTask.category || "study",
          time: editTask.time || "",
          isCompleted: !!editTask.isCompleted,
        }
      : emptyTaskForm
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {editTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="task-title"
              className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400"
            >
              Title
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Review Chapter 4"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400"
            >
              Description
            </label>
            <textarea
              id="task-description"
              rows={2}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Short task description..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-priority"
                className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(event) =>
                  updateField("priority", event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-category"
                className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400"
              >
                Category
              </label>
              <select
                id="task-category"
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-time"
                className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400"
              >
                Time
              </label>
              <input
                id="task-time"
                type="time"
                value={form.time}
                onChange={(event) => updateField("time", event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <label className="mt-5 flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                checked={form.isCompleted}
                onChange={(event) =>
                  updateField("isCompleted", event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Completed
            </label>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : editTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "long" }).toUpperCase();

  const completed = tasks.filter((task) => task.isCompleted).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTasks();
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const openAddModal = () => {
    setModalError("");
    setShowAdd(true);
  };

  const openEditModal = (task) => {
    setModalError("");
    setEditTask(task);
  };

  const validateForm = (form) => {
    if (!form.title.trim()) return "Task title is required.";
    if (!form.category) return "Category is required.";
    if (!form.priority) return "Priority is required.";
    if (!form.time) return "Time is required.";
    return "";
  };

  const handleAdd = async (form) => {
    const validationError = validateForm(form);
    if (validationError) {
      setModalError(validationError);
      return;
    }

    try {
      setSaving(true);
      setModalError("");
      const response = await addTask({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        category: form.category,
        time: form.time,
        isCompleted: form.isCompleted,
      });
      setTasks((current) => [...current, response.data]);
      setShowAdd(false);
    } catch (e) {
      setModalError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Unable to add task."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    const validationError = validateForm(form);
    if (validationError) {
      setModalError(validationError);
      return;
    }

    try {
      setSaving(true);
      setModalError("");
      const response = await updateTask(editTask._id, {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        category: form.category,
        time: form.time,
        isCompleted: form.isCompleted,
      });
      setTasks((current) =>
        current.map((task) =>
          task._id === editTask._id ? response.data.task || task : task
        )
      );
      setEditTask(null);
    } catch (e) {
      setModalError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Unable to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (taskId) => {
    const previousTasks = tasks;
    setTasks((current) =>
      current.map((task) =>
        task._id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );

    try {
      const response = await toggleTaskStatus(taskId);
      setTasks((current) =>
        current.map((task) =>
          task._id === taskId ? response.data.task || task : task
        )
      );
    } catch (e) {
      setTasks(previousTasks);
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Unable to update task status."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-white px-4 py-8 font-sans sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Personal Planner
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Daily Focus.
            </h1>
          </div>

          <div className="text-right">
            <p className="text-3xl font-extrabold leading-none text-gray-900 sm:text-4xl">
              {String(day).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {month}
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            <span className="text-base leading-none">+</span>
            Add Task
          </button>
        </div>

        <div className="mb-6 h-px bg-gray-100" />

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center text-sm font-medium text-gray-400">
            Loading tasks...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`flex gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                  task.isCompleted
                    ? "border-gray-100 bg-gray-50"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task._id)}
                  aria-label={
                    task.isCompleted ? "Mark incomplete" : "Mark complete"
                  }
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    task.isCompleted
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {task.isCompleted && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(task)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        task.isCompleted
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${priorityConfig[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="mb-2 text-xs leading-relaxed text-gray-400">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryConfig[task.category]}`}
                    >
                      {task.category}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-400">
                      {task.time}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm font-medium">No tasks yet. Add one!</p>
          </div>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-bold text-gray-900">
                Daily Progress
              </p>
              <p className="text-xs text-gray-400">
                You have completed{" "}
                <span className="font-semibold text-gray-600">
                  {completed} of {tasks.length}
                </span>{" "}
                tasks today. Keep pushing!
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-col items-center gap-1">
              <div className="flex h-20 w-6 flex-col-reverse overflow-hidden rounded-full bg-gray-100">
                <div
                  className="w-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ height: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <TaskModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          saving={saving}
          error={modalError}
        />
      )}
      {editTask && (
        <TaskModal
          onClose={() => setEditTask(null)}
          onSave={handleEdit}
          editTask={editTask}
          saving={saving}
          error={modalError}
        />
      )}
    </div>
  );
}
