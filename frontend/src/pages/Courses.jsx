import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api/api";

const filters = [
  { label: "All Courses", value: "all" },
  { label: "In Progress", value: "inprogress" },
  { label: "Completed", value: "completed" },
];

const getCourseStatus = (progress) => {
  if (progress >= 100) {
    return {
      label: "COMPLETED",
      filter: "completed",
      statusColor: "bg-green-100 text-green-700",
      statusDot: "bg-green-500",
      progressColor: "bg-green-500",
      action: "Review Course",
      actionStyle:
        "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    };
  }

  return {
    label: progress > 0 ? "IN PROGRESS" : "NOT STARTED",
    filter: "inprogress",
    statusColor: "bg-blue-100 text-blue-700",
    statusDot: "bg-blue-500",
    progressColor: "bg-blue-600",
    action: progress > 0 ? "Resume Learning" : "Start Learning",
    actionStyle: "bg-blue-900 hover:bg-blue-800 text-white",
  };
};

export default function CourseTracker() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCourses();
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            "Unable to load courses."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const decoratedCourses = courses.map((course) => {
    const progress = Number(course.progressPercentage || 0);
    const status = getCourseStatus(progress);

    return {
      ...course,
      progress,
      ...status,
      moduleCount: Array.isArray(course.modules) ? course.modules.length : 0,
    };
  });

  const filtered =
    activeFilter === "all"
      ? decoratedCourses
      : decoratedCourses.filter((course) => course.filter === activeFilter);

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-gray-50 font-sans">
      <div className="mx-auto w-full max-w-screen-2xl px-3 py-5 min-[420px]:px-4 sm:px-5 sm:py-7 lg:px-7 xl:px-8">
        <div className="mb-6 sm:mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Curated Curriculum
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Course Tracker
          </h1>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                  activeFilter === filter.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex md:ml-4 md:shrink-0">
            <Link
              to="/courses/add"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-all duration-200 hover:bg-blue-800 sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Add New Course
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm font-medium text-gray-400 shadow-sm">
            Loading courses...
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((course) => (
              <div
                key={course._id}
                className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 lg:p-6"
              >
                <div className="flex flex-col items-start gap-2 min-[420px]:flex-row min-[420px]:justify-between">
                  <span className="max-w-full rounded-md bg-teal-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-700">
                    {course.moduleCount} Module
                    {course.moduleCount === 1 ? "" : "s"}
                  </span>
                  <span
                    className={`flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${course.statusColor}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${course.statusDot}`}
                    />
                    {course.label}
                  </span>
                </div>

                <div className="min-w-0">
                  <h2 className="mb-1.5 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                    {course.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {course.description || "No description added yet."}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-gray-600">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${course.progressColor}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className={`w-full rounded-xl py-2.5 text-center text-sm font-semibold no-underline transition-all duration-200 sm:py-3 ${course.actionStyle}`}
                >
                  {course.action}
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <p className="text-sm font-medium">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
