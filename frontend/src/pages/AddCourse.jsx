import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheck,
  FiLoader,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { initCourse } from "../api/api";

const STORAGE_KEY = "addCourseDraft";

const emptyTopic = () => ({ title: "" });
const emptyModule = () => ({ title: "", topics: [emptyTopic()] });
const initialForm = {
  title: "",
  description: "",
  modules: [emptyModule()],
};

const normalizeDraft = (draft) => ({
  title: draft?.title || "",
  description: draft?.description || "",
  modules:
    Array.isArray(draft?.modules) && draft.modules.length > 0
      ? draft.modules.map((module) => ({
          title: module?.title || "",
          topics:
            Array.isArray(module?.topics) && module.topics.length > 0
              ? module.topics.map((topic) => ({
                  title:
                    typeof topic === "string" ? topic : topic?.title || "",
                }))
              : [emptyTopic()],
        }))
      : [emptyModule()],
});

export default function AddCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitState, setSubmitState] = useState("idle");
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        setForm(normalizeDraft(JSON.parse(draft)));
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSavedAt(new Date());
  }, [form]);

  const hasUsableModule = useMemo(
    () =>
      form.modules.some(
        (module) =>
          module.title.trim() &&
          module.topics.some((topic) => topic.title.trim())
      ),
    [form.modules]
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateModule = (moduleIndex, value) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex ? { ...module, title: value } : module
      ),
    }));
  };

  const updateTopic = (moduleIndex, topicIndex, value) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              topics: module.topics.map((topic, currentTopicIndex) =>
                currentTopicIndex === topicIndex
                  ? { ...topic, title: value }
                  : topic
              ),
            }
          : module
      ),
    }));
  };

  const addModule = () => {
    setForm((current) => ({
      ...current,
      modules: [...current.modules, emptyModule()],
    }));
  };

  const removeModule = (moduleIndex) => {
    setForm((current) => ({
      ...current,
      modules:
        current.modules.length === 1
          ? [emptyModule()]
          : current.modules.filter((_, index) => index !== moduleIndex),
    }));
  };

  const addTopic = (moduleIndex) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? { ...module, topics: [...module.topics, emptyTopic()] }
          : module
      ),
    }));
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              topics:
                module.topics.length === 1
                  ? [emptyTopic()]
                  : module.topics.filter(
                      (_, currentTopicIndex) => currentTopicIndex !== topicIndex
                    ),
            }
          : module
      ),
    }));
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    modules: form.modules
      .map((module) => ({
        title: module.title.trim(),
        topics: module.topics
          .map((topic) => ({ title: topic.title.trim(), isDone: false }))
          .filter((topic) => topic.title),
      }))
      .filter((module) => module.title),
  });

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

    const payload = buildPayload();
    const incompleteModule = payload.modules.find(
      (module) => module.topics.length === 0
    );

    if (incompleteModule) {
      setError("Every saved module needs at least one topic.");
      return;
    }

    try {
      setSubmitState("submitting");
      const response = await initCourse(payload);
      localStorage.removeItem(STORAGE_KEY);
      setSubmitState("success");
      navigate(response.data?._id ? `/courses/${response.data._id}` : "/courses", {
        replace: true,
      });
    } catch (e) {
      setSubmitState("idle");
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Unable to create course. Please try again."
      );
    }
  };

  const savedText = savedAt
    ? `Saved ${savedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Draft ready";

  return (
    <div className="min-h-full bg-slate-100 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              to="/courses"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 no-underline transition-colors hover:text-slate-900"
            >
              <FiArrowLeft size={16} />
              Courses
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Add Course
            </h1>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 shadow-sm">
            <FiSave size={16} />
            {savedText}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
              <div>
                <label
                  htmlFor="course-title"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  Course Title
                </label>
                <input
                  id="course-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
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
                htmlFor="course-description"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Description
              </label>
              <textarea
                id="course-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="What will this course help you learn?"
                className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </section>

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

            {form.modules.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm font-bold text-cyan-700">
                    {moduleIndex + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor={`module-${moduleIndex}`}
                      className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
                    >
                      Module Title
                    </label>
                    <input
                      id={`module-${moduleIndex}`}
                      type="text"
                      value={module.title}
                      onChange={(event) =>
                        updateModule(moduleIndex, event.target.value)
                      }
                      placeholder="e.g. React Fundamentals"
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModule(moduleIndex)}
                    aria-label={`Remove module ${moduleIndex + 1}`}
                    title="Remove module"
                    className="mt-6 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {module.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_40px]"
                    >
                      <div>
                        <label
                          htmlFor={`module-${moduleIndex}-topic-${topicIndex}`}
                          className="sr-only"
                        >
                          Topic {topicIndex + 1}
                        </label>
                        <input
                          id={`module-${moduleIndex}-topic-${topicIndex}`}
                          type="text"
                          value={topic.title}
                          onChange={(event) =>
                            updateTopic(
                              moduleIndex,
                              topicIndex,
                              event.target.value
                            )
                          }
                          placeholder={`Topic ${topicIndex + 1}`}
                          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTopic(moduleIndex, topicIndex)}
                        aria-label={`Remove topic ${topicIndex + 1}`}
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
                  onClick={() => addTopic(moduleIndex)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  <FiPlus size={15} />
                  Add Topic
                </button>
              </div>
            ))}
          </section>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState === "submitting" ? (
                <FiLoader size={17} className="animate-spin" />
              ) : submitState === "success" ? (
                <FiCheck size={17} />
              ) : (
                <FiCheck size={17} />
              )}
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
