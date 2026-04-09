import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const cardRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto hide error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 🔥 Soft 3D tilt (subtle)
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 6;
    const rotateY = (x / rect.width - 0.5) * -6;

    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = () => {
    cardRef.current.style.transform = `rotateX(0) rotateY(0)`;
  };

  const handleLogin = async () => {
    if (!email || !password || !role) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", { email, password });

      const token = res.data.token;
      const userRole = res.data.user.role;
      const userId = res.data.user._id;

      if (userRole !== role) {
        setError(`Access denied: login as ${userRole}`);
        return;
      }

      setSuccess(true);

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", userId);

      setTimeout(() => {
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "teacher") navigate("/teacher");
        else navigate("/student");
      }, 800);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Soft Glow Background */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[350px] h-[350px] bg-blue-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        className={`relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl p-10 rounded-3xl w-full max-w-md text-white transition-all duration-300 ${
          success ? "ring-2 ring-green-400 shadow-green-500/30" : ""
        }`}
      >
        {/* Title */}
        <h2 className="text-4xl font-semibold text-center mb-2 tracking-tight">
          UPR LMS
        </h2>

        <p className="text-center text-sm mb-6 text-gray-400">
          Secure role-based login
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 text-red-300 rounded-xl text-sm animate-shake">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex bg-white/5 p-1 rounded-full mb-6 border border-white/10">
          {["admin", "teacher", "student"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-full text-sm transition-all ${
                role === r
                  ? "bg-white text-black font-medium shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-500"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            `Login as ${role || "..."}`
          )}
        </button>
        {/* Register */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            New student?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-400 hover:text-purple-300 cursor-pointer transition"
            >
              Create account
            </span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">© 2026 UPR LMS</p>
      </div>

      {/* Shake animation */}
      <style>
        {`
     @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      50% { transform: translateX(4px); }
      75% { transform: translateX(-4px); }
      100% { transform: translateX(0); }
     }
     .animate-shake {
      animation: shake 0.25s;
     }
    `}
      </style>
    </div>
  );
}

export default Login;
