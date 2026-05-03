import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiClipboard } from 'react-icons/fi';

const font = { syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif" };

const revealClass =
  'lp-reveal opacity-0 translate-y-7 transition-[opacity,transform] duration-700 ease-out';

const Badge = ({ children, className = '' }) => (
  <span
    className={`inline-block rounded-full bg-[#e8f0fe] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a56db] ${className}`}
  >
    {children}
  </span>
);

const Pill = ({ label, color = '#22c55e', bg = '#dcfce7' }) => (
  <span
    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
    style={{ color, background: bg }}
  >
    {label}
  </span>
);

const ProgressBar = ({ pct, color = '#2dd4bf' }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
    <div
      className="h-full rounded-full transition-[width] duration-1000 ease-out"
      style={{ width: `${pct}%`, background: color }}
    />
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goDashboard = () => navigate('/dashboard');
  const navLinks = ['Courses', 'Daily Goals', 'Analytics'];

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-white text-[#0a1f44]"
      style={{ fontFamily: font.dm }}
    >
      <nav className="sticky top-0 z-[200] border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-end h-16 px-4 mx-auto max-w-7xl sm:px-6 md:justify-between lg:px-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hidden shrink-0 border-0 bg-transparent p-0 text-left text-lg font-extrabold tracking-[0.04em] text-[#0a1f44] md:block"
            style={{ fontFamily: font.syne }}
          >
            Trackify
          </button>

          <div className="items-center hidden gap-8 md:flex">
            {navLinks.map(link => (
              <button
                key={link}
                type="button"
                onClick={goDashboard}
                className="border-0 bg-transparent p-0 text-sm font-medium text-slate-500 transition-colors hover:text-[#0a1f44]"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#0a1f44] md:border-0 md:bg-transparent md:px-2 md:font-medium md:text-slate-500"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-lg border-0 bg-[#0a1f44] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a6b]"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[1180px] px-4 pb-12 pt-9 sm:px-6 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className={revealClass}>
            <Badge className="mb-5">Redefining Productivity</Badge>

            <h1
              className="my-4 text-[2.35rem] font-extrabold leading-[1.08] text-[#0a1f44] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: font.syne }}
            >
              Master Your Daily
              <br className="hidden sm:block" />
              Routine &amp; Excel in
              <br className="hidden sm:block" />
              Your Courses.
            </h1>

            <p className="mb-8 max-w-[440px] text-[0.95rem] leading-7 text-slate-500 sm:text-base">
              A premium editorial space for the modern academic. Seamlessly
              weave your complex syllabi with daily habits in an architecture
              designed for deep focus.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                id="hero-cta-btn"
                type="button"
                onClick={() => navigate('/register')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-[#0a1f44] px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(10,31,68,0.25)] transition hover:scale-[0.98] hover:shadow-[0_2px_10px_rgba(10,31,68,0.2)] sm:w-auto"
              >
                Get Started for Free
                <span className="text-base" aria-hidden="true">
                  -&gt;
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-0 bg-transparent px-2 py-2 text-sm font-medium text-[#0a1f44] underline underline-offset-4"
              >
                View Features
              </button>
            </div>
          </div>

          <div
            className={`${revealClass} relative mx-auto hidden w-full max-w-[460px] [transition-delay:150ms] lg:block`}
          >
            <div className="relative overflow-hidden rounded-[20px] shadow-[0_24px_64px_rgba(10,31,68,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Student studying"
                className="block h-72 w-full object-cover sm:h-[340px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f44]/45 to-transparent" />
            </div>

            <div className="absolute -bottom-5 left-3 right-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_8px_32px_rgba(10,31,68,0.15)] backdrop-blur-md sm:left-5 sm:right-5 sm:px-5">
              <div className="mb-2 flex flex-col gap-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#0a1f44]">
                  Advanced Calculus
                </span>
                <span className="text-[11px] font-semibold text-green-500">64% Completed</span>
              </div>
              <ProgressBar pct={64} color="#22c55e" />
            </div>
          </div>
        </div>
      </section>

      <section id="features-section" className="bg-[#f7f9fc] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1060px]">
          <div className={`${revealClass} mx-auto mb-10 max-w-[520px] text-center sm:mb-12`}>
            <h2
              className="mb-3 text-2xl font-bold text-[#0a1f44] sm:text-3xl"
              style={{ fontFamily: font.syne }}
            >
              Architected for Dual Focus
            </h2>
            <p className="text-sm leading-7 text-slate-500 sm:text-[0.95rem]">
              We don't just track tasks; we nurse your intellectual growth. Switch between high-level
              academic tracking and granular daily execution.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            <div className={`${revealClass} rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(10,31,68,0.06)] [transition-delay:50ms] sm:p-7`}>
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#e8f0fe] text-[#1a56db]">
                <FiClipboard aria-hidden="true" size={18} />
              </div>

              <h3
                className="mb-2 text-base font-bold text-[#0a1f44]"
                style={{ fontFamily: font.syne }}
              >
                Intuitive Task Orchestration
              </h3>
              <p className="mb-5 text-[0.82rem] leading-6 text-slate-500">
                Organise your life with surface-on-surface cards. No clutter, just the essential actions you need to move forward today.
              </p>

              {[
                { text: 'Research Paper Outline', tag: 'Academic', tagColor: '#1a56db', tagBg: '#e8f0fe', done: false },
                { text: 'Review Goals & Progress Notes', tag: 'Completed', tagColor: '#15803d', tagBg: '#dcfce7', done: true },
              ].map(t => (
                <div
                  key={t.text}
                  className={`mb-2 flex flex-col gap-2 rounded-lg border px-3 py-2 min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between ${
                    t.done ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-[#f7f9fc]'
                  }`}
                >
                  <div className="flex items-center min-w-0 gap-2">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        t.done ? 'border-green-500 bg-green-500' : 'border-slate-400 bg-transparent'
                      }`}
                    >
                      {t.done && <span className="text-[9px] font-extrabold text-white">&#10003;</span>}
                    </div>
                    <span
                      className={`min-w-0 break-words text-[0.8rem] font-medium ${
                        t.done ? 'text-slate-500 line-through' : 'text-[#0a1f44]'
                      }`}
                    >
                      {t.text}
                    </span>
                  </div>
                  <Pill label={t.tag} color={t.tagColor} bg={t.tagBg} />
                </div>
              ))}
            </div>

            <div className={`${revealClass} relative hidden min-h-[230px] flex-col justify-end overflow-hidden rounded-[18px] bg-[#0a1f44] p-6 [transition-delay:100ms] sm:min-h-[260px] sm:p-7 md:flex`}>
              <div
                className="absolute font-extrabold leading-none right-6 top-5 text-7xl text-white/15 sm:right-7 sm:text-8xl"
                style={{ fontFamily: font.syne }}
              >
                12
              </div>
              <div className="relative">
                <p
                  className="mb-2 text-lg font-bold text-white"
                  style={{ fontFamily: font.syne }}
                >
                  Tasks Remaining
                </p>
                <p className="max-w-sm text-[0.82rem] leading-6 text-white/60">
                  Focus on the next task to maintain your current streak.
                </p>
              </div>
            </div>

            <div className={`${revealClass} rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(10,31,68,0.06)] [transition-delay:150ms] sm:p-7`}>
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-yellow-100 text-yellow-700">
                <FiBookOpen aria-hidden="true" size={18} />
              </div>

              <h3
                className="mb-2 text-base font-bold text-[#0a1f44]"
                style={{ fontFamily: font.syne }}
              >
                Syllabus Overview
              </h3>
              <p className="mb-5 text-[0.82rem] leading-6 text-slate-500">
                Track all your active goals and module tasks with task-based streaks running.
              </p>

              {[
                { subject: 'Advanced Calculus', pct: 78, color: '#2dd4bf' },
                { subject: 'Art History', pct: 45, color: '#a78bfa' },
              ].map(s => (
                <div key={s.subject} className="mb-4 last:mb-0">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words text-[0.8rem] font-semibold text-[#0a1f44]">{s.subject}</span>
                    <span className="shrink-0 text-[0.8rem] text-slate-500">{s.pct}%</span>
                  </div>
                  <ProgressBar pct={s.pct} color={s.color} />
                </div>
              ))}
            </div>

            <div className={`${revealClass} relative hidden min-h-[230px] overflow-hidden rounded-[18px] [transition-delay:200ms] sm:min-h-[260px] md:block`}>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=70"
                alt="Analytics"
                className="absolute inset-0 block object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-[#0a1f44]/75" />
              <div className="relative z-10 flex h-full min-h-[230px] flex-col justify-end p-6 sm:min-h-[260px] sm:p-7">
                <h3
                  className="mb-2 text-lg font-bold text-white"
                  style={{ fontFamily: font.syne }}
                >
                  Visual Analytics
                </h3>
                <p className="max-w-sm text-[0.82rem] leading-6 text-white/65">
                  Transform your study facts into bite-size data-points.
                  See where all active goals and courses are right now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 bg-white py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1060px] items-center gap-10 md:grid-cols-[auto_1fr] md:gap-14 lg:gap-16">
          <div className={`${revealClass} hidden justify-center md:flex md:justify-start`}>
            <div className="h-48 w-16 rounded-full bg-gradient-to-t from-green-500 via-green-300 to-green-100 shadow-[0_12px_40px_rgba(34,197,94,0.35)] sm:h-64 sm:w-20" />
          </div>

          <div className={`${revealClass} text-center [transition-delay:100ms] md:text-left`}>
            <Badge className="mb-4">Growth Metric</Badge>
            <h2
              className="mb-4 text-3xl font-extrabold leading-tight text-[#0a1f44] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: font.syne }}
            >
              Your Academic Vertical
            </h2>
            <p className="mx-auto mb-8 max-w-[460px] text-[0.9rem] leading-7 text-slate-500 md:mx-0">
              The Focus Pillar represents your cumulative study depth. As you
              complete daily goals and module tasks, your vertical climbs. It's
              more than progress - it's momentum.
            </p>

            <div className="grid grid-cols-2 gap-6 sm:flex sm:gap-12">
              {[
                { value: '248', label: 'HOURS FOCUSED' },
                { value: '+12%', label: 'WEEKLY GROWTH' },
              ].map(s => (
                <div key={s.label}>
                  <div
                    className="text-3xl font-extrabold text-[#0a1f44]"
                    style={{ fontFamily: font.syne }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-[0.72rem] font-bold tracking-[0.1em] text-slate-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a1f44] px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className={revealClass}>
          <h2
            className="mx-auto mb-4 max-w-[560px] text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: font.syne }}
          >
            Ready to transform your academic landscape?
          </h2>
          <p className="mx-auto mb-9 max-w-[620px] text-sm leading-6 text-white/65 sm:text-[0.95rem]">
            Join 50,000+ students and professionals who have found their focus architecture.
          </p>
          <button
            id="cta-register-btn"
            type="button"
            onClick={() => navigate('/register')}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-[10px] border-0 bg-gradient-to-br from-[#2dd4bf] to-[#0891b2] px-6 py-3.5 text-base font-bold text-white shadow-[0_6px_24px_rgba(45,212,191,0.35)] transition hover:scale-[0.98] sm:w-auto"
            style={{ fontFamily: font.syne }}
          >
            Get Started for Free
          </button>
        </div>
      </section>

      <footer className="px-4 py-6 bg-white border-t border-slate-200 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 mx-auto text-center max-w-7xl sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <span
              className="text-base font-extrabold text-[#0a1f44]"
              style={{ fontFamily: font.syne }}
            >
              Scholarly
            </span>
            <div className="mt-1 text-xs text-slate-500">
              &copy; 2024 The Focused Editorial. All rights reserved.
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:justify-end">
            {['Privacy Policy', 'Terms of Service', 'Contact support', 'Journal'].map(link => (
              <button
                key={link}
                type="button"
                className="border-0 bg-transparent p-0 text-[0.78rem] text-slate-500 transition-colors hover:text-[#0a1f44]"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
