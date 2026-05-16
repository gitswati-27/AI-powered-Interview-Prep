import { useEffect, useState } from "react";

function Results() {

  const [results, setResults] =
    useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/mock-interview/results`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      console.log(
        "Results:",
        data
      );

      setResults(
        data.answers || []
      );

    } catch (error) {

      console.error(
        "Failed to fetch results:",
        error
      );
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">

        <h1 className="text-5xl font-bold mb-3">

          Interview Results

        </h1>

        <p className="text-slate-400 text-lg">

          Review your AI interview evaluations, scores, and feedback insights.

        </p>

      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">

        {results.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-16 text-center text-slate-400 text-xl shadow-2xl">

            No interview results yet.

          </div>

        ) : (

          <div className="space-y-8">

            {results.map(
              (item, index) => (

                <div
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl"
                >

                  {/* Top */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

                    <h2 className="text-3xl font-bold mb-4 md:mb-0">

                      Question {index + 1}

                    </h2>

                    <div className="bg-indigo-500/20 text-indigo-300 px-5 py-2 rounded-2xl font-semibold w-fit">

                      AI Evaluated

                    </div>

                  </div>

                  {/* Question */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 mb-6">

                    <h3 className="text-xl font-semibold mb-3 text-indigo-300">

                      Question

                    </h3>

                    <p className="text-slate-300 leading-relaxed">

                      {item.question}

                    </p>

                  </div>

                  {/* Answer */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 mb-8">

                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">

                      Your Answer

                    </h3>

                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">

                      {item.answer}

                    </p>

                  </div>

                  {/* Score Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Correctness */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center">

                      <h4 className="text-slate-400 mb-3">

                        Correctness

                      </h4>

                      <p className="text-5xl font-bold text-indigo-300">

                        {item.correctness}/10

                      </p>

                    </div>

                    {/* Clarity */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center">

                      <h4 className="text-slate-400 mb-3">

                        Clarity

                      </h4>

                      <p className="text-5xl font-bold text-cyan-300">

                        {item.clarity}/10

                      </p>

                    </div>

                    {/* Confidence */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center">

                      <h4 className="text-slate-400 mb-3">

                        Confidence

                      </h4>

                      <p className="text-5xl font-bold text-emerald-300">

                        {item.confidence}/10

                      </p>

                    </div>

                  </div>

                  {/* Feedback */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">

                    <h3 className="text-2xl font-bold mb-4 text-amber-300">

                      Feedback:

                    </h3>

                    <p className="text-slate-300 leading-relaxed">

                      {item.feedback}

                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Results;