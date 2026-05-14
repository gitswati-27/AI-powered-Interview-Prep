import { useEffect, useState } from "react";

function Results() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/mock-interview/results",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("Results:", data);

      setResults(data.answers || []);
    } catch (error) {

      console.error(
        "Failed to fetch results:",
        error
      );
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>📊 Interview Results</h2>

      {results.length === 0 ? (
        <p>No interview results yet.</p>
      ) : (
        results.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px"
            }}
          >
            <h3>
              Question {index + 1}
            </h3>

            <p>
              <strong>Question:</strong><br />
              {item.question}
            </p>

            <p>
              <strong>Your Answer:</strong><br />
              {item.answer}
            </p>

            <p>
              Correctness: {item.correctness}/10
            </p>

            <p>
              Clarity: {item.clarity}/10
            </p>

            <p>
              Confidence: {item.confidence}/10
            </p>

            <p>
              <strong>Feedback:</strong><br />
              {item.feedback}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Results;