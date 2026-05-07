import { useEffect, useState } from "react";
import { getProfileStreak, getTodayStreak } from "../api/api";

// ── Streak Heatmap ─────────────────────────────────────
const heatColors = [
  "bg-slate-200",
  "bg-emerald-400",
  "bg-emerald-500",
  "bg-emerald-700",
  "bg-emerald-900",
];

export function StreakHeatmap({
  grid = [],
  months: monthLabels = [],
  showWeekdays = false,
  cellClassName = "w-2.5 h-2.5",
  gapClassName = "gap-0.5",
  monthClassName = "text-[9px] pl-[23px] text-gray-400 font-medium",
}) {
  return (
    <div className="w-full">
      {/* Month Labels */}
      <div className={`grid ${showWeekdays ? "grid-cols-[32px_1fr]" : ""}`}>
        {showWeekdays && <div />}
        <div className="flex justify-between mb-1 px-0.5">
          {monthLabels.map((m) => (
            <span key={m} className={monthClassName}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={`grid ${showWeekdays ? "grid-cols-[32px_1fr]" : ""}`}>
        {showWeekdays && (
          <div className={`flex flex-col ${gapClassName} pr-2 text-right text-[8px] font-bold uppercase tracking-wide text-gray-400`}>
            {["MON", "", "WED", "", "FRI", "", ""].map((day, index) => (
              <span key={`${day}-${index}`} className={cellClassName}>
                {day}
              </span>
            ))}
          </div>
        )}

        <div className={`flex ${gapClassName}`}>
          {grid.map((week, wi) => (
            <div key={wi} className={`flex flex-col ${gapClassName}`}>
              {week.map((val, di) => (
                <div
                  key={di}
                  className={`${cellClassName} rounded-sm ${
                    heatColors[Number(val)] ?? heatColors[0]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Input Field ────────────────────────────────────────
function InfoField({ label, value, onChange, editing, type = "text", half }) {
  return (
    <div className={half ? "flex-1 min-w-0" : "w-full"}>
      <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pb-1 bg-transparent border-b border-blue-400 pl pltext-sm pltransition te xt-gray-900 plfont-medium focus:outline-none"
        />
      ) : (
        <p className="pb-1 text-sm font-medium text-gray-900 border-b border-gray-100">
          {value}
        </p>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState({ grid: [], months: [] });
  const [streakLoading, setStreakLoading] = useState(true);
  const [streakError, setStreakError] = useState("");

  // Today's live streak color returned by streakController
  const [todayStreakColor, setTodayStreakColor] = useState(null);
  const [todayStreakValue, setTodayStreakValue] = useState(null);
  const [todayStreakLoading, setTodayStreakLoading] = useState(true);

  const [form, setForm] = useState({
    name: "Alex Johnson",
    email: "alex.j@scholar-institute.edu",
    phone: "+1 (555) 012-3456",
    institution: "The Scholar Institute",
    bio: "Dedicated scholar specializing in Computational Linguistics and Deep Learning. Consistently reaching a 98% focus accuracy rate.",
    level: "MASTER FELLOW (LVL. 42)",
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  useEffect(() => {
    // ── Heatmap streak (historical) ──────────────────────────────────────
    const loadStreak = async () => {
      try {
        setStreakLoading(true);
        setStreakError("");
        const response = await getProfileStreak();
        setStreak({
          grid: Array.isArray(response.data?.grid) ? response.data.grid : [],
          months: Array.isArray(response.data?.months) ? response.data.months : [],
        });
      } catch (e) {
        setStreakError(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            "Unable to load streak data."
        );
      } finally {
        setStreakLoading(false);
      }
    };

    // ── Today's live streak color ─────────────────────────────────────────
    const loadTodayStreak = async () => {
      try {
        setTodayStreakLoading(true);
        const res = await getTodayStreak();
        setTodayStreakColor(res.data?.streakColor ?? null);
        setTodayStreakValue(res.data?.streakValue ?? null);
      } catch {
        // silently ignore — the badge simply won't appear
      } finally {
        setTodayStreakLoading(false);
      }
    };

    loadStreak();
    loadTodayStreak();
  }, []);

  return (
    <div className="w-full min-h-screen px-4 py-8 font-sans bg-slate-50 sm:px-6 lg:px-10">
      <div className="w-full max-w-3xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
            Account Overview
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your Profile
          </h1>
          <div className="mt-2 w-10 h-0.5 bg-teal-500 rounded-full" />
        </div>

        {/* ── Main Grid ── */}
        <div className="flex flex-col items-start gap-5 lg:flex-row">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col flex-shrink-0 w-full gap-4 lg:w-56">

            {/* Profile Card */}
            <div className="flex flex-col items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">

              {/* Avatar + Heatmap */}
              <div className="relative w-full">
                <div className="w-full p-3 overflow-hidden bg-gray-900 rounded-xl">
                  {streakLoading ? (
                    <div className="py-7 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Loading streak
                    </div>
                  ) : streakError ? (
                    <div className="py-7 text-center text-[10px] font-bold text-red-300">
                      {streakError}
                    </div>
                  ) : (
                    <StreakHeatmap grid={streak.grid} months={streak.months} />
                  )}
                </div>

                {/* Edit Avatar Button */}
                <button className="absolute flex items-center justify-center transition bg-blue-600 rounded-full shadow-md bottom-2 right-2 w-7 h-7 hover:bg-blue-700">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1 1-4.5L16.862 3.487z" />
                  </svg>
                </button>
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="text-base font-bold text-gray-900">{form.name}</p>
                <span className="inline-block mt-1.5 text-[10px] font-bold tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                  {form.level}
                </span>
              
                {/* ── Today's Streak Color Badge ── */}
                {!todayStreakLoading && todayStreakColor && (
                  <div className="flex flex-col items-center gap-1 mt-3">
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                      Today&apos;s Streak
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        id="today-streak-color-swatch"
                        title={`Streak color: ${todayStreakColor}`}
                        style={{ backgroundColor: todayStreakColor }}
                        className="inline-block w-5 h-5 border border-white rounded-full shadow-md"
                      />
                      <span
                        id="today-streak-value"
                        style={{ color: todayStreakColor }}
                        className="text-xs font-bold"
                      >
                        {todayStreakValue}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs leading-relaxed text-center text-gray-400">
                {form.bio}
              </p>
            </div>

            {/* Account Security Card */}
            <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">🔒</span>
                <p className="text-sm font-bold text-gray-900">Account Security</p>
              </div>

              <button className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition group">
                <span className="text-sm font-medium text-gray-600">Change Password</span>
                <svg className="w-4 h-4 text-gray-400 transition group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col flex-1 w-full gap-4">

            {/* Personal Details Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-base font-bold text-gray-900">Personal Details</p>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-[11px] font-bold tracking-widest text-blue-600 hover:text-blue-800 uppercase transition"
                >
                  {editing ? "CANCEL" : "EDIT INFO"}
                </button>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-5">
                <InfoField
                  label="Full Name"
                  value={form.name}
                  onChange={set("name")}
                  editing={editing}
                />
                <InfoField
                  label="Email Address"
                  value={form.email}
                  onChange={set("email")}
                  editing={editing}
                  type="email"
                />
                <div className="flex gap-4">
                  <InfoField
                    label="Phone Number"
                    value={form.phone}
                    onChange={set("phone")}
                    editing={editing}
                    type="tel"
                    half
                  />
                  <InfoField
                    label="Institution"
                    value={form.institution}
                    onChange={set("institution")}
                    editing={editing}
                    half
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`w-full sm:w-auto sm:self-end px-10 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-200 shadow-sm ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-blue-900 hover:bg-blue-800 text-white"
              }`}
            >
              {saved ? "✓ Saved!" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
