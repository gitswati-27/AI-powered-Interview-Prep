// Shared CSS variables and base styles for all app pages (Dashboard, ATS, Interview, Results)
export const appStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --bg: #080B12;
    --surface: #0E1320;
    --surface-2: #141928;
    --surface-3: #1A2035;
    --border: rgba(255,255,255,0.07);
    --border-bright: rgba(255,255,255,0.13);
    --accent: #5B6EF5;
    --accent-glow: rgba(91,110,245,0.35);
    --accent-soft: rgba(91,110,245,0.12);
    --gold: #E4B96A;
    --gold-soft: rgba(228,185,106,0.12);
    --emerald: #34D399;
    --emerald-soft: rgba(52,211,153,0.12);
    --cyan: #22D3EE;
    --cyan-soft: rgba(34,211,238,0.12);
    --red: #F87171;
    --red-soft: rgba(248,113,113,0.12);
    --text: #F0F2FF;
    --muted: #6B7280;
    --muted-2: #9CA3AF;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
  }

  .pw-app * { box-sizing: border-box; margin: 0; padding: 0; }
  .pw-app {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    position: relative;
  }

  /* ── NOISE ── */
  .pw-app::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.6;
  }

  /* ── ORBS ── */
  .pw-app .orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(100px);
    animation: orb-drift 20s ease-in-out infinite alternate;
  }
  .pw-app .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #3B4FD8 0%, transparent 70%); top: -200px; right: -100px; opacity: 0.18; animation-duration: 22s; }
  .pw-app .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, #8B5CF6 0%, transparent 70%); bottom: -80px; left: -60px; opacity: 0.14; animation-duration: 16s; animation-direction: alternate-reverse; }
  @keyframes orb-drift { from { transform: translate(0,0) scale(1); } to { transform: translate(28px, 36px) scale(1.07); } }

  /* ── TOPNAV ── */
  .pw-topnav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
    background: rgba(8,11,18,0.8);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .pw-topnav-left { display: flex; align-items: center; gap: 32px; }
  .pw-topnav-logo {
    font-family: var(--serif); font-size: 1.35rem;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    text-decoration: none; white-space: nowrap;
  }
  .pw-topnav-logo em { font-style: italic; }
  .pw-topnav-links { display: flex; gap: 4px; }
  .pw-topnav-link {
    font-size: 0.88rem; font-weight: 400; color: var(--muted-2);
    padding: 6px 14px; border-radius: 8px;
    background: none; border: none; cursor: pointer;
    font-family: var(--sans);
    transition: color 0.2s, background 0.2s;
    text-decoration: none; display: inline-flex; align-items: center;
  }
  .pw-topnav-link:hover, .pw-topnav-link.active { color: var(--text); background: var(--accent-soft); }
  .pw-topnav-right { display: flex; align-items: center; gap: 12px; }
  .pw-topnav-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--accent-soft); border: 1px solid rgba(91,110,245,0.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 0.8rem; font-weight: 600;
    cursor: pointer;
  }

  /* ── PAGE WRAPPER ── */
  .pw-page { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 48px 40px 80px; }

  /* ── PAGE HEADER ── */
  .pw-page-header { margin-bottom: 40px; animation: fade-up 0.5s ease both; }
  .pw-page-label {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 10px;
  }
  .pw-page-title {
    font-family: var(--serif); font-size: clamp(2rem, 4vw, 2.8rem);
    line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 10px;
  }
  .pw-page-title em { font-style: italic; color: var(--gold); }
  .pw-page-sub { color: var(--muted-2); font-size: 0.95rem; line-height: 1.6; max-width: 540px; }

  /* ── CARDS ── */
  .pw-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    transition: border-color 0.2s;
  }
  .pw-card:hover { border-color: var(--border-bright); }
  .pw-card-title {
    font-family: var(--serif); font-size: 1.25rem;
    letter-spacing: -0.01em; margin-bottom: 6px;
  }
  .pw-card-sub { color: var(--muted-2); font-size: 0.85rem; }

  /* ── STAT CARD ── */
  .pw-stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 18px; padding: 24px 28px;
    transition: border-color 0.25s, transform 0.2s;
    animation: fade-up 0.5s ease both;
  }
  .pw-stat-card:hover { border-color: var(--border-bright); transform: translateY(-2px); }
  .pw-stat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--accent-soft); border: 1px solid rgba(91,110,245,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 1rem; margin-bottom: 20px;
  }
  .pw-stat-label { font-size: 0.78rem; color: var(--muted-2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
  .pw-stat-value {
    font-family: var(--serif); font-size: 2.2rem; letter-spacing: -0.02em; line-height: 1;
    background: linear-gradient(135deg, var(--text) 50%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* ── PROGRESS BARS ── */
  .pw-progress-row { margin-bottom: 24px; }
  .pw-progress-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .pw-progress-name { font-size: 0.88rem; color: var(--muted-2); }
  .pw-progress-val { font-size: 0.88rem; font-weight: 600; }
  .pw-progress-track {
    height: 6px; background: var(--surface-3); border-radius: 999px; overflow: hidden;
  }
  .pw-progress-fill {
    height: 100%; border-radius: 999px;
    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ── BADGE ── */
  .pw-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.75rem; font-weight: 500; padding: 4px 12px;
    border-radius: 999px; white-space: nowrap;
  }
  .pw-badge-accent { background: var(--accent-soft); color: #A5B4FC; border: 1px solid rgba(91,110,245,0.25); }
  .pw-badge-emerald { background: var(--emerald-soft); color: var(--emerald); border: 1px solid rgba(52,211,153,0.2); }
  .pw-badge-gold { background: var(--gold-soft); color: var(--gold); border: 1px solid rgba(228,185,106,0.2); }
  .pw-badge-red { background: var(--red-soft); color: var(--red); border: 1px solid rgba(248,113,113,0.2); }

  /* ── BUTTONS ── */
  .pw-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; font-family: var(--sans);
    font-weight: 500; border-radius: 12px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .pw-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%); }
  .pw-btn-primary {
    background: var(--accent); color: #fff;
    padding: 12px 22px; font-size: 0.9rem;
    box-shadow: 0 4px 20px var(--accent-glow);
  }
  .pw-btn-primary:hover { background: #6B7EF7; transform: translateY(-1px); box-shadow: 0 8px 28px var(--accent-glow); }
  .pw-btn-primary:disabled { background: var(--surface-3); color: var(--muted); box-shadow: none; transform: none; cursor: not-allowed; }
  .pw-btn-primary svg { transition: transform 0.2s; }
  .pw-btn-primary:not(:disabled):hover svg { transform: translateX(2px); }

  .pw-btn-ghost {
    background: var(--surface-2); color: var(--muted-2);
    border: 1px solid var(--border); padding: 11px 20px; font-size: 0.88rem;
  }
  .pw-btn-ghost:hover { border-color: var(--border-bright); color: var(--text); }
  .pw-btn-ghost::after { display: none; }

  .pw-btn-danger { background: rgba(248,113,113,0.15); color: var(--red); border: 1px solid rgba(248,113,113,0.2); padding: 11px 20px; font-size: 0.88rem; }
  .pw-btn-danger:hover { background: rgba(248,113,113,0.25); }
  .pw-btn-danger::after { display: none; }

  .pw-btn-success { background: var(--emerald-soft); color: var(--emerald); border: 1px solid rgba(52,211,153,0.2); padding: 12px 22px; font-size: 0.9rem; }
  .pw-btn-success:hover { background: rgba(52,211,153,0.2); }
  .pw-btn-success::after { display: none; }

  .pw-btn-full { width: 100%; }
  .pw-btn-lg { padding: 14px 28px; font-size: 0.97rem; border-radius: 14px; }

  /* ── INPUTS / TEXTAREAS ── */
  .pw-input, .pw-textarea {
    width: 100%;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--border-bright);
    border-radius: 12px;
    font-family: var(--sans); font-size: 0.92rem; font-weight: 300;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .pw-input { padding: 13px 16px; }
  .pw-textarea { padding: 16px; resize: none; line-height: 1.65; }
  .pw-input::placeholder, .pw-textarea::placeholder { color: var(--muted); }
  .pw-input:focus, .pw-textarea:focus {
    border-color: var(--accent); background: var(--surface-2);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  /* ── FIELD ── */
  .pw-field { margin-bottom: 18px; }
  .pw-field-label { display: block; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 8px; }

  /* ── SCORE CIRCLE ── */
  .pw-score-ring {
    width: 120px; height: 120px; border-radius: 50%;
    border: 5px solid var(--accent);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 0 32px var(--accent-glow), inset 0 0 20px var(--accent-soft);
    background: var(--surface-2);
  }
  .pw-score-ring-num {
    font-family: var(--serif); font-size: 2.2rem; line-height: 1;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pw-score-ring-label { font-size: 0.65rem; color: var(--muted-2); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

  /* ── SCORE MINI CARD ── */
  .pw-score-mini {
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px; text-align: center;
  }
  .pw-score-mini-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 10px; }
  .pw-score-mini-val { font-family: var(--serif); font-size: 2.4rem; letter-spacing: -0.02em; line-height: 1; }

  /* ── KEYWORD CHIPS ── */
  .pw-chip { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 400; }
  .pw-chip-match { background: var(--emerald-soft); color: var(--emerald); border: 1px solid rgba(52,211,153,0.2); }
  .pw-chip-miss { background: var(--red-soft); color: var(--red); border: 1px solid rgba(248,113,113,0.2); }

  /* ── UPLOAD BOX ── */
  .pw-upload-box {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 2px dashed var(--border-bright); border-radius: 16px;
    padding: 40px 24px; cursor: pointer; text-align: center;
    transition: border-color 0.2s, background 0.2s;
    background: var(--surface-2);
  }
  .pw-upload-box:hover { border-color: var(--accent); background: var(--accent-soft); }
  .pw-upload-icon { font-size: 2.2rem; margin-bottom: 14px; }
  .pw-upload-title { font-size: 0.95rem; font-weight: 500; margin-bottom: 4px; }
  .pw-upload-hint { font-size: 0.8rem; color: var(--muted); }

  /* ── DIVIDER ── */
  .pw-divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

  /* ── EMPTY STATE ── */
  .pw-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; text-align: center; color: var(--muted);
  }
  .pw-empty-icon { font-size: 2.5rem; margin-bottom: 16px; opacity: 0.5; }
  .pw-empty-title { font-family: var(--serif); font-size: 1.3rem; color: var(--muted-2); margin-bottom: 8px; }
  .pw-empty-text { font-size: 0.88rem; line-height: 1.6; }

  /* ── LOADING ── */
  .pw-loading {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    background: var(--bg); color: var(--muted-2);
    font-family: var(--sans);
  }
  .pw-loading-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid var(--border-bright);
    border-top-color: var(--accent);
    animation: spin 0.8s linear infinite;
  }
  .pw-loading-text { font-size: 0.9rem; color: var(--muted); }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── GRID HELPERS ── */
  .pw-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pw-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .pw-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  @media (max-width: 900px) {
    .pw-grid-4, .pw-grid-3 { grid-template-columns: repeat(2,1fr); }
    .pw-grid-2 { grid-template-columns: 1fr; }
    .pw-page { padding: 32px 20px 60px; }
    .pw-topnav { padding: 0 20px; }
    .pw-topnav-links { display: none; }
  }
  @media (max-width: 600px) {
    .pw-grid-4, .pw-grid-3, .pw-grid-2 { grid-template-columns: 1fr; }
  }

  @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
`;