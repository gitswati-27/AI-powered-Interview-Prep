import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMic, FiSquare, FiArrowRight, FiChevronRight } from "react-icons/fi";
import { appStyles } from "./appStyles";

function Interview() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => { startInterview(); }, []);

  const startInterview = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = (extra = {}) => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra });

      const interviewRes = await fetch(`${process.env.REACT_APP_API_URL}/api/mock-interview/start`, {
        method: "POST", headers: headers(), body: null,
      });
      const interviewData = await interviewRes.json();
      setInterviewId(interviewData.interviewId);

      const questionRes = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/generate`, {
        method: "POST", headers: headers(),
      });
      const questionData = await questionRes.json();
      console.log(questionData);
      setQuestions(questionData.questions || []);
    } catch (err) {
      console.error("Interview start failed:", err);
      toast.error("Failed to start interview");
    }
  };

  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Speech recognition not supported"); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      setAnswer(finalTranscript + interimTranscript);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    toast.success("Listening…");
  };

  const stopSpeech = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setListening(false); }
  };

  const submitAnswer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mock-interview/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ interviewId, question: questions[currentIndex], answer }),
      });
      const data = await response.json();
      setResult(data);
      toast.success("Answer evaluated");
    } catch (err) {
      console.error("Answer submission failed:", err);
      toast.error("Submission failed");
    }
  };

  const nextQuestion = () => {
    setAnswer(""); setResult(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success("Interview complete!");
    }
  };

  const scoreCards = result ? [
    { label: "Correctness", value: result.correctness, color: "var(--accent)", soft: "var(--accent-soft)" },
    { label: "Clarity", value: result.clarity, color: "var(--cyan)", soft: "var(--cyan-soft)" },
    { label: "Confidence", value: result.confidence, color: "var(--emerald)", soft: "var(--emerald-soft)" },
  ] : [];

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
              <button className="pw-topnav-link active" onClick={() => navigate("/interview")}>Interview</button>
              <button className="pw-topnav-link" onClick={() => navigate("/results")}>Results</button>
            </div>
          </div>
        </nav>

        <div className="pw-page" style={{ maxWidth: 900 }}>

          {/* HEADER */}
          <div className="pw-page-header">
            <div className="pw-page-label">Mock Interview</div>
            <h1 className="pw-page-title">Think out <em>loud.</em></h1>
            <p className="pw-page-sub">AI-evaluated answers with real-time speech recognition. Take your time — quality beats speed.</p>
          </div>

          {questions.length === 0 ? (
            <div className="pw-card">
              <div className="pw-empty">
                <div className="pw-loading-spinner" />
                <div className="pw-empty-title" style={{ marginTop: 20 }}>Generating your questions…</div>
                <div className="pw-empty-text">Hang tight, this usually takes a few seconds.</div>
              </div>
            </div>
          ) : (
            <div>

              {/* PROGRESS */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 999,
                    background: i < currentIndex ? "var(--accent)" : i === currentIndex ? "var(--accent)" : "var(--surface-3)",
                    opacity: i === currentIndex ? 1 : i < currentIndex ? 0.6 : 0.3,
                    transition: "background 0.3s",
                  }} />
                ))}
                <span style={{ fontSize: "0.8rem", color: "var(--muted-2)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>

              {/* QUESTION CARD */}
              <div className="pw-card" style={{ padding: "32px 36px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span className="pw-badge pw-badge-accent">Question {currentIndex + 1}</span>
                  {listening && (
                    <span className="pw-badge pw-badge-red" style={{ animation: "fade-in 0.2s ease" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", display: "inline-block", animation: "pulse-dot 1.2s infinite" }} />
                      Listening
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "1.15rem", lineHeight: 1.65, fontWeight: 400, color: "var(--text)" }}>
                  {questions[currentIndex]}
                </p>
              </div>

              {/* ANSWER AREA */}
              <div className="pw-card" style={{ padding: "28px 36px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <label className="pw-field-label" style={{ margin: 0 }}>Your Answer</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="pw-btn pw-btn-primary"
                      style={{ padding: "8px 18px", fontSize: "0.85rem", gap: 7 }}
                      onClick={startSpeech}
                      disabled={listening}
                    >
                      <FiMic size={14} /> {listening ? "Listening…" : "Start"}
                    </button>
                    <button
                      className="pw-btn pw-btn-danger"
                      style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                      onClick={stopSpeech}
                      disabled={!listening}
                    >
                      <FiSquare size={13} /> Stop
                    </button>
                  </div>
                </div>
                <textarea
                  className="pw-textarea"
                  rows={7}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Speak or type your answer here…"
                />
              </div>

              <button
                className="pw-btn pw-btn-primary pw-btn-full pw-btn-lg"
                onClick={submitAnswer}
                disabled={!answer.trim()}
              >
                Submit Answer <FiArrowRight />
              </button>

              {/* EVALUATION */}
              {result && (
                <div style={{ marginTop: 28, animation: "fade-up 0.4s ease" }}>
                  <div style={{ marginBottom: 20 }}>
                    <div className="pw-page-label">Evaluation</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", letterSpacing: "-0.01em" }}>Here's how you did.</div>
                  </div>

                  {/* Score Cards */}
                  <div className="pw-grid-3" style={{ marginBottom: 20 }}>
                    {scoreCards.map((s, i) => (
                      <div key={i} className="pw-score-mini" style={{ border: `1px solid ${s.soft}` }}>
                        <div className="pw-score-mini-label">{s.label}</div>
                        <div className="pw-score-mini-val" style={{ color: s.color }}>{s.value}<span style={{ fontSize: "1rem", color: "var(--muted)", fontFamily: "var(--sans)" }}>/10</span></div>
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div className="pw-card" style={{ marginBottom: 16, padding: "24px 28px" }}>
                    <div className="pw-field-label" style={{ marginBottom: 12 }}>AI Feedback</div>
                    <p style={{ color: "var(--muted-2)", fontSize: "0.92rem", lineHeight: 1.7 }}>{result.feedback}</p>
                  </div>

                  <button className="pw-btn pw-btn-success pw-btn-full pw-btn-lg" onClick={nextQuestion}>
                    {currentIndex < questions.length - 1 ? <>Next Question <FiChevronRight /></> : "Finish Interview"}
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Interview;