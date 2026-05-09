import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheck,
  FiLoader,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { getCourses, editCourse } from "../api/api";

/* ─── helpers ─────────────────────────────────────────── */
const emptyTopic = () => ({ title: "", isDone: false });
const emptyModule = () => ({ title: "", topics: [emptyTopic()] });

/** Map a course returned by the server into our local form shape */
const courseToForm = (course) => ({
  title: course?.title || "",
  description: course?.description || "",
  modules:
    Array.isArray(course?.modules) && course.modules.length > 0
      ? course.modules.map((mod) => ({
          _id: mod._id,
          title: mod.title || "",
          isCurrent: mod.isCurrent ?? false,
          order: mod.order ?? 0,
          topics:
            Array.isArray(mod.topics) && mod.topics.length > 0
              ? mod.topics.map((t) => ({
                  _id: t._id,
                  title: t.title || "",
                  isDone: t.isDone ?? false,
                }))
              : [emptyTopic()],
        }))
      : [emptyModule()],
});

/* ─── component ───────────────────────────────────────── */
export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState(null);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | success
  const [error, setError] = useState("");

  /* ── load course ── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const res = await getCourses();
        const found = res.data.find((c) => c._id === id);
        if (!found) {
          if (!cancelled) setLoadError("Course not found.");
          return;
        }
        if (!cancelled) setForm(courseToForm(found));
      } catch {
        if (!cancelled) setLoadError("Failed to load course. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  /* ── derived ── */
  const hasUsableModule = useMemo(
    () =>
      form?.modules?.some(
        (mod) =>
          mod.title.trim() && mod.topics.some((t) => t.title.trim())
      ) ?? false,
    [form]
  );

  /* ── field updaters ── */
  const updateField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateModuleTitle = (mIdx, value) =>
    setForm((f) => ({
      ...f,
      modules: f.modules.map((mod, i) =>
        i === mIdx ? { ...mod, title: value } : mod
      ),
    }));

  const addModule = () =>
    setForm((f) => ({ ...f, modules: [...f.modules, emptyModule()] }));

  const removeModule = (mIdx) =>
    setForm((f) => ({
      ...f,
      modules:
        f.modules.length === 1
          ? [emptyModule()]
          : f.modules.filter((_, i) => i !== mIdx),
    }));

  const updateTopicTitle = (mIdx, tIdx, value) =>
    setForm((f) => ({
      ...f,
      modules: f.modules.map((mod, i) =>
        i === mIdx
          ? {
              ...mod,
              topics: mod.topics.map((t, j) =>
                j === tIdx ? { ...t, title: value } : t
              ),
            }
          : mod
      ),
    }));

  const addTopic = (mIdx) =>
    setForm((f) => ({
      ...f,
      modules: f.modules.map((mod, i) =>
        i === mIdx ? { ...mod, topics: [...mod.topics, emptyTopic()] } : mod
      ),
    }));

  const removeTopic = (mIdx, tIdx) =>
    setForm((f) => ({
      ...f,
      modules: f.modules.map((mod, i) =>
        i === mIdx
          ? {
              ...mod,
              topics:
                mod.topics.length === 1
                  ? [emptyTopic()]
                  : mod.topics.filter((_, j) => j !== tIdx),
            }
          : mod
      ),
    }));

  /* ── submit ── */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }
    if (!hasUsableModule) {
      setError("Add at least one module with one topic.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      modules: form.modules
        .map((mod) => ({
          _id: mod._id,
          title: mod.title.trim(),
          isCurrent: mod.isCurrent ?? false,
          order: mod.order ?? 0,
          topics: mod.topics
            .map((t) => ({
              _id: t._id,
              title: t.title.trim(),
              isDone: t.isDone ?? false,
            }))
            .filter((t) => t.title),
        }))
        .filter((mod) => mod.title),
    };

    const incompleteModule = payload.modules.find((m) => m.topics.length === 0);
    if (incompleteModule) {
      setError(`Module "${incompleteModule.title}" needs at least one topic.`);
      return;
    }

    try {
      setSubmitState("submitting");
      await editCourse(id, payload);
      setSubmitState("success");
      // Brief success flash, then navigate back to detail view
      setTimeout(() => navigate(`/courses/${id}`, { replace: true }), 600);
    } catch (e) {
      setSubmitState("idle");
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Unable to update course. Please try again."
      );
    }
  };

  /* ─── loading / error states ─── */
  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-100 py-20">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <FiLoader size={18} className="animate-spin text-cyan-600" />
          Loading course&hellip;
        </div>
      </div>
    );
  }

  if (loadError || !form) {
    return (
      <div className="min-h-full bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {loadError || "Course not found."}
        </div>
      </div>
    );
  }

  /* ─── main render ─── */
  return (
    <div className="min-h-full bg-slate-100 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* ── header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              to={`/courses/${id}`}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 no-underline transition-colors hover:text-slate-900"
            >
              <FiArrowLeft size={16} />
              Back to Course
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Edit Course
            </h1>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 shadow-sm">
            <FiBookOpen size={16} />
            {form.modules.length} module{form.modules.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* ── form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Course info */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
              <div>
                <label
                  htmlFor="edit-course-title"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Course Title
                </label>
                <input
                  id="edit-course-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Full Stack Development"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div className="flex items-end">
                <div className="flex w-full items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <FiBookOpen size={20} className="shrink-0 text-cyan-700" />
                  <span>
                    {form.modules.length} module
                    {form.modules.length === 1 ? "" : "s"} planned
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="edit-course-description"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Description
              </label>
              <textarea
                id="edit-course-description"
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="What will this course help you learn?"
                className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </section>

          {/* Modules */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-slate-950">Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
              >
                <FiPlus size={16} />
                Add Module
              </button>
            </div>

            {form.modules.map((mod, mIdx) => (
              <div
                key={mod._id || mIdx}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                {/* Module header */}
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm font-bold text-cyan-700">
                    {mIdx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor={`edit-module-${mIdx}`}
                      className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Module Title
                    </label>
                    <input
                      id={`edit-module-${mIdx}`}
                      type="text"
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                      placeholder="e.g. React Fundamentals"
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModule(mIdx)}
                    aria-label={`Remove module ${mIdx + 1}`}
                    title="Remove module"
                    className="mt-6 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                {/* Topics */}
                <div className="space-y-3">
                  {mod.topics.map((topic, tIdx) => (
                    <div
                      key={topic._id || tIdx}
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_40px]"
                    >
                      <div>
                        <label
                          htmlFor={`edit-module-${mIdx}-topic-${tIdx}`}
                          className="sr-only"
                        >
                          Topic {tIdx + 1}
                        </label>
                        <input
                          id={`edit-module-${mIdx}-topic-${tIdx}`}
                          type="text"
                          value={topic.title}
                          onChange={(e) =>
                            updateTopicTitle(mIdx, tIdx, e.target.value)
                          }
                          placeholder={`Topic ${tIdx + 1}`}
                          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTopic(mIdx, tIdx)}
                        aria-label={`Remove topic ${tIdx + 1}`}
                        title="Remove topic"
                        className="h-10 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addTopic(mIdx)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  <FiPlus size={15} />
                  Add Topic
                </button>
              </div>
            ))}
          </section>

          {/* Error banner */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Link
              to={`/courses/${id}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitState === "submitting" || submitState === "success"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState === "submitting" ? (
                <FiLoader size={17} className="animate-spin" />
              ) : submitState === "success" ? (
                <FiCheck size={17} />
              ) : (
                <FiSave size={17} />
              )}
              {submitState === "submitting"
                ? "Saving…"
                : submitState === "success"
                ? "Saved!"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
