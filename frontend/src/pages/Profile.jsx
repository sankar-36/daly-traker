import { useState } from "react";

// ── Streak Heatmap ─────────────────────────────────────
const generateHeatmap = () => {
  const weeks = 18;
  const days = 7;
  return Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => Math.floor(Math.random() * 5))
  );
};

const heatColors = [
  "bg-gray-800",
  "bg-emerald-900",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-400",
];

const months = ["May", "Jun", "Jul", "Aug"];

function StreakHeatmap() {
  const grid = generateHeatmap();
  return (
    <div className="w-full">
      {/* Month Labels */}
      <div className="flex justify-between mb-1 px-0.5">
        {months.map((m) => (
          <span key={m} className="text-[9px] text-gray-400 font-medium">
            {m}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-0.5">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((val, di) => (
              <div
                key={di}
                className={`w-2.5 h-2.5 rounded-sm ${heatColors[val]}`}
              />
            ))}
          </div>
        ))}
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
          className="w-full pb-1 text-sm font-medium text-gray-900 transition bg-transparent border-b border-blue-400 focus:outline-none"
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
                  <StreakHeatmap />
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