import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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

      const token =
        localStorage.getItem("token");

      // 1️⃣ Create interview session
      const interviewResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/mock-interview/start`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: null
        }
      );

      const interviewData =
        await interviewResponse.json();

      setInterviewId(
        interviewData.interviewId
      );

      // 2️⃣ Generate questions
      const questionResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/questions/generate`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const questionData =
        await questionResponse.json();

      console.log(questionData);

      setQuestions(
        questionData.questions || []
      );

    } catch (err) {

      console.error(
        "Interview start failed:",
        err
      );

      toast.error(
        "Failed to start interview"
      );
    }
  };

  // 🎙️ ORIGINAL WORKING SPEECH LOGIC
  const startSpeech = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      toast.error(
        "Speech recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = true;

    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onresult = (event) => {

      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {

          finalTranscript +=
            transcript + " ";

        } else {

          interimTranscript += transcript;
        }
      }

      // ✅ LIVE UPDATE WHILE SPEAKING
      setAnswer(
        finalTranscript +
        interimTranscript
      );
    };

    recognition.start();

    recognitionRef.current =
      recognition;

    toast.success(
      "Listening started 🎙️"
    );
  };

  // ⏹️ Stop speech recognition
  const stopSpeech = () => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

      toast.success(
        "Listening stopped"
      );
    }
  };

  // 📤 Submit answer
  const submitAnswer = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/mock-interview/answer`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            interviewId,
            question:
              questions[currentIndex],
            answer
          })
        }
      );

      const data =
        await response.json();

      setResult(data);

      toast.success(
        "Answer evaluated 🚀"
      );

    } catch (err) {

      console.error(
        "Answer submission failed:",
        err
      );

      toast.error(
        "Submission failed"
      );
    }
  };

  // ⏭️ Next question
  const nextQuestion = () => {

    setAnswer("");

    setResult(null);

    if (
      currentIndex <
      questions.length - 1
    ) {

      setCurrentIndex(
        currentIndex + 1
      );

    } else {

      toast.success(
        "Interview completed!"
      );
      //navigate("/dashboard");
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Mock Interview
        </h1>

        <p className="text-slate-400 text-lg">
          Practice technical interviews with AI-powered evaluation and speech analysis.
        </p>

      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl">

        {questions.length === 0 ? (

          <div className="text-center text-slate-400 text-xl py-20">

            Generating questions...

          </div>

        ) : (

          <div>

            {/* Top */}
            <div className="flex items-center justify-between mb-8">

              <h2 className="text-3xl font-bold">

                Question {currentIndex + 1}

              </h2>

              <div className="bg-indigo-500/20 text-indigo-300 px-5 py-2 rounded-2xl font-semibold">

                {currentIndex + 1}
                {" / "}
                {questions.length}

              </div>

            </div>

            {/* Question */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 mb-8">

              <p className="text-xl leading-relaxed font-medium">

                {questions[currentIndex]}

              </p>

            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">

              <button
                onClick={startSpeech}
                className="bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/20"
              >
                Start
              </button>

              <button
                onClick={stopSpeech}
                className="bg-red-500 hover:bg-red-400 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
              >
                Stop
              </button>

            </div>

            {/* Textarea */}
            <textarea
              rows="8"
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Your answer..."
              className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5 text-white outline-none focus:border-indigo-400 resize-none mb-6"
            />

            {/* Submit */}
            <button
              onClick={submitAnswer}
              className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-500/20"
            >
              Submit Answer
            </button>

            {/* 📊 Evaluation */}
            {result && (

              <div className="mt-10">

                <h3 className="text-3xl font-bold mb-6">

                  Evaluation

                </h3>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center">

                    <h4 className="text-slate-400 mb-3">

                      Correctness

                    </h4>

                    <p className="text-5xl font-bold text-indigo-300">

                      {result.correctness}/10

                    </p>

                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center">

                    <h4 className="text-slate-400 mb-3">

                      Clarity

                    </h4>

                    <p className="text-5xl font-bold text-cyan-300">

                      {result.clarity}/10

                    </p>

                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center">

                    <h4 className="text-slate-400 mb-3">

                      Confidence

                    </h4>

                    <p className="text-5xl font-bold text-emerald-300">

                      {result.confidence}/10

                    </p>

                  </div>

                </div>

                {/* Feedback */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 mb-6">

                  <h4 className="text-2xl font-bold mb-4">

                    Feedback:

                  </h4>

                  <p className="text-slate-300 leading-relaxed">

                    {result.feedback}

                  </p>

                </div>

                {/* Next */}
                <button
                  onClick={nextQuestion}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 py-4 rounded-2xl font-semibold"
                >
                  Next Question →
                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Interview;