import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiFileText, FiBarChart2, FiTrendingUp, FiActivity, FiArrowRight, FiMic } from "react-icons/fi";
import { appStyles } from "./appStyles";

export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [analyticsRes, resultsRes, profileRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/analytics/ats`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/mock-interview/results`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, { headers }),
      ]);

      const [analyticsData, resultsData, profileData] = await Promise.all([
        analyticsRes.json(), resultsRes.json(), profileRes.json(),
      ]);

      setAnalytics(analyticsData);
      setSummary(resultsData.summary || null);
      setUser(profileData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.user?.name?.split(" ")[0] || "there";

  const stats = [
    { title: "Latest ATS Score", value: analytics?.latestScore ?? "—", icon: <FiFileText />, delay: "0s" },
    { title: "ATS Checks Run", value: analytics?.totalChecks ?? 0, icon: <FiBarChart2 />, delay: "0.07s" },
    { title: "Readiness Level", value: summary?.readinessLevel ?? "—", icon: <FiTrendingUp />, delay: "0.14s" },
    { title: "Avg Confidence", value: summary ? `${summary.avgConfidence}/10` : "—", icon: <FiActivity />, delay: "0.21s" },
  ];

  const actions = [
    { title: "ATS Checker", desc: "Score your resume against any job description.", route: "/ats", icon: <FiFileText />, label: "Open ATS" },
    { title: "Mock Interview", desc: "Practice with live AI-driven question evaluation.", route: "/interview", icon: <FiMic />, label: "Start Interview" },
    { title: "Interview Results", desc: "Review your past scores and AI feedback.", route: "/results", icon: <FiBarChart2 />, label: "View Results" },
  ];

  const bars = [
    { label: "Readiness Score", val: summary?.readinessScore || 0, color: "var(--accent)", textColor: "#A5B4FC" },
    { label: "Communication Clarity", val: (summary?.avgClarity || 0) * 10, color: "var(--cyan)", textColor: "var(--cyan)" },
    { label: "Technical Confidence", val: (summary?.avgConfidence || 0) * 10, color: "var(--emerald)", textColor: "var(--emerald)" },
  ];

  if (loading) {
    return (
      <>
        <style>{appStyles}</style>
        <div className="pw-loading">
          <div className="pw-loading-spinner" />
          <div className="pw-loading-text">Loading your dashboard…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{appStyles}</style>
      <div className="pw-app">
        <div className="orb orb-1" /><div className="orb orb-2" />

        {/* TOPNAV */}
        <nav className="pw-topnav">
          <div className="pw-topnav-left">
            <span className="pw-topnav-logo">Prep<em>Wise</em></span>
            <div className="pw-topnav-links">
              <button className="pw-topnav-link active" onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button className="pw-topnav-link" onClick={() => navigate("/ats")}>ATS</button>
              <button className="pw-topnav-link" onClick={() => navigate("/interview")}>Interview</button>
              <button className="pw-topnav-link" onClick={() => navigate("/results")}>Results</button>
            </div>
          </div>
          <div className="pw-topnav-right">
            <div className="pw-topnav-avatar">{firstName[0]?.toUpperCase()}</div>
          </div>
        </nav>

        <div className="pw-page">

          {/* HEADER */}
          <div className="pw-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="pw-page-label">Dashboard</div>
              <h1 className="pw-page-title">Good to see you, <em>{firstName}.</em></h1>
              <p className="pw-page-sub">Here's how your preparation is shaping up.</p>
            </div>
            <button className="pw-btn pw-btn-primary" style={{ marginTop: 8 }} onClick={() => navigate("/interview")}>
              Start Interview <FiArrowRight />
            </button>
          </div>

          {/* STATS */}
          <div className="pw-grid-4" style={{ marginBottom: 32 }}>
            {stats.map((s, i) => (
              <div key={i} className="pw-stat-card" style={{ animationDelay: s.delay }}>
                <div className="pw-stat-icon">{s.icon}</div>
                <div className="pw-stat-label">{s.title}</div>
                <div className="pw-stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

            {/* LEFT — Insights */}
            <div className="pw-card" style={{ padding: "36px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                <div>
                  <div className="pw-card-title">AI Interview Insights</div>
                  <div className="pw-card-sub">Your preparation summary across all sessions.</div>
                </div>
                <span className="pw-badge pw-badge-accent">Updated today</span>
              </div>

              {bars.map((b, i) => (
                <div key={i} className="pw-progress-row">
                  <div className="pw-progress-header">
                    <span className="pw-progress-name">{b.label}</span>
                    <span className="pw-progress-val" style={{ color: b.textColor }}>{b.val.toFixed(0)}%</span>
                  </div>
                  <div className="pw-progress-track">
                    <div className="pw-progress-fill" style={{ width: `${b.val}%`, background: b.color }} />
                  </div>
                </div>
              ))}

              {/* ATS block */}
              <hr className="pw-divider" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Average ATS Score</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", background: "linear-gradient(135deg, var(--text) 40%, var(--accent) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {analytics?.avgScore ? `${analytics.avgScore}%` : "—"}
                  </div>
                </div>
                <button className="pw-btn pw-btn-ghost" onClick={() => navigate("/ats")}>Run Analysis <FiArrowRight size={14} /></button>
              </div>
            </div>

            {/* RIGHT — Quick Actions */}
            <div className="pw-card" style={{ padding: "28px 24px" }}>
              <div className="pw-card-title" style={{ marginBottom: 20 }}>Quick Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {actions.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      borderRadius: 14, padding: "18px 20px",
                      transition: "border-color 0.2s", cursor: "default",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "0.85rem" }}>{a.icon}</div>
                      <span style={{ fontWeight: 500, fontSize: "0.92rem" }}>{a.title}</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: 14, lineHeight: 1.5 }}>{a.desc}</p>
                    <button className="pw-btn pw-btn-primary pw-btn-full" style={{ padding: "9px 16px", fontSize: "0.85rem" }} onClick={() => navigate(a.route)}>
                      {a.label} <FiArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}