import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiUser,
  FiMail,
  FiLock
} from "react-icons/fi";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const handleSignup = async () => {

    try {

      // ✅ Password match check
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        toast.error(
          data.message ||
          "Signup failed"
        );

        return;
      }

      toast.success("Signup successful!");
      toast.success("Please login!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.error(error);

      toast.error("Something went wrong");
    }
  };

  // 🔥 Shared input style
  const inputStyle =
    "w-full bg-slate-900/70 text-white border border-slate-700 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-400 transition-all";

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-12 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-5xl font-bold text-white mb-3">
            PrepWise
          </h1>

          <p className="text-slate-300">
            A platform for AI-assisted preparation
          </p>

        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Create Account
        </h2>

        {/* Name */}
        <div className="relative mb-5">

          <FiUser className="absolute left-4 top-4 text-slate-400 text-lg" />

          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className={inputStyle}
          />

        </div>

        {/* Email */}
        <div className="relative mb-5">

          <FiMail className="absolute left-4 top-4 text-slate-400 text-lg" />

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className={inputStyle}
          />

        </div>

        {/* Password */}
        <div className="relative mb-5">

          <FiLock className="absolute left-4 top-4 text-slate-400 text-lg" />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className={inputStyle}
          />

        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">

          <FiLock className="absolute left-4 top-4 text-slate-400 text-lg" />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className={inputStyle}
          />

        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-500/30"
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-slate-300 text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-indigo-300 hover:text-indigo-200 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;