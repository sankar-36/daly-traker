import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/api";
import { StreakHeatmap } from "./Profile";

const getStrokeDashOffset = (percentage) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  return circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;
};

const groupIntoWeeks = (days) => {
  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
};

const streakColorValue = {
  none: 0,
  light: 1,
  low: 2,
  medium: 2,
  good: 3,
  great: 4,
  perfect: 4,
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const courseProgress  = Number(dashboard?.courseProgress  || 0);
  const weeklyLongevity = Number(dashboard?.weeklyLongevity || 0);
  const tasksRemaining  = Number(dashboard?.tasksRemaining  || 0);
  const activeCourses   = Number(dashboard?.activeCourses   || 0);
  const streakDays      = Array.isArray(dashboard?.streak) ? dashboard.streak : [];

  const weeks = useMemo(() => groupIntoWeeks(streakDays), [streakDays]);

  const monthLabels = useMemo(() => {
    const labels     = [];
    const seenMonths = new Set();
    weeks.forEach((week) => {
      const month = week[0]?.month;
      if (month && !seenMonths.has(month)) {
        labels.push({ month });
        seenMonths.add(month);
      }
    });
    return labels;
  }, [weeks]);

  const heatmapGrid   = useMemo(
    () => weeks.map((week) => week.map((day) => streakColorValue[day.color] ?? 0)),
    [weeks]
  );
  const heatmapMonths = monthLabels.map((l) => l.month.toUpperCase());

  return (
    <div className="min-h-full w-full bg-[#f6f4fb] px-3 py-4 font-sans text-slate-900 sm:px-6 md:px-8 lg:px-10 xl:px-14">
      <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8">

        {error && (
          <div className="px-4 py-3 text-sm font-semibold text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {/* ── Top Cards ── */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[214px_1fr] w-full max-w-full lg:max-w-[760px]">

          {/* Course Progress Card */}
          <section className="rounded-2xl bg-white px-4 py-7 sm:px-6 sm:py-9 text-center shadow-[0_18px_34px_rgba(15,23,42,0.16)]">
            <div className="grid w-24 h-24 mx-auto mb-5 sm:mb-7 sm:h-28 sm:w-28 place-items-center">
              <div className="relative w-24 h-24 sm:h-28 sm:w-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#e9edf6" strokeWidth="9" />
                  <circle
                    cx="50" cy="50" r="38"
                    fill="none"
                    stroke="#0b4a9e"
                    strokeLinecap="round"
                    strokeWidth="9"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={getStrokeDashOffset(courseProgress)}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold leading-none text-[#0b4a9e] pl-[30px] sm:pl-[35px]">
                      {loading ? "--" : courseProgress}%
                    </p>
                    <p className="mt-1 pl-[30px] sm:pl-[35px] text-[7px] sm:text-[8px] font-extrabold uppercase text-[#0b4a9e]">
                      Complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-base font-extrabold sm:text-lg text-slate-700">Course Progress</h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-slate-600">
              {loading ? "--" : activeCourses} Active Course{activeCourses === 1 ? "" : "s"}
            </p>
            <Link
              to="/courses"
              className="mt-4 sm:mt-6 block rounded-md bg-[#074799] px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white no-underline shadow-sm transition hover:bg-[#063f89]"
            >
              Continue Learning
            </Link>
          </section>

          {/* Tasks Remaining Card */}
          <section className="rounded-2xl bg-[#f1f0f8] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_18px_34px_rgba(15,23,42,0.13)]">
            <div className="flex items-start justify-between gap-3 mb-8 sm:gap-5 sm:mb-12 lg:mb-16">
              <div className="flex items-start gap-2">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-none text-[#074799]">
                  {loading ? "--" : tasksRemaining}
                </p>
                <p className="pt-2 text-xs font-extrabold tracking-wide uppercase sm:pt-3 sm:text-sm text-slate-500">
                  Tasks<br className="hidden xs:block" /> Remaining
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold leading-none sm:text-3xl text-emerald-600">
                  {loading ? "--" : weeklyLongevity}%
                </p>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  Weekly<br className="hidden xs:block" /> Longevity
                </p>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-5 max-w-full sm:max-w-[330px]">
              <div className="flex-1 overflow-hidden rounded-md h-9 bg-slate-200">
                <div
                  className="grid h-full place-items-end rounded-md bg-[#074799] pr-2 text-white transition-all duration-700"
                  style={{ width: `${Math.min(Math.max(weeklyLongevity, 0), 100)}%` }}
                >
                  <span className="text-sm leading-none">+</span>
                </div>
              </div>

              <Link
                to="/tasks"
                className="shrink-0 rounded-md bg-[#074799] px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white no-underline shadow-md transition hover:bg-[#063f89] text-center"
              >
                Finish Now
              </Link>
            </div>
          </section>
        </div>

        {/* ── Streak Heatmap Section ── */}
        <section className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#f1f0f8] px-3 py-6 sm:px-6 sm:py-8 lg:px-10 shadow-sm">

          {/* Title + Legend */}
          <div className="mx-auto mb-4 sm:mb-6 flex w-full max-w-full sm:max-w-[520px] items-center justify-between gap-2 flex-wrap">
            <h2 className="text-sm font-extrabold sm:text-base text-slate-700">
              Intellectual Activity Streak
            </h2>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400">Less</span>
              {[
                "bg-slate-200",
                "bg-emerald-200",
                "bg-emerald-400",
                "bg-emerald-600",
                "bg-emerald-800",
              ].map((c, i) => (
                <span key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400">More</span>
            </div>
          </div>

          {/* Heatmap */}
          <div className="mx-auto w-full max-w-full sm:max-w-[520px] overflow-x-auto">
            <div className="min-w-max rounded-xl bg-[#f1f0f8] p-1">
              <StreakHeatmap
                grid={heatmapGrid}
                months={heatmapMonths}
                showWeekdays
                cellClassName="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px] lg:h-[18px] lg:w-[18px] leading-[18px] pb-[16px] sm:pb-[18px] lg:pb-[20px]"
                gapClassName="gap-1 sm:gap-1.5 lg:gap-2"
                monthClassName="text-[10px] sm:text-xs pl-[50px] sm:pl-[60px] lg:pl-[65px] font-extrabold uppercase tracking-wide text-slate-400"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}