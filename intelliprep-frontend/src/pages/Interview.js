import { useEffect, useRef, useState } from "react";

function Interview() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const [interviewId, setInterviewId] = useState(null);

  const recognitionRef = useRef(null);

  // 🚀 Start interview when page loads
  useEffect(() => {
    startInterview();
  }, []);

  // 🎯 Start interview session + generate questions
  const startInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Create interview session
      const interviewResponse = await fetch(
        "http://localhost:3000/api/mock-interview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: null
        }
      );

      const interviewData = await interviewResponse.json();

      setInterviewId(interviewData.interviewId);

      // 2️⃣ Generate questions
     const questionResponse = await fetch(
        "http://localhost:3000/api/questions/generate",
        {
            method: "POST",
            headers: {
                    Authorization: `Bearer ${token}`
            }
        }
        );

      const questionData = await questionResponse.json();

      setQuestions(questionData.questions || []);

    } catch (err) {
      console.error("Interview start failed:", err);
    }
  };

  // 🎙️ Start speech recognition
  const startSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswer(finalTranscript + interimTranscript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ⏹️ Stop speech recognition
  const stopSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // 📤 Submit answer
  const submitAnswer = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/mock-interview/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            interviewId,
            question: questions[currentIndex],
            answer
          })
        }
      );

      const data = await response.json();

      setResult(data);

    } catch (err) {
      console.error("Answer submission failed:", err);
    }
  };

  // ⏭️ Next question
  const nextQuestion = () => {
    setAnswer("");
    setResult(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Interview completed 🎉");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🎙️ Mock Interview</h2>

      {questions.length === 0 ? (
        <p>Generating questions...</p>
      ) : (
        <div>
          <h3>
            Question {currentIndex + 1} of {questions.length}
          </h3>

          <p>
            <strong>{questions[currentIndex]}</strong>
          </p>

          <button onClick={startSpeech}>
            🎙️ Start Speaking
          </button>

          <button
            onClick={stopSpeech}
            style={{ marginLeft: "10px" }}
          >
            ⏹️ Stop
          </button>

          <br /><br />

          <textarea
            rows="6"
            cols="70"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
          />

          <br /><br />

          <button onClick={submitAnswer}>
            Submit Answer
          </button>

          {/* 📊 Evaluation */}
          {result && (
            <div style={{ marginTop: "30px" }}>
              <h3>📊 Evaluation</h3>

              <p>
                Correctness: {result.correctness}/10
              </p>

              <p>
                Clarity: {result.clarity}/10
              </p>

              <p>
                Confidence: {result.confidence}/10
              </p>

              <p>
                <strong>Feedback:</strong> {result.feedback}
              </p>

              <button
                onClick={nextQuestion}
                style={{ marginTop: "20px" }}
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Interview;