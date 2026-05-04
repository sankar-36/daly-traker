import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourses, updateTopicStatus } from "../api/api";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getCourses();
      const found = res.data.find((c) => c._id === id);
      setCourse(found || null);
    } catch (e) {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleTopic = async (moduleId, topicId, isDone) => {
    try {
      await updateTopicStatus(id, moduleId, topicId, { isDone });
      await load();
    } catch (e) {}
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-100 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          to="/courses"
          className="mb-4 inline-flex text-sm font-semibold text-slate-500 no-underline hover:text-slate-900"
        >
          Courses
        </Link>

        <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">{course.title}</h2>
          {course.description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {course.description}
            </p>
          )}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Progress</span>
              <span>{course.progressPercentage || 0}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-cyan-700 transition-all"
                style={{ width: `${course.progressPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {(course.modules || []).map((module, moduleIndex) => (
            <section
              key={module._id || moduleIndex}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                {module.title}
              </h3>
              <div className="space-y-2">
                {(module.topics || []).map((topic) => (
                  <label
                    key={topic._id}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={!!topic.isDone}
                      onChange={(event) =>
                        toggleTopic(module._id, topic._id, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600"
                    />
                    <span>{topic.title}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
