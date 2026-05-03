import { useState } from "react";
 
const courses = [
  {
    id: 1,
    category: "ECONOMICS",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Advanced Macroeconomics",
    status: "IN PROGRESS",
    statusColor: "bg-blue-100 text-blue-700",
    statusDot: "bg-blue-500",
    description:
      "Exploring global market dynamics, fiscal policies, and sovereign debt frameworks.",
    progress: 45,
    progressColor: "bg-blue-600",
    action: "Resume Learning",
    actionStyle: "bg-blue-900 hover:bg-blue-800 text-white",
    filter: "inprogress",
  },
  {
    id: 2,
    category: "DESIGN",
    categoryColor: "bg-teal-100 text-teal-700",
    title: "UX Research Methods",
    status: "COMPLETED",
    statusColor: "bg-green-100 text-green-700",
    statusDot: "bg-green-500",
    description:
      "Mastering qualitative interviewing, usability testing, and data synthesis.",
    progress: 100,
    progressColor: "bg-green-500",
    action: "Review Certificate",
    actionStyle:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    filter: "completed",
  },
  {
    id: 3,
    category: "SCIENCE",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Data Visualization Systems",
    status: "IN PROGRESS",
    statusColor: "bg-blue-100 text-blue-700",
    statusDot: "bg-blue-500",
    description:
      "Creating high-impact visual narratives using d3.js and modern frameworks.",
    progress: 75,
    progressColor: "bg-blue-600",
    action: "Resume Learning",
    actionStyle: "bg-blue-900 hover:bg-blue-800 text-white",
    filter: "inprogress",
  },
  {
    id: 4,
    category: "PHILOSOPHY",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "Architectural Theory",
    status: "WAITLIST",
    statusColor: "bg-orange-100 text-orange-700",
    statusDot: "bg-orange-400",
    description:
      "Scheduled to begin next semester. Essential foundations of structural aesthetics.",
    progress: 0,
    progressColor: "bg-gray-300",
    action: "Enrollment Pending",
    actionStyle:
      "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200",
    filter: "waitlist",
    disabled: true,
  },
];
 
const filters = [
  { label: "All Courses", value: "all" },
  { label: "In Progress", value: "inprogress" },
  { label: "Completed", value: "completed" },
];
 
export default function CourseTracker() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "",
    description: "",
  });
 
  const filtered =
    activeFilter === "all"
      ? courses
      : courses.filter((c) => c.filter === activeFilter);
 
  return (
    <div className="w-full min-h-full overflow-x-hidden font-sans bg-gray-50">
      <div className="mx-auto w-full max-w-screen-2xl px-3 py-5 min-[420px]:px-4 sm:px-5 sm:py-7 lg:px-7 xl:px-8">
 
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Curated Curriculum
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Course Tracker
          </h1>
        </div>
 
        {/* Filters + Add Button */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap min-w-0 gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                  activeFilter === f.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex md:ml-4 md:shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-blue-900 rounded-lg shadow-sm hover:bg-blue-800 sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Add New Course
            </button>
          </div>
        </div>
 
        {/* Course Grid */}
        <div className="flex flex-col w-full gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <div
              key={course.id}
              className={`flex w-full min-w-0 flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 lg:p-6 ${
                course.disabled ? "opacity-80" : ""
              }`}
            >
              {/* Top Row */}
              <div className="flex flex-col items-start gap-2 min-[420px]:flex-row min-[420px]:justify-between">
                <span
                  className={`max-w-full rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${course.categoryColor}`}
                >
                  {course.category}
                </span>
                <span
                  className={`flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${course.statusColor}`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${course.statusDot}`}
                  ></span>
                  {course.status}
                </span>
              </div>
 
              {/* Title + Description */}
              <div className="min-w-0">
                <h2 className="mb-1.5 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                  {course.title}
                </h2>
                <p
                  className={`text-sm leading-relaxed ${
                    course.disabled ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {course.description}
                </p>
              </div>
 
              {/* Progress */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-gray-600">
                    {course.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${course.progressColor}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
 
              {/* Action Button */}
              <button
                disabled={course.disabled}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 sm:py-3 ${course.actionStyle}`}
              >
                {course.action}
              </button>
            </div>
          ))}
        </div>
 
        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <p className="mb-3 text-4xl">📚</p>
            <p className="text-sm font-medium">No courses found</p>
          </div>
        )}
      </div>
 
      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6 overflow-y-auto bg-black/40 sm:px-4">
          <div className="w-full max-w-md p-5 bg-white shadow-2xl rounded-2xl sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Course
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
 
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5 block">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Fluid Mechanics"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm text-gray-800 transition border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
 
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5 block">
                  Category
                </label>
                <select
                  value={newCourse.category}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, category: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm text-gray-800 transition border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select category</option>
                  <option>Economics</option>
                  <option>Design</option>
                  <option>Science</option>
                  <option>Philosophy</option>
                  <option>Technology</option>
                </select>
              </div>
 
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short course description..."
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="w-full px-4 py-3 text-sm text-gray-800 transition border border-gray-200 resize-none rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
 
              <div className="flex flex-col gap-3 mt-2 sm:flex-row">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm font-semibold text-gray-500 transition border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm font-semibold text-white transition bg-blue-900 shadow-sm rounded-xl hover:bg-blue-800"
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
