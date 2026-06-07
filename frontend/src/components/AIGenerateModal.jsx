/**
 * AIGenerateModal — A modal component for AI-powered course generation.
 *
 * Opens a fullscreen overlay where the user types a course title (e.g. "Learn React Native").
 * On clicking "Generate", it calls the Gemini AI API to produce a full course structure
 * with 4-6 modules and 3-5 topics each. The result is passed back to the parent
 * via onGenerate(course) to auto-fill the Create Course form.
 *
 * Props:
 *   onClose     — Function to close the modal
 *   onGenerate  — Function that receives the generated course data
 */

import React, { useState, useRef, useEffect } from "react";
import { generateCourseAI } from "../api/api";

const EXAMPLE_CHIPS = [
  "Learn React Native",
  "DSA with Python",
  "UI/UX Design",
  "Node.js Backend",
  "Machine Learning",
];

export default function AIGenerateModal({ onClose, onGenerate }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Auto-focus the input when modal mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleGenerate = async () => {
    if (!title.trim() || loading) return;

    setError("");
    setLoading(true);

    try {
      const course = await generateCourseAI(title.trim());
      onGenerate(course);
      onClose();
    } catch (err) {
      // Network / connection error
      if (!err.response) {
        setError("Connection failed. Check your internet.");
      }
      // Rate limit (429) — show exact wait time if available
      else if (err.response?.status === 429) {
        const retryAfter = err.response?.data?.retryAfter;
        if (retryAfter) {
          setError(`Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before generating again.`);
        } else {
          setError("AI rate limit reached. Please wait a moment and try again.");
        }
      }
      // Other server errors
      else {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && title.trim()) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleChipClick = (chip) => {
    setTitle(chip);
    setError("");
    inputRef.current?.focus();
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[440px] rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                🤖 AI Course Generator
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter a topic and let AI create a full course outline for you
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              aria-label="Close modal"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Input */}
          <label
            htmlFor="ai-course-title"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
          >
            Course Title
          </label>
          <input
            ref={inputRef}
            id="ai-course-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "Learn React Native", "DSA with Python"'
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50 disabled:opacity-70"
          />

          {/* Loading Animation */}
          {loading && (
            <div className="mt-5 flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-purple-500"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-purple-500"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-purple-500"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <p className="text-sm font-medium text-purple-600">
                Generating your course outline…
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="mt-3 break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Example Chips */}
          {!loading && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-400">
                Try an example:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !title.trim()}
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating…" : "🤖 Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
