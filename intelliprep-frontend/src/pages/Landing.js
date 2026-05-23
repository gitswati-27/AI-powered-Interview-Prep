import { useNavigate } from "react-router-dom";

import {
  FiFileText,
  FiMic,
  FiBarChart2,
  FiArrowRight
} from "react-icons/fi";

function Landing() {

  const navigate =
    useNavigate();

  const features = [

    {
      icon: <FiFileText />,
      title:
        "ATS Resume Analysis",

      desc:
        "Upload resumes and receive AI-powered evaluation."
    },

    {
      icon: <FiMic />,
      title:
        "AI Mock Interviews",

      desc:
        "Practice interviews with live speech recognition."
    },

    {
      icon: <FiBarChart2 />,
      title:
        "Interview Insights",

      desc:
        "Track confidence and readiness over time."
    }
  ];

  return (

<div className="min-h-screen bg-slate-950 text-white">

{/* NAVBAR */}

<div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">

<h1 className="text-3xl font-bold">

PrepWise

</h1>

<div className="flex gap-4">

<button
onClick={() =>
navigate("/login")
}
className="text-slate-300 hover:text-white"
>

Login

</button>

<button
onClick={() =>
navigate("/signup")
}
className="bg-indigo-500 px-5 py-2 rounded-xl hover:bg-indigo-400"
>

Sign Up

</button>

</div>

</div>

{/* HERO */}

<section className="max-w-6xl mx-auto text-center py-28 px-6">

<h1 className="text-7xl font-bold mb-8">

Ace Interviews with AI

</h1>

<p className="text-slate-400 text-xl mb-12">

Practice smarter with ATS analysis,
AI interviews,
and personalized feedback.

</p>

<div className="flex justify-center gap-5">

<button
onClick={() =>
navigate("/signup")
}
className="bg-indigo-500 px-8 py-4 rounded-2xl text-lg hover:bg-indigo-400"
>

Get Started

</button>

</div>

</section>

{/* FEATURES */}

<section className="max-w-6xl mx-auto px-8 py-24">

<h2 className="text-4xl font-bold mb-14">

Features

</h2>

<div className="grid md:grid-cols-3 gap-8">

{features.map(
(item, i) => (

<div
key={i}
className="bg-slate-900 rounded-3xl p-8 border border-slate-800"
>

<div className="text-indigo-400 text-3xl mb-5">

{item.icon}

</div>

<h3 className="text-2xl font-bold mb-3">

{item.title}

</h3>

<p className="text-slate-400">

{item.desc}

</p>

</div>

)
)}

</div>

</section>

{/* CTA */}

<section className="text-center py-28">

<h2 className="text-5xl font-bold mb-8">

Ready to level up?

</h2>

<button
onClick={() =>
navigate("/signup")
}
className="bg-indigo-500 px-10 py-5 rounded-2xl inline-flex items-center gap-3 hover:bg-indigo-400"
>

Start Now

<FiArrowRight />

</button>

</section>

{/* FOOTER */}

<footer className="border-t border-slate-800 text-center py-10 text-slate-500">

PrepWise © 2026

</footer>

</div>

);

}

export default Landing;