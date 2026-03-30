import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/analytics/ats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();
      setData(result);

    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>🚀 Dashboard</h2>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* 🟢 Stats Section */}
          <div style={{ marginBottom: "30px" }}>
            <h3>📊 Your Stats</h3>

            <p>Latest ATS Score: <strong>{data.latestScore ?? "N/A"}</strong></p>
            <p>Total ATS Checks: <strong>{data.totalChecks}</strong></p>
          </div>

          {/* 🎯 Actions */}
          <div>
            <h3>⚡ Actions</h3>
            <button onClick={() => navigate("/ats")}>
                Upload Resume
            </button>
            <button>
              Start Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;