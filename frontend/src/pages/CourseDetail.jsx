import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiSave } from "react-icons/fi";
import { getCourses, updateTopicStatus } from "../api/api";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalTopicStatus, setOriginalTopicStatus] = useState({});
  const [dirtyTopics, setDirtyTopics] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  const getTopicKey = (moduleId, topicId) => `${moduleId}:${topicId}`;

  const getTopicStatusMap = (nextCourse) => {
    const statusMap = {};

    (nextCourse?.modules || []).forEach((module) => {
      (module.topics || []).forEach((topic) => {
        statusMap[getTopicKey(module._id, topic._id)] = !!topic.isDone;
      });
    });

    return statusMap;
  };

  const getProgressPercentage = (modules = []) => {
    const topics = modules.flatMap((module) => module.topics || []);
    if (topics.length === 0) return 0;

    const completedTopics = topics.filter((topic) => topic.isDone).length;
    return Math.round((completedTopics / topics.length) * 100);
  };

  const applyLoadedCourse = (nextCourse) => {
    setCourse(nextCourse || null);
    setOriginalTopicStatus(getTopicStatusMap(nextCourse));
    setDirtyTopics({});
    setSavedAt(null);
  };

  const load = async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);
      const res = await getCourses();
      const found = res.data.find((c) => c._id === id);
      applyLoadedCourse(found || null);
    } catch (e) {
      applyLoadedCourse(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleTopic = (moduleId, topicId, isDone) => {
    const key = getTopicKey(moduleId, topicId);

    setCourse((currentCourse) => {
      if (!currentCourse) return currentCourse;

      const modules = (currentCourse.modules || []).map((module) => {
        if (module._id !== moduleId) return module;

        return {
          ...module,
          topics: (module.topics || []).map((topic) =>
            topic._id === topicId ? { ...topic, isDone } : topic
          ),
        };
      });

      return {
        ...currentCourse,
        modules,
        progressPercentage: getProgressPercentage(modules),
      };
    });

    setDirtyTopics((currentDirtyTopics) => {
      const nextDirtyTopics = { ...currentDirtyTopics };

      if (originalTopicStatus[key] === isDone) {
        delete nextDirtyTopics[key];
      } else {
        nextDirtyTopics[key] = { moduleId, topicId, isDone };
      }

      return nextDirtyTopics;
    });

    setSaveError("");
    setSavedAt(null);
  };

  const saveChanges = async () => {
    const changes = Object.values(dirtyTopics);
    if (changes.length === 0 || saving) return;

    try {
      setSaving(true);
      setSaveError("");

      await Promise.all(
        changes.map(({ moduleId, topicId, isDone }) =>
          updateTopicStatus(id, moduleId, topicId, { isDone })
        )
      );

      await load({ showLoading: false });
      setSavedAt(new Date());
    } catch (e) {
      setSaveError(
        e?.response?.data?.message || "Unable to save course changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.keys(dirtyTopics).length > 0;

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
        <div className="sticky top-0 z-20 -mx-3 mb-4 border-b border-slate-200 bg-slate-100/95 px-3 py-3 backdrop-blur sm:-mx-5 sm:px-5 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-[20px] text-sm font-medium text-slate-600">
              {saveError ? (
                <span className="text-red-600">{saveError}</span>
              ) : hasChanges ? (
                <span>Unsaved topic changes</span>
              ) : savedAt ? (
                <span>
                  Saved{" "}
                  {savedAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/courses/${id}/edit`)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
              >
                <FiEdit2 size={15} />
                Edit
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={!hasChanges || saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-700 bg-cyan-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto"
              >
                <FiSave size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

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
