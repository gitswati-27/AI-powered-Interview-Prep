import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiMail,
  FiLock
} from "react-icons/fi";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      toast.error("Something went wrong");
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-bold text-white mb-3">
            PrepWise
          </h1>

          <p className="text-slate-300">
            A platform for AI-assisted preparation
          </p>

        </div>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Welcome Back!
        </h2>

        {/* Email */}
        <div className="relative mb-5">

          <FiMail className="absolute left-4 top-4 text-slate-400" />

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-slate-900/70 text-white border border-slate-700 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-400 transition-all"
          />

        </div>

        {/* Password */}
        <div className="relative mb-6">

          <FiLock className="absolute left-4 top-4 text-slate-400" />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-slate-900/70 text-white border border-slate-700 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-400 transition-all"
          />

        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-500/30"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-slate-300 text-center mt-6">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-indigo-300 hover:text-indigo-200 font-semibold"
          >
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;