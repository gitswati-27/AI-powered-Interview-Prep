import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";

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

  .pw-auth * { box-sizing: border-box; margin: 0; padding: 0; }

  .pw-auth {
    font-family: var(--sans);
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    display: flex;
    position: relative;
    overflow: hidden;
  }

  /* ── NOISE ── */
  .pw-auth::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.6;
  }

  /* ── ORBS ── */
  .pw-auth .orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(90px); opacity: 0.22;
    animation: orb-drift 18s ease-in-out infinite alternate;
  }
  .pw-auth .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #3B4FD8 0%, transparent 70%); top: -200px; left: -100px; animation-duration: 20s; }
  .pw-auth .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, #8B5CF6 0%, transparent 70%); bottom: -60px; right: -60px; animation-duration: 15s; animation-direction: alternate-reverse; }
  .pw-auth .orb-3 { width: 220px; height: 220px; background: radial-gradient(circle, #E4B96A 0%, transparent 70%); bottom: 30%; left: 30%; opacity: 0.1; animation-duration: 22s; }
  @keyframes orb-drift { from { transform: translate(0,0) scale(1); } to { transform: translate(24px, 32px) scale(1.06); } }

  /* ── LEFT PANEL ── */
  .pw-auth-left {
    display: none;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    border-right: 1px solid var(--border);
    position: relative; z-index: 1;
  }
  @media (min-width: 960px) { .pw-auth-left { display: flex; } }

  .pw-auth-left-logo {
    font-family: var(--serif); font-size: 1.6rem;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    text-decoration: none;
  }
  .pw-auth-left-logo em { font-style: italic; }

  .pw-auth-left-body { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 420px; }

  .pw-auth-left-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent-soft); border: 1px solid rgba(91,110,245,0.25);
    color: #A5B4FC; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px; margin-bottom: 28px; width: fit-content;
  }
  .pw-auth-left-eyebrow .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse-dot 2s ease infinite; }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.7); } }

  .pw-auth-left-heading {
    font-family: var(--serif);
    font-size: clamp(2.2rem, 3vw, 3rem);
    line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px;
  }
  .pw-auth-left-heading em { font-style: italic; color: var(--gold); }
  .pw-auth-left-sub { color: var(--muted-2); font-size: 0.95rem; line-height: 1.7; margin-bottom: 48px; }

  .pw-perks { display: flex; flex-direction: column; gap: 14px; }
  .pw-perk {
    display: flex; align-items: flex-start; gap: 12px;
  }
  .pw-perk-check {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    background: var(--accent-soft); border: 1px solid rgba(91,110,245,0.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 0.7rem; margin-top: 1px;
  }
  .pw-perk-text { font-size: 0.9rem; color: var(--muted-2); line-height: 1.5; }
  .pw-perk-title { color: var(--text); font-weight: 500; }

  .pw-auth-left-footer { color: var(--muted); font-size: 0.8rem; }

  /* ── RIGHT / FORM PANEL ── */
  .pw-auth-right {
    flex: 0 0 auto; width: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 24px;
    position: relative; z-index: 1;
    overflow-y: auto;
  }
  @media (min-width: 960px) { .pw-auth-right { width: 520px; } }

  .pw-auth-card {
    width: 100%; max-width: 420px;
    animation: fade-up 0.5s ease both;
  }
  @keyframes fade-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

  .pw-auth-card-logo {
    display: block;
    font-family: var(--serif); font-size: 1.5rem; margin-bottom: 40px;
    background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    text-decoration: none;
  }
  .pw-auth-card-logo em { font-style: italic; }
  @media (min-width: 960px) { .pw-auth-card-logo { display: none; } }

  .pw-auth-heading {
    font-family: var(--serif);
    font-size: 2.2rem; letter-spacing: -0.02em; line-height: 1.1;
    margin-bottom: 8px;
  }
  .pw-auth-heading em { font-style: italic; color: var(--gold); }
  .pw-auth-sub { color: var(--muted-2); font-size: 0.9rem; margin-bottom: 36px; }

  /* ── FIELDS ── */
  .pw-field { margin-bottom: 14px; }
  .pw-field-label { display: block; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 8px; }
  .pw-field-wrap { position: relative; }
  .pw-field-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); font-size: 0.95rem; pointer-events: none;
    transition: color 0.2s;
  }
  .pw-field-input {
    width: 100%;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--border-bright);
    border-radius: 12px; padding: 13px 14px 13px 42px;
    font-family: var(--sans); font-size: 0.95rem; font-weight: 300;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .pw-field-input::placeholder { color: var(--muted); }
  .pw-field-input:focus {
    border-color: var(--accent);
    background: var(--surface-2);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }
  .pw-field-wrap:focus-within .pw-field-icon { color: var(--accent); }

  /* ── FIELD ROW ── */
  .pw-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── SUBMIT ── */
  .pw-auth-submit {
    width: 100%; margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 0.97rem; font-weight: 500;
    padding: 14px 24px; border-radius: 12px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 6px 28px var(--accent-glow);
    position: relative; overflow: hidden;
  }
  .pw-auth-submit::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 60%);
  }
  .pw-auth-submit:hover { background: #6B7EF7; transform: translateY(-1px); box-shadow: 0 10px 36px var(--accent-glow); }
  .pw-auth-submit svg { transition: transform 0.2s; }
  .pw-auth-submit:hover svg { transform: translateX(3px); }

  /* ── TERMS NOTE ── */
  .pw-auth-terms { font-size: 0.78rem; color: var(--muted); text-align: center; margin-top: 14px; line-height: 1.6; }
  .pw-auth-terms a { color: #A5B4FC; text-decoration: none; }
  .pw-auth-terms a:hover { color: var(--text); }

  /* ── FOOTER LINK ── */
  .pw-auth-footer-text { text-align: center; margin-top: 24px; font-size: 0.88rem; color: var(--muted-2); }
  .pw-auth-footer-link { color: #A5B4FC; font-weight: 500; text-decoration: none; transition: color 0.2s; }
  .pw-auth-footer-link:hover { color: var(--text); }
`;

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) { toast.error(data.message || "Signup failed"); return; }
      toast.success("Signup successful!");
      toast.success("Please login!");
      setTimeout(() => { navigate("/login"); }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const perks = [
    { title: "Free to start", text: "No credit card required. Get going in minutes." },
    { title: "ATS + Mock Interviews", text: "Resume scoring and live AI interview practice in one place." },
    { title: "Personalized insights", text: "Track your progress and readiness over every session." },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="pw-auth">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* LEFT PANEL */}
        <div className="pw-auth-left">
          <Link to="/" className="pw-auth-left-logo">Prep<em>Wise</em></Link>

          <div className="pw-auth-left-body">
            <div className="pw-auth-left-eyebrow">
              <span className="dot" /> Join thousands of candidates
            </div>
            <h2 className="pw-auth-left-heading">
              Preparation<br />meets <em>confidence.</em>
            </h2>
            <p className="pw-auth-left-sub">
              Create your free account and start practicing smarter today.
            </p>
            <div className="pw-perks">
              {perks.map((p, i) => (
                <div key={i} className="pw-perk">
                  <div className="pw-perk-check"><FiCheck /></div>
                  <div className="pw-perk-text">
                    <div className="pw-perk-title">{p.title}</div>
                    {p.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pw-auth-left-footer">© 2026 PrepWise. All rights reserved.</div>
        </div>

        {/* FORM PANEL */}
        <div className="pw-auth-right">
          <div className="pw-auth-card">
            <Link to="/" className="pw-auth-card-logo">Prep<em>Wise</em></Link>

            <h1 className="pw-auth-heading">Create your <em>account.</em></h1>
            <p className="pw-auth-sub">Free forever. No credit card needed.</p>

            <div className="pw-field">
              <label className="pw-field-label">Full Name</label>
              <div className="pw-field-wrap">
                <FiUser className="pw-field-icon" />
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pw-field-input"
                />
              </div>
            </div>

            <div className="pw-field">
              <label className="pw-field-label">Email</label>
              <div className="pw-field-wrap">
                <FiMail className="pw-field-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pw-field-input"
                />
              </div>
            </div>

            <div className="pw-field-row">
              <div className="pw-field">
                <label className="pw-field-label">Password</label>
                <div className="pw-field-wrap">
                  <FiLock className="pw-field-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pw-field-input"
                  />
                </div>
              </div>
              <div className="pw-field">
                <label className="pw-field-label">Confirm Password</label>
                <div className="pw-field-wrap">
                  <FiLock className="pw-field-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pw-field-input"
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  />
                </div>
              </div>
            </div>

            <button className="pw-auth-submit" onClick={handleSignup}>
              Create Account <FiArrowRight />
            </button>

            <p className="pw-auth-terms">
              By signing up, you agree to our{" "}
              <a href="/login">Terms of Service</a> and <a href="/login">Privacy Policy</a>.
            </p>

            <p className="pw-auth-footer-text">
              Already have an account?{" "}
              <Link to="/login" className="pw-auth-footer-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;