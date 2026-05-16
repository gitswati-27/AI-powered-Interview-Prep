import { useState } from "react";
import toast from "react-hot-toast";

function ATS() {

  const [file, setFile] = useState(null);

  const [jobDescription,
    setJobDescription] = useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleCheckATS = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const formData = new FormData();

      formData.append("resume", file);

      formData.append(
        "jobDescription",
        jobDescription
      );

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/ats/check`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

      const data =
        await response.json();

      setResult(data);

      toast.success(
        "ATS analysis completed 🚀"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "ATS check failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">

        <h1 className="text-5xl font-bold mb-3">
          ATS Resume Analyzer
        </h1>

        <p className="text-slate-400 text-lg">
          Upload your resume and compare it against job descriptions using AI-powered ATS evaluation.
        </p>

      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Upload Resume
          </h2>

          {/* Upload Box */}
          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-400 transition-all duration-300 rounded-3xl p-10 cursor-pointer bg-slate-950/50 mb-6">

            <div className="text-5xl mb-4">
              📂
            </div>

            <p className="text-lg font-medium mb-2">
              Click to upload PDF
            </p>

            <p className="text-slate-400 text-sm">
              PDF resumes only
            </p>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
            />

          </label>

          {/* File Name */}
          {file && (

            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-2xl px-4 py-3 mb-6">

              Selected:
              {" "}
              <span className="font-semibold">
                {file.name}
              </span>

            </div>

          )}

          {/* Job Description */}
          <textarea
            rows="8"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5 text-white outline-none focus:border-indigo-400 resize-none"
          />

          {/* Button */}
          <button
            onClick={handleCheckATS}
            disabled={loading}
            className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 transition-all duration-300 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-500/20"
          >

            {loading
              ? "Analyzing..."
              : "Analyze Resume"}

          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Results:
          </h2>

          {!result ? (

            <div className="h-full flex items-center justify-center text-slate-500 text-lg text-center">

              Upload your resume and run analysis to view ATS insights.

            </div>

          ) : (

            <div>

              {/* Score */}
              <div className="text-center mb-8">

                <div className="w-40 h-40 rounded-full border-[10px] border-indigo-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20">

                  <span className="text-5xl font-bold">
                    {result.atsScore}%
                  </span>

                </div>

                <p className="text-slate-400">
                  ATS Compatibility Score
                </p>

              </div>

              {/* Matched */}
              <div className="mb-6">

                <h3 className="text-xl font-semibold text-emerald-300 mb-4">

                  Matched Keywords

                </h3>

                <div className="flex flex-wrap gap-3">

                  {result.matchedKeywords?.map(
                    (k, i) => (

                      <span
                        key={i}
                        className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm"
                      >
                        {k}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* Missing */}
              <div className="mb-6">

                <h3 className="text-xl font-semibold text-red-300 mb-4">

                  Missing Keywords

                </h3>

                <div className="flex flex-wrap gap-3">

                  {result.missingKeywords?.map(
                    (k, i) => (

                      <span
                        key={i}
                        className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm"
                      >
                        {k}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* Feedback */}
              <div>

                <h3 className="text-xl font-semibold mb-4">

                  AI Feedback

                </h3>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 text-slate-300 leading-relaxed">

                  {result.feedback}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ATS;