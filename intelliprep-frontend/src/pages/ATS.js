import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiUpload, FiX, FiCheck } from "react-icons/fi";
import { appStyles } from "./appStyles";

function ATS() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleCheckATS = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ats/check`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      toast.success("ATS analysis complete");
    } catch (err) {
      console.error(err);
      toast.error("ATS check failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else toast.error("Please upload a PDF");
  };

  const scoreColor = (s) => {
    if (s >= 75) return "var(--emerald)";
    if (s >= 50) return "var(--gold)";
    return "var(--red)";
  };

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
              <button className="pw-topnav-link active" onClick={() => navigate("/ats")}>ATS</button>
              <button className="pw-topnav-link" onClick={() => navigate("/interview")}>Interview</button>
              <button className="pw-topnav-link" onClick={() => navigate("/results")}>Results</button>
            </div>
          </div>
        </nav>

        <div className="pw-page">

          {/* HEADER */}
          <div className="pw-page-header">
            <div className="pw-page-label">ATS Analyzer</div>
            <h1 className="pw-page-title">Resume <em>Intelligence.</em></h1>
            <p className="pw-page-sub">Upload your resume and a job description — our AI scores your ATS compatibility and surfaces what's missing.</p>
          </div>

          {/* MAIN GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* LEFT — Input */}
            <div className="pw-card" style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 0 }}>

              {/* Upload */}
              <div className="pw-field">
                <label className="pw-field-label">Resume (PDF)</label>
                <label
                  className="pw-upload-box"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={dragOver ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : {}}
                >
                  <div className="pw-upload-icon">
                    {file ? "📄" : <FiUpload style={{ fontSize: "1.8rem", color: "var(--muted)" }} />}
                  </div>
                  <div className="pw-upload-title">{file ? file.name : "Drop your PDF here"}</div>
                  <div className="pw-upload-hint">{file ? "Click to replace" : "or click to browse"}</div>
                  <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>

              {/* File pill */}
              {file && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--accent-soft)", border: "1px solid rgba(91,110,245,0.25)",
                  borderRadius: 10, padding: "10px 16px", marginBottom: 18,
                }}>
                  <span style={{ fontSize: "0.85rem", color: "#A5B4FC" }}>
                    <FiCheck size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
                    {file.name}
                  </span>
                  <FiX size={15} style={{ color: "var(--muted)", cursor: "pointer" }} onClick={() => setFile(null)} />
                </div>
              )}

              {/* JD */}
              <div className="pw-field" style={{ flex: 1 }}>
                <label className="pw-field-label">Job Description</label>
                <textarea
                  className="pw-textarea"
                  rows={10}
                  placeholder="Paste the full job description here — the more detail, the better the analysis…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* Submit */}
              <button
                className="pw-btn pw-btn-primary pw-btn-full pw-btn-lg"
                style={{ marginTop: 8 }}
                onClick={handleCheckATS}
                disabled={loading || !file || !jobDescription.trim()}
              >
                {loading ? "Analyzing…" : <>Analyze Resume <FiArrowRight /></>}
              </button>
            </div>

            {/* RIGHT — Results */}
            <div className="pw-card" style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div className="pw-card-title">Analysis Results</div>
                {result && <span className="pw-badge pw-badge-emerald"><FiCheck size={11} /> Complete</span>}
              </div>

              {!result ? (
                <div className="pw-empty">
                  <div className="pw-empty-icon">📊</div>
                  <div className="pw-empty-title">No analysis yet</div>
                  <div className="pw-empty-text">Upload your resume and paste a job description, then hit Analyze.</div>
                </div>
              ) : (
                <div style={{ animation: "fade-in 0.4s ease" }}>

                  {/* Score */}
                  <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32, padding: "20px 24px", background: "var(--surface-2)", borderRadius: 16, border: "1px solid var(--border)" }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: "50%", flexShrink: 0,
                      border: `5px solid ${scoreColor(result.atsScore)}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 24px ${scoreColor(result.atsScore)}40`,
                    }}>
                      <span style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", lineHeight: 1, color: "var(--text)" }}>{result.atsScore}%</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-2)", marginBottom: 6 }}>ATS Compatibility Score</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: scoreColor(result.atsScore) }}>
                        {result.atsScore >= 75 ? "Strong match" : result.atsScore >= 50 ? "Moderate match" : "Needs work"}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4 }}>
                        {result.matchedKeywords?.length || 0} matched · {result.missingKeywords?.length || 0} missing
                      </div>
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  <div style={{ marginBottom: 24 }}>
                    <div className="pw-field-label" style={{ marginBottom: 12 }}>
                      <FiCheck size={11} style={{ marginRight: 5, color: "var(--emerald)", verticalAlign: "middle" }} />
                      Matched Keywords
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.matchedKeywords?.map((k, i) => (
                        <span key={i} className="pw-chip pw-chip-match">{k}</span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div style={{ marginBottom: 24 }}>
                    <div className="pw-field-label" style={{ marginBottom: 12 }}>
                      <FiX size={11} style={{ marginRight: 5, color: "var(--red)", verticalAlign: "middle" }} />
                      Missing Keywords
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.missingKeywords?.map((k, i) => (
                        <span key={i} className="pw-chip pw-chip-miss">{k}</span>
                      ))}
                    </div>
                  </div>

                  <hr className="pw-divider" />

                  {/* AI Feedback */}
                  <div>
                    <div className="pw-field-label" style={{ marginBottom: 12 }}>AI Feedback</div>
                    <div style={{
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      borderRadius: 14, padding: "18px 20px",
                      color: "var(--muted-2)", fontSize: "0.9rem", lineHeight: 1.7,
                    }}>
                      {result.feedback}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ATS;