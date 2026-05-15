import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      const token = localStorage.getItem("token");

      // 📊 ATS analytics
      const analyticsResponse = await fetch(
        "http://localhost:3000/api/analytics/ats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const analyticsData =
        await analyticsResponse.json();

      // 🎙️ Interview summary
      const resultsResponse = await fetch(
        "http://localhost:3000/api/mock-interview/results",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resultsData =
        await resultsResponse.json();

      // 👤 User profile
      const profileResponse = await fetch(
        "http://localhost:3000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const profileData =
        await profileResponse.json();
      console.log("PROFILE DATA:", profileData);
      console.log("USER STATE:", user);
      setAnalytics(analyticsData);
      setSummary(resultsData.summary || null);
      setUser(profileData);

    } catch (error) {

      console.error(
        "Dashboard fetch error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Latest ATS Score",
      value: analytics?.latestScore || "N/A",
      icon: "📄"
    },
    {
      title: "ATS Checks",
      value: analytics?.totalChecks || 0,
      icon: "📊"
    },
    {
      title: "Readiness Level",
      value: summary?.readinessLevel || "N/A",
      icon: "🚀"
    },
    {
      title: "Avg Confidence",
      value: summary
        ? `${summary.avgConfidence}/10`
        : "N/A",
      icon: "🧠"
    }
  ];

  const actions = [
    {
      title: "ATS Checker",
      description:
        "Analyze your resume against job descriptions.",
      button: "Open ATS"
    },
    {
      title: "Mock Interview",
      description:
        "Practice AI-powered technical interviews.",
      button: "Start Interview"
    },
    {
      title: "Interview Results",
      description:
        "Review previous interview performance.",
      button: "View Results"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="text-slate-400 text-lg">
            Track your ATS performance and prepare smarter interviews.
          </p>
        </div>

        <button className="bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/20">
          Upgrade Readiness
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-all duration-300"
          >

            <div className="text-3xl mb-4">
              {item.icon}
            </div>

            <p className="text-slate-400 text-sm mb-1">
              {item.title}
            </p>

            <h2 className="text-3xl font-bold">
              {item.value}
            </h2>

          </div>

        ))}

      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-2xl font-bold mb-1">
                AI Interview Insights
              </h2>

              <p className="text-slate-400">
                Your interview preparation summary.
              </p>
            </div>

            <div className="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl text-sm font-semibold">
              Updated Today
            </div>

          </div>

          <div className="space-y-6">

            {/* Readiness */}
            <div>

              <div className="flex justify-between mb-2">
                <span className="text-slate-300">
                  Readiness Score
                </span>

                <span className="font-bold text-indigo-300">
                  {summary?.readinessScore || 0}%
                </span>
              </div>

              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${summary?.readinessScore || 0}%`
                  }}
                ></div>

              </div>

            </div>

            {/* Clarity */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-slate-300">
                  Communication Clarity
                </span>

                <span className="font-bold text-cyan-300">
                  {summary
                    ? `${summary.avgClarity * 10}%`
                    : "0%"}
                </span>

              </div>

              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{
                    width: `${summary?.avgClarity * 10 || 0}%`
                  }}
                ></div>

              </div>

            </div>

            {/* Confidence */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-slate-300">
                  Technical Confidence
                </span>

                <span className="font-bold text-emerald-300">
                  {summary
                    ? `${summary.avgConfidence * 10}%`
                    : "0%"}
                </span>

              </div>

              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${summary?.avgConfidence * 10 || 0}%`
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>

        {/* Right */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">

          <h2 className="text-2xl font-bold mb-6">
            Quick Actions ⚡
          </h2>

          <div className="space-y-5">

            {actions.map((item, index) => (

              <div
                key={index}
                className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5"
              >

                <h3 className="text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-slate-400 text-sm mb-4">
                  {item.description}
                </p>

                <button
                  onClick={() => {

                    if (item.title === "ATS Checker") {
                      navigate("/ats");
                    }

                    else if (
                      item.title === "Mock Interview"
                    ) {
                      navigate("/interview");
                    }

                    else {
                      navigate("/results");
                    }

                  }}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 py-2 rounded-xl font-medium"
                >
                  {item.button}
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}