import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiMessageSquare, FiUser } from "react-icons/fi";
import { appStyles } from "./appStyles";

function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mock-interview/results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Results:", data);
      setResults(data.answers || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = (item) => {
    const vals = [item.correctness, item.clarity, item.confidence].filter(Boolean);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  };

  const scoreColor = (v) => {
    if (v >= 7.5) return "var(--emerald)";
    if (v >= 5)   return "var(--gold)";
    return "var(--red)";
  };

  const scoreCards = (item) => [
    { label: "Correctness", value: item.correctness, color: "var(--accent)", soft: "var(--accent-soft)" },
    { label: "Clarity",     value: item.clarity,     color: "var(--cyan)",   soft: "var(--cyan-soft)"   },
    { label: "Confidence",  value: item.confidence,  color: "var(--emerald)", soft: "var(--emerald-soft)" },
  ];

  if (loading) {
    return (
      <>
        <style>{appStyles}</style>
        <div className="pw-loading">
          <div className="pw-loading-spinner" />
          <div className="pw-loading-text">Loading your results…</div>
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
            <span className="pw-topnav-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>Prep<em>Wise</em></span>
            <div className="pw-topnav-links">
              <button className="pw-topnav-link" onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button className="pw-topnav-link" onClick={() => navigate("/ats")}>ATS</button>
              <button className="pw-topnav-link" onClick={() => navigate("/interview")}>Interview</button>
              <button className="pw-topnav-link active" onClick={() => navigate("/results")}>Results</button>
            </div>
          </div>
          <div className="pw-topnav-right">
            <button className="pw-btn pw-btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={() => navigate("/interview")}>
              New Interview <FiArrowRight size={13} />
            </button>
          </div>
        </nav>

        <div className="pw-page">

          {/* HEADER */}
          <div className="pw-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="pw-page-label">Interview Results</div>
              <h1 className="pw-page-title">Your <em>track record.</em></h1>
              <p className="pw-page-sub">Every answer, score, and piece of AI feedback — all in one place.</p>
            </div>
            {results.length > 0 && (
              <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "16px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", lineHeight: 1, background: "linear-gradient(135deg, var(--text) 40%, var(--accent) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {results.length}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>Questions</div>
                </div>
                <div style={{ width: 1, height: 40, background: "var(--border)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", lineHeight: 1, color: "var(--emerald)" }}>
                    {(results.reduce((acc, r) => acc + (((r.correctness || 0) + (r.clarity || 0) + (r.confidence || 0)) / 3), 0) / results.length).toFixed(1)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>Avg Score</div>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS */}
          {results.length === 0 ? (
            <div className="pw-card">
              <div className="pw-empty">
                <div className="pw-empty-icon">🎙️</div>
                <div className="pw-empty-title">No results yet</div>
                <div className="pw-empty-text">Complete a mock interview to see your scores and feedback here.</div>
                <button className="pw-btn pw-btn-primary" style={{ marginTop: 24 }} onClick={() => navigate("/interview")}>
                  Start your first interview <FiArrowRight />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {results.map((item, index) => {
                const avg = parseFloat(avgScore(item));
                const isOpen = expanded === index;
                return (
                  <div
                    key={index}
                    className="pw-card"
                    style={{ padding: 0, overflow: "hidden", animation: `fade-up 0.4s ${index * 0.06}s ease both` }}
                  >
                    {/* COLLAPSED HEADER — always visible */}
                    <div
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "22px 28px", cursor: "pointer", gap: 16,
                      }}
                      onClick={() => setExpanded(isOpen ? null : index)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                          background: `${scoreColor(avg)}18`, border: `1px solid ${scoreColor(avg)}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--serif)", fontSize: "0.95rem", color: scoreColor(avg),
                        }}>
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <p style={{ fontSize: "0.92rem", color: "var(--muted-2)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 480 }}>
                          {item.question}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: scoreColor(avg), lineHeight: 1 }}>{avg}</div>
                          <div style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>avg / 10</div>
                        </div>
                        <span className="pw-badge pw-badge-accent">AI Evaluated</span>
                        <div style={{
                          width: 28, height: 28, borderRadius: 7,
                          background: "var(--surface-2)", border: "1px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--muted)", fontSize: "0.8rem",
                          transition: "transform 0.2s",
                          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        }}>
                          ›
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED BODY */}
                    {isOpen && (
                      <div style={{ borderTop: "1px solid var(--border)", padding: "28px 28px 32px", animation: "fade-in 0.25s ease" }}>

                        {/* Q&A */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px" }}>
                            <div className="pw-field-label" style={{ marginBottom: 10, color: "#A5B4FC" }}>
                              <FiMessageSquare size={11} style={{ marginRight: 5, verticalAlign: "middle" }} /> Question
                            </div>
                            <p style={{ fontSize: "0.88rem", color: "var(--muted-2)", lineHeight: 1.65 }}>{item.question}</p>
                          </div>
                          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px" }}>
                            <div className="pw-field-label" style={{ marginBottom: 10, color: "var(--cyan)" }}>
                              <FiUser size={11} style={{ marginRight: 5, verticalAlign: "middle" }} /> Your Answer
                            </div>
                            <p style={{ fontSize: "0.88rem", color: "var(--muted-2)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{item.answer}</p>
                          </div>
                        </div>

                        {/* Score cards */}
                        <div className="pw-grid-3" style={{ marginBottom: 20 }}>
                          {scoreCards(item).map((s, i) => (
                            <div key={i} className="pw-score-mini" style={{ border: `1px solid ${s.soft}` }}>
                              <div className="pw-score-mini-label">{s.label}</div>
                              <div className="pw-score-mini-val" style={{ color: s.color }}>
                                {s.value}<span style={{ fontSize: "1rem", color: "var(--muted)", fontFamily: "var(--sans)" }}>/10</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Feedback */}
                        <div style={{ background: "var(--surface-2)", border: `1px solid var(--gold-soft)`, borderRadius: 14, padding: "18px 20px" }}>
                          <div className="pw-field-label" style={{ marginBottom: 10, color: "var(--gold)" }}>AI Feedback</div>
                          <p style={{ fontSize: "0.9rem", color: "var(--muted-2)", lineHeight: 1.7 }}>{item.feedback}</p>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Results;