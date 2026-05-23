import { useNavigate } from "react-router-dom";
import { FiFileText, FiMic, FiBarChart2, FiArrowRight, FiChevronRight } from "react-icons/fi";
//import { useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --bg: #080B12;
    --surface: #0E1320;
    --surface-2: #141928;
    --border: rgba(255,255,255,0.07);
    --border-bright: rgba(255,255,255,0.13);
    --accent: #5B6EF5;
    --accent-glow: rgba(91,110,245,0.35);
    --accent-soft: rgba(91,110,245,0.12);
    --gold: #E4B96A;
    --text: #F0F2FF;
    --muted: #6B7280;
    --muted-2: #9CA3AF;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
  }

  .pw-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .pw-root { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  /* ── NOISE OVERLAY ── */
  .pw-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.6;
  }

  /* ── GRADIENT ORBS ── */
  .orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(90px); opacity: 0.25;
    animation: orb-drift 18s ease-in-out infinite alternate;
  }
  .orb-1 { width: 520px; height: 520px; background: radial-gradient(circle, #3B4FD8 0%, transparent 70%); top: -160px; left: -120px; animation-duration: 20s; }
  .orb-2 { width: 380px; height: 380px; background: radial-gradient(circle, #8B5CF6 0%, transparent 70%); top: 40%; right: -100px; animation-duration: 14s; animation-direction: alternate-reverse; }
  .orb-3 { width: 280px; height: 280px; background: radial-gradient(circle, #E4B96A 0%, transparent 70%); bottom: 15%; left: 25%; opacity: 0.12; animation-duration: 22s; }
  @keyframes orb-drift { from { transform: translate(0,0) scale(1); } to { transform: translate(30px, 40px) scale(1.08); } }

  /* ── NAVBAR ── */
  .pw-nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: rgba(8,11,18,0.75);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .pw-logo {
    font-family: var(--serif);
    font-size: 1.6rem; letter-spacing: -0.01em;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pw-logo span { font-style: italic; }
  .pw-nav-actions { display: flex; align-items: center; gap: 12px; }
  .pw-btn-ghost {
    background: none; border: none; cursor: pointer;
    color: var(--muted-2); font-family: var(--sans); font-size: 0.9rem; font-weight: 400;
    padding: 8px 16px; border-radius: 8px;
    transition: color 0.2s, background 0.2s;
  }
  .pw-btn-ghost:hover { color: var(--text); background: var(--accent-soft); }
  .pw-btn-primary {
    background: var(--accent); border: none; cursor: pointer;
    color: #fff; font-family: var(--sans); font-size: 0.9rem; font-weight: 500;
    padding: 9px 22px; border-radius: 10px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 0 0 0 var(--accent-glow);
    position: relative; overflow: hidden;
  }
  .pw-btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  }
  .pw-btn-primary:hover { background: #6B7EF7; box-shadow: 0 0 24px var(--accent-glow); transform: translateY(-1px); }

  /* ── HERO ── */
  .pw-hero {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 110px 48px 80px;
  }
  .pw-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent-soft); border: 1px solid rgba(91,110,245,0.25);
    color: #A5B4FC; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px; margin-bottom: 36px;
    animation: fade-up 0.6s ease both;
  }
  .pw-hero-eyebrow .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse-dot 2s ease infinite; }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.7); } }

  .pw-hero-heading {
    font-family: var(--serif);
    font-size: clamp(3.2rem, 7vw, 5.8rem);
    line-height: 1.04; letter-spacing: -0.02em;
    margin-bottom: 28px; max-width: 760px;
    animation: fade-up 0.6s 0.1s ease both;
  }
  .pw-hero-heading em { font-style: italic; color: var(--gold); }

  .pw-hero-sub {
    color: var(--muted-2); font-size: 1.15rem; font-weight: 300; line-height: 1.7;
    max-width: 500px; margin-bottom: 48px;
    animation: fade-up 0.6s 0.2s ease both;
  }

  .pw-hero-cta {
    display: flex; align-items: center; gap: 16px;
    animation: fade-up 0.6s 0.3s ease both;
  }
  .pw-btn-cta {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 1rem; font-weight: 500;
    padding: 14px 28px; border-radius: 14px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 8px 32px var(--accent-glow);
    position: relative; overflow: hidden;
  }
  .pw-btn-cta::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
  }
  .pw-btn-cta:hover { background: #6B7EF7; transform: translateY(-2px); box-shadow: 0 12px 40px var(--accent-glow); }
  .pw-btn-cta svg { transition: transform 0.2s; }
  .pw-btn-cta:hover svg { transform: translateX(3px); }

  .pw-hero-learn {
    color: var(--muted-2); font-size: 0.9rem; font-weight: 400;
    display: inline-flex; align-items: center; gap: 4px;
    cursor: pointer; background: none; border: none;
    transition: color 0.2s; font-family: var(--sans);
  }
  .pw-hero-learn:hover { color: var(--text); }

  /* ── STAT STRIP ── */
  .pw-stats {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto 0;
    padding: 0 48px 80px;
    display: flex; gap: 0;
    animation: fade-up 0.6s 0.4s ease both;
  }
  .pw-stat {
    flex: 1; padding: 28px 32px;
    border-top: 1px solid var(--border);
  }
  .pw-stat:not(:last-child) { border-right: 1px solid var(--border); }
  .pw-stat-num {
    font-family: var(--serif); font-size: 2.4rem;
    background: linear-gradient(135deg, var(--text) 50%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    margin-bottom: 4px;
  }
  .pw-stat-label { color: var(--muted); font-size: 0.85rem; font-weight: 400; }

  /* ── DIVIDER ── */
  .pw-divider {
    max-width: 1100px; margin: 0 auto;
    padding: 0 48px;
    position: relative; z-index: 1;
  }
  .pw-divider-line { border: none; border-top: 1px solid var(--border); }

  /* ── FEATURES ── */
  .pw-features {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 80px 48px;
  }
  .pw-section-label {
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 16px;
  }
  .pw-features-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 56px; gap: 24px;
  }
  .pw-features-title {
    font-family: var(--serif); font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1; letter-spacing: -0.02em; max-width: 400px;
  }
  .pw-features-title em { font-style: italic; color: var(--gold); }
  .pw-features-desc { color: var(--muted-2); font-size: 0.95rem; line-height: 1.7; max-width: 300px; }

  .pw-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }

  .pw-feature-card {
    background: var(--surface); padding: 40px 36px;
    border: 1px solid var(--border); position: relative; overflow: hidden;
    transition: border-color 0.3s, background 0.3s;
    cursor: default;
  }
  .pw-feature-card:first-child { border-radius: 20px 0 0 20px; }
  .pw-feature-card:last-child  { border-radius: 0 20px 20px 0; }
  .pw-feature-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-soft) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.3s;
  }
  .pw-feature-card:hover { border-color: var(--border-bright); background: var(--surface-2); }
  .pw-feature-card:hover::before { opacity: 1; }

  .pw-feature-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: var(--accent-soft); border: 1px solid rgba(91,110,245,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 1.2rem; margin-bottom: 28px;
    transition: background 0.3s, box-shadow 0.3s;
    position: relative; z-index: 1;
  }
  .pw-feature-card:hover .pw-feature-icon { background: var(--accent); color: #fff; box-shadow: 0 0 20px var(--accent-glow); }

  .pw-feature-num {
    position: absolute; top: 28px; right: 32px;
    font-family: var(--serif); font-size: 4rem; font-weight: 400;
    color: var(--border); line-height: 1; transition: color 0.3s;
    user-select: none;
  }
  .pw-feature-card:hover .pw-feature-num { color: rgba(91,110,245,0.1); }

  .pw-feature-title {
    font-size: 1.15rem; font-weight: 500; margin-bottom: 10px;
    position: relative; z-index: 1;
  }
  .pw-feature-desc { color: var(--muted-2); font-size: 0.9rem; line-height: 1.65; position: relative; z-index: 1; }

  /* ── CTA ── */
  .pw-cta {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 0 48px 120px;
  }
  .pw-cta-inner {
    background: var(--surface);
    border: 1px solid var(--border-bright);
    border-radius: 28px; padding: 72px 64px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 48px; position: relative; overflow: hidden;
  }
  .pw-cta-inner::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(91,110,245,0.08) 0%, rgba(139,92,246,0.05) 50%, transparent 80%);
  }
  .pw-cta-inner::after {
    content: ''; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(91,110,245,0.15) 0%, transparent 70%);
    top: -150px; right: -100px; pointer-events: none;
  }
  .pw-cta-text { position: relative; z-index: 1; }
  .pw-cta-title {
    font-family: var(--serif); font-size: clamp(2rem, 3.5vw, 2.8rem);
    line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 14px;
  }
  .pw-cta-title em { font-style: italic; color: var(--gold); }
  .pw-cta-subtitle { color: var(--muted-2); font-size: 0.95rem; line-height: 1.6; max-width: 360px; }
  .pw-cta-action { position: relative; z-index: 1; flex-shrink: 0; }
  .pw-btn-cta-large {
    display: inline-flex; align-items: center; gap: 12px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 1rem; font-weight: 500;
    padding: 18px 36px; border-radius: 14px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 8px 40px var(--accent-glow); white-space: nowrap;
    position: relative; overflow: hidden;
  }
  .pw-btn-cta-large::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
  }
  .pw-btn-cta-large:hover { background: #6B7EF7; transform: translateY(-2px); box-shadow: 0 16px 48px var(--accent-glow); }
  .pw-btn-cta-large svg { transition: transform 0.2s; }
  .pw-btn-cta-large:hover svg { transform: translateX(4px); }

  /* ── FOOTER ── */
  .pw-footer {
    position: relative; z-index: 1;
    border-top: 1px solid var(--border);
    padding: 32px 48px;
    display: flex; align-items: center; justify-content: space-between;
    max-width: 100%;
  }
  .pw-footer-logo {
    font-family: var(--serif); font-size: 1.1rem;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pw-footer-copy { color: var(--muted); font-size: 0.82rem; }

  /* ── ANIMATIONS ── */
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .pw-nav { padding: 16px 24px; }
    .pw-hero, .pw-stats, .pw-features, .pw-cta { padding-left: 24px; padding-right: 24px; }
    .pw-features-grid { grid-template-columns: 1fr; }
    .pw-feature-card:first-child { border-radius: 20px 20px 0 0; }
    .pw-feature-card:last-child  { border-radius: 0 0 20px 20px; }
    .pw-features-header { flex-direction: column; align-items: flex-start; }
    .pw-cta-inner { flex-direction: column; padding: 48px 32px; text-align: center; }
    .pw-cta-subtitle { max-width: 100%; }
    .pw-stats { flex-direction: column; }
    .pw-stat:not(:last-child) { border-right: none; border-bottom: 1px solid var(--border); }
    .pw-footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px; }
  }
`;

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiFileText />,
      title: "ATS Resume Analysis",
      desc: "Upload your resume and receive a detailed AI-powered evaluation against real ATS criteria.",
      num: "01",
    },
    {
      icon: <FiMic />,
      title: "AI Mock Interviews",
      desc: "Practice with live speech recognition that adapts to your role and experience level.",
      num: "02",
    },
    {
      icon: <FiBarChart2 />,
      title: "Interview Insights",
      desc: "Track your confidence, fluency, and readiness across every session over time.",
      num: "03",
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="pw-root">
        {/* Ambient orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* NAVBAR */}
        <nav className="pw-nav">
          <div className="pw-logo">Prep<span>Wise</span></div>
          <div className="pw-nav-actions">
            <button className="pw-btn-ghost" onClick={() => navigate("/login")}>Login</button>
            <button className="pw-btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="pw-hero">
          <div className="pw-hero-eyebrow">
            <span className="dot" />
            AI-powered interview preparation
          </div>
          <h1 className="pw-hero-heading">
            Ace every interview,<br /><em>every time.</em>
          </h1>
          <p className="pw-hero-sub">
            From ATS analysis to live AI mock interviews — PrepWise gives you the edge before you walk into the room.
          </p>
          <div className="pw-hero-cta">
            <button className="pw-btn-cta" onClick={() => navigate("/signup")}>
              Get Started Free <FiArrowRight />
            </button>
            <button className="pw-hero-learn" onClick={() => navigate("/login")}>
              Sign in <FiChevronRight size={14} />
            </button>
          </div>
        </section>

        {/* STAT STRIP */}
        <div className="pw-stats">
          <div className="pw-stat">
            <div className="pw-stat-num">10k+</div>
            <div className="pw-stat-label">Resumes analyzed</div>
          </div>
          <div className="pw-stat">
            <div className="pw-stat-num">94%</div>
            <div className="pw-stat-label">Interview success rate</div>
          </div>
          <div className="pw-stat">
            <div className="pw-stat-num">3min</div>
            <div className="pw-stat-label">To your first insight</div>
          </div>
        </div>

        <div className="pw-divider">
          <hr className="pw-divider-line" />
        </div>

        {/* FEATURES */}
        <section className="pw-features">
          <div className="pw-features-header">
            <div>
              <div className="pw-section-label">Features</div>
              <h2 className="pw-features-title">
                Everything you need to <em>land the role.</em>
              </h2>
            </div>
            <p className="pw-features-desc">
              Three powerful tools, one streamlined platform — built to turn preparation into confidence.
            </p>
          </div>
          <div className="pw-features-grid">
            {features.map((item, i) => (
              <div key={i} className="pw-feature-card">
                <div className="pw-feature-num">{item.num}</div>
                <div className="pw-feature-icon">{item.icon}</div>
                <h3 className="pw-feature-title">{item.title}</h3>
                <p className="pw-feature-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pw-cta">
          <div className="pw-cta-inner">
            <div className="pw-cta-text">
              <h2 className="pw-cta-title">Ready to <em>level up?</em></h2>
              <p className="pw-cta-subtitle">
                Join thousands of candidates who walked in prepared — and walked out with offers.
              </p>
            </div>
            <div className="pw-cta-action">
              <button className="pw-btn-cta-large" onClick={() => navigate("/signup")}>
                Start for Free <FiArrowRight />
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pw-footer">
          <div className="pw-footer-logo">Prep<em>Wise</em></div>
          <div className="pw-footer-copy">© 2026 PrepWise. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}

export default Landing;