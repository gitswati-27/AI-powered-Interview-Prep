import { useState } from "react";

function ATS() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const handleCheckATS = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", file);   // 👈 FILE
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        "http://localhost:3000/api/ats/check",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("ATS check failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>📄 ATS Checker</h2>

      {/* 📂 File Upload */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      {/* 📝 JD */}
      <textarea
        rows="6"
        cols="60"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCheckATS}>
        Check ATS
      </button>

      {/* 📊 Result */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>📊 Result</h3>

          <p><strong>Score:</strong> {result.atsScore}</p>

          <p><strong>Matched Keywords:</strong></p>
          <ul>
            {result.matchedKeywords?.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>

          <p><strong>Missing Keywords:</strong></p>
          <ul>
            {result.missingKeywords?.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>

          <p><strong>Feedback:</strong> {result.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default ATS;