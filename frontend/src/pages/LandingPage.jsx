import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────── design tokens ─────────────── */
const C = {
  navy:    '#0a1f44',
  navyMid: '#1a3a6b',
  teal:    '#2dd4bf',
  tealDk:  '#0891b2',
  white:   '#ffffff',
  offWhite:'#f7f9fc',
  gray:    '#64748b',
  grayLt:  '#e2e8f0',
  green:   '#22c55e',
  badge:   '#e8f0fe',
  badgeTxt:'#1a56db',
};

const font = { syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif" };

/* ─────────────── tiny helpers ─────────────── */
const Badge = ({ children, style }) => (
  <span style={{
    display:'inline-block', padding:'4px 12px',
    borderRadius:99, background:C.badge, color:C.badgeTxt,
    fontSize:10, fontWeight:700, letterSpacing:'0.12em',
    textTransform:'uppercase', fontFamily:font.dm, ...style,
  }}>
    {children}
  </span>
);

const Pill = ({ label, color='#22c55e', bg='#dcfce7' }) => (
  <span style={{
    padding:'2px 10px', borderRadius:99,
    background:bg, color,
    fontSize:10, fontWeight:700, fontFamily:font.dm,
  }}>
    {label}
  </span>
);

const ProgressBar = ({ pct, color=C.teal }) => (
  <div style={{ width:'100%', height:6, borderRadius:99, background:C.grayLt, overflow:'hidden' }}>
    <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:color,
      transition:'width 1.2s ease' }} />
  </div>
);

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // simple scroll-fade-in via IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const revealStyle = {
    opacity: 0,
    transform: 'translateY(28px)',
    transition: 'opacity 0.65s ease, transform 0.65s ease',
  };

  return (
    <div style={{ fontFamily:font.dm, color:C.navy, background:C.white, overflowX:'hidden' }}>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position:'sticky', top:0, zIndex:200,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 40px', height:58,
        background:'rgba(255,255,255,0.92)',
        backdropFilter:'blur(12px)',
        borderBottom:`1px solid ${C.grayLt}`,
      }}>
        {/* Logo */}
        <span style={{ fontFamily:font.syne, fontWeight:800, fontSize:'1.1rem', color:C.navy, letterSpacing:'0.04em' }}>
         Trackify
        </span>

        {/* Nav Links — desktop */}
        <div style={{ display:'flex', gap:32, alignItems:'center' }}>
          {['Courses','Daily Goals','Analytics'].map(l => (
            <button key={l} onClick={() => navigate('/dashboard')} style={{
              background:'none', border:'none', cursor:'pointer',
              fontFamily:font.dm, fontSize:'0.875rem', fontWeight:500, color:C.gray,
              padding:0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.navy}
            onMouseLeave={e => e.currentTarget.style.color = C.gray}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button onClick={() => navigate('/login')} style={{
            background:'none', border:'none', cursor:'pointer',
            fontFamily:font.dm, fontSize:'0.875rem', fontWeight:500, color:C.gray,
          }}>
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{
            padding:'8px 18px', borderRadius:8,
            background:C.navy, color:C.white,
            border:'none', cursor:'pointer',
            fontFamily:font.dm, fontSize:'0.875rem', fontWeight:600,
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.navyMid}
          onMouseLeave={e => e.currentTarget.style.background = C.navy}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ padding:'60px 80px 80px', maxWidth:1180, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:60, alignItems:'center' }}>

          {/* Left */}
          <div style={{ flex:'1 1 52%' }} className="lp-reveal" style={revealStyle}>
            <Badge style={{ marginBottom:20 }}>Redefining Productivity</Badge>

            <h1 style={{
              fontFamily:font.syne, fontWeight:800,
              fontSize:'clamp(2rem,4vw,3rem)',
              lineHeight:1.12, color:C.navy,
              margin:'16px 0 20px', letterSpacing:'-0.01em',
            }}>
              Master Your Daily<br />
              Routine &amp; Excel in<br />
              Your Courses.
            </h1>

            <p style={{ fontSize:'0.95rem', lineHeight:1.7, color:C.gray, maxWidth:420, marginBottom:32 }}>
              A premium editorial space for the modern academic. Seamlessly
              weave your complex syllabi with daily habits in an architecture
              designed for deep focus.
            </p>

            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
              <button
                id="hero-cta-btn"
                onClick={() => navigate('/register')}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'11px 22px', borderRadius:8,
                  background:C.navy, color:C.white,
                  border:'none', cursor:'pointer',
                  fontFamily:font.dm, fontSize:'0.875rem', fontWeight:600,
                  boxShadow:'0 4px 18px rgba(10,31,68,0.25)',
                  transition:'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(0.97)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(10,31,68,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 4px 18px rgba(10,31,68,0.25)'; }}
              >
                Get Started for Free
                <span style={{ fontSize:16 }}>→</span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('features-section')
                    ?.scrollIntoView({ behavior:'smooth' });
                }}
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontFamily:font.dm, fontSize:'0.875rem', fontWeight:500, color:C.navy,
                  textDecoration:'underline', textUnderlineOffset:3,
                }}
              >
                View Features
              </button>
            </div>
          </div>

          {/* Right — photo card */}
          <div style={{ flex:'1 1 44%', position:'relative', maxWidth:420 }} className="lp-reveal" style={{ ...revealStyle, transitionDelay:'0.15s' }}>
            <div style={{
              borderRadius:20, overflow:'hidden',
              boxShadow:'0 24px 64px rgba(10,31,68,0.18)',
              position:'relative',
            }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Student studying"
                style={{ width:'100%', height:340, objectFit:'cover', display:'block' }}
              />
              {/* Dark gradient */}
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(to top, rgba(10,31,68,0.45) 0%, transparent 55%)',
              }} />
            </div>

            {/* Floating progress card */}
            <div style={{
              position:'absolute', bottom:-18, left:20, right:20,
              background:'rgba(255,255,255,0.96)',
              backdropFilter:'blur(10px)',
              borderRadius:14, padding:'14px 18px',
              boxShadow:'0 8px 32px rgba(10,31,68,0.15)',
              border:`1px solid ${C.grayLt}`,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:C.navy, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  Advanced Calculus
                </span>
                <span style={{ fontSize:11, fontWeight:600, color:C.green }}>64% Completed</span>
              </div>
              <ProgressBar pct={64} color={C.green} />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════ FEATURES SECTION ══════════════ */}
      <section id="features-section" style={{ padding:'80px 80px 60px', background:C.offWhite }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>

          {/* Header */}
          <div className="lp-reveal" style={{ ...revealStyle, textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:font.syne, fontWeight:700, fontSize:'1.75rem', color:C.navy, marginBottom:12 }}>
              Architected for Dual Focus
            </h2>
            <p style={{ fontSize:'0.9rem', color:C.gray, maxWidth:460, margin:'0 auto', lineHeight:1.65 }}>
              We don't just track tasks; we nurse your intellectual growth. Switch between high-level
              academic tracking and granular daily execution.
            </p>
          </div>

          {/* 2×2 Feature Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>

            {/* Card 1 — Task Orchestration (light) */}
            <div className="lp-reveal" style={{
              ...revealStyle, transitionDelay:'0.05s',
              background:C.white, borderRadius:18, padding:'28px 28px 24px',
              border:`1px solid ${C.grayLt}`,
              boxShadow:'0 2px 12px rgba(10,31,68,0.06)',
            }}>
              {/* Icon */}
              <div style={{
                width:36, height:36, borderRadius:10,
                background:'#e8f0fe', display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:16, fontSize:18,
              }}>📋</div>

              <h3 style={{ fontFamily:font.syne, fontWeight:700, fontSize:'1rem', color:C.navy, marginBottom:8 }}>
                Intuitive Task Orchestration
              </h3>
              <p style={{ fontSize:'0.82rem', color:C.gray, lineHeight:1.65, marginBottom:20 }}>
                Organise your life with surface-on-surface cards. No clutter, just the essential actions you need to move forward today.
              </p>

              {/* Task items */}
              {[
                { text:'Research Paper Outline', tag:'Academic',   tagColor:'#1a56db', tagBg:'#e8f0fe', done:false },
                { text:'Review Goals & Progress Notes', tag:'Completed', tagColor:'#15803d', tagBg:'#dcfce7', done:true  },
              ].map(t => (
                <div key={t.text} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'9px 12px', borderRadius:9,
                  background: t.done ? '#f0fdf4' : C.offWhite,
                  marginBottom:8, border:`1px solid ${t.done ? '#bbf7d0' : C.grayLt}`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{
                      width:16, height:16, borderRadius:'50%',
                      border:`2px solid ${t.done ? C.green : '#94a3b8'}`,
                      background: t.done ? C.green : 'transparent',
                      flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {t.done && <span style={{ color:'#fff', fontSize:9, fontWeight:800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:'0.8rem', color: t.done ? C.gray : C.navy, fontWeight:500,
                      textDecoration: t.done ? 'line-through' : 'none' }}>
                      {t.text}
                    </span>
                  </div>
                  <Pill label={t.tag} color={t.tagColor} bg={t.tagBg} />
                </div>
              ))}
            </div>

            {/* Card 2 — Tasks Remaining (dark) */}
            <div className="lp-reveal" style={{
              ...revealStyle, transitionDelay:'0.1s',
              background:C.navy, borderRadius:18, padding:'28px',
              display:'flex', flexDirection:'column', justifyContent:'flex-end',
              minHeight:260,
              position:'relative', overflow:'hidden',
            }}>
              {/* Big number */}
              <div style={{
                position:'absolute', top:24, right:28,
                fontFamily:font.syne, fontWeight:800,
                fontSize:'5rem', color:'rgba(255,255,255,0.15)',
                lineHeight:1,
              }}>
                12
              </div>
              <div style={{ marginTop:'auto' }}>
                <p style={{ fontFamily:font.syne, fontWeight:700, fontSize:'1.15rem', color:C.white, marginBottom:8 }}>
                  Tasks Remaining
                </p>
                <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>
                  Focus on the next task to maintain your current streak.
                </p>
              </div>
            </div>

            {/* Card 3 — Syllabus Overview (light) */}
            <div className="lp-reveal" style={{
              ...revealStyle, transitionDelay:'0.15s',
              background:C.white, borderRadius:18, padding:'28px',
              border:`1px solid ${C.grayLt}`,
              boxShadow:'0 2px 12px rgba(10,31,68,0.06)',
            }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:16, fontSize:18,
              }}>📚</div>

              <h3 style={{ fontFamily:font.syne, fontWeight:700, fontSize:'1rem', color:C.navy, marginBottom:8 }}>
                Syllabus Overview
              </h3>
              <p style={{ fontSize:'0.82rem', color:C.gray, lineHeight:1.65, marginBottom:20 }}>
                Track all your active goals and module tasks with task-based streaks running.
              </p>

              {/* Progress rows */}
              {[
                { subject:'Advanced Calculus', pct:78, color:C.teal    },
                { subject:'Art History',       pct:45, color:'#a78bfa' },
              ].map(s => (
                <div key={s.subject} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:'0.8rem', fontWeight:600, color:C.navy }}>{s.subject}</span>
                    <span style={{ fontSize:'0.8rem', color:C.gray }}>{s.pct}%</span>
                  </div>
                  <ProgressBar pct={s.pct} color={s.color} />
                </div>
              ))}
            </div>

            {/* Card 4 — Visual Analytics (dark overlay) */}
            <div className="lp-reveal" style={{
              ...revealStyle, transitionDelay:'0.2s',
              borderRadius:18, overflow:'hidden',
              position:'relative', minHeight:220,
            }}>
              {/* Background chart image */}
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=70"
                alt="Analytics"
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', position:'absolute', inset:0 }}
              />
              <div style={{
                position:'absolute', inset:0,
                background:'rgba(10,31,68,0.72)',
              }} />
              <div style={{ position:'relative', zIndex:2, padding:28, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <h3 style={{ fontFamily:font.syne, fontWeight:700, fontSize:'1.1rem', color:C.white, marginBottom:8 }}>
                  Visual Analytics
                </h3>
                <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.6)', lineHeight:1.65 }}>
                  Transform your study facts into bite-size data-points.
                  See where all active goals and courses are right now.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ GROWTH METRIC SECTION ══════════════ */}
      <section style={{ padding:'80px', background:C.white }}>
        <div style={{
          maxWidth:1060, margin:'0 auto',
          display:'flex', gap:64, alignItems:'center',
        }}>

          {/* Left — Vertical bar graphic */}
          <div className="lp-reveal" style={{ ...revealStyle, flexShrink:0 }}>
            <div style={{
              width:80, height:260,
              borderRadius:40,
              background:'linear-gradient(to top, #22c55e, #86efac, #dcfce7)',
              boxShadow:'0 12px 40px rgba(34,197,94,0.35)',
            }} />
          </div>

          {/* Right — Text */}
          <div className="lp-reveal" style={{ ...revealStyle, transitionDelay:'0.1s' }}>
            <Badge style={{ marginBottom:16 }}>Growth Metric</Badge>
            <h2 style={{
              fontFamily:font.syne, fontWeight:800,
              fontSize:'clamp(1.6rem,3vw,2.4rem)',
              color:C.navy, lineHeight:1.15, marginBottom:16,
            }}>
              Your Academic Vertical
            </h2>
            <p style={{ fontSize:'0.9rem', color:C.gray, lineHeight:1.75, maxWidth:440, marginBottom:32 }}>
              The Focus Pillar represents your cumulative study depth. As you
              complete daily goals and module tasks, your vertical climbs. It's
              more than progress — it's momentum.
            </p>

            {/* Stats */}
            <div style={{ display:'flex', gap:48 }}>
              {[
                { value:'248', label:'HOURS FOCUSED' },
                { value:'+12%', label:'WEEKLY GROWTH' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily:font.syne, fontWeight:800, fontSize:'1.8rem', color:C.navy }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize:'0.72rem', fontWeight:700, color:C.gray, letterSpacing:'0.1em', marginTop:2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════ CTA SECTION ══════════════ */}
      <section style={{
        background:C.navy,
        padding:'80px 40px',
        textAlign:'center',
      }}>
        <div className="lp-reveal" style={revealStyle}>
          <h2 style={{
            fontFamily:font.syne, fontWeight:800,
            fontSize:'clamp(1.6rem,3.5vw,2.4rem)',
            color:C.white, lineHeight:1.2,
            marginBottom:16, maxWidth:520, margin:'0 auto 16px',
          }}>
            Ready to transform your academic landscape?
          </h2>
          <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.6)', marginBottom:36 }}>
            Join 50,000+ students and professionals who have found their focus architecture.
          </p>
          <button
            id="cta-register-btn"
            onClick={() => navigate('/register')}
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'14px 30px', borderRadius:10,
              background:'linear-gradient(135deg,#2dd4bf,#0891b2)',
              color:C.white, border:'none', cursor:'pointer',
              fontFamily:font.syne, fontWeight:700, fontSize:'1rem',
              boxShadow:'0 6px 24px rgba(45,212,191,0.35)',
              transition:'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(0.97)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
          >
            Get Started for Free 🚀
          </button>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:16,
        padding:'20px 60px',
        borderTop:`1px solid ${C.grayLt}`,
        background:C.white,
      }}>
        <div>
          <span style={{ fontFamily:font.syne, fontWeight:800, fontSize:'0.95rem', color:C.navy }}>
            Scholarly
          </span>
          <div style={{ fontSize:'0.75rem', color:C.gray, marginTop:2 }}>
            © 2024 The Focused Editorial. All rights reserved.
          </div>
        </div>

        <div style={{ display:'flex', gap:24 }}>
          {['Privacy Policy','Terms of Service','Contact support','Journal'].map(l => (
            <button key={l} style={{
              background:'none', border:'none', cursor:'pointer',
              fontFamily:font.dm, fontSize:'0.78rem', color:C.gray,
              padding:0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.navy}
            onMouseLeave={e => e.currentTarget.style.color = C.gray}
            >
              {l}
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}