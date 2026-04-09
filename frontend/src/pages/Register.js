import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register(){

 const navigate = useNavigate();
 const cardRef = useRef();

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const [loading,setLoading] = useState(false);
 const [error,setError] = useState("");
 const [success,setSuccess] = useState(false);

 // auto hide error
 useEffect(()=>{
  if(error){
   const timer = setTimeout(()=>setError(""),3000);
   return ()=>clearTimeout(timer);
  }
 },[error]);

 // tilt effect (same as login)
 const handleMouseMove = (e)=>{
  const rect = cardRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateX = (y / rect.height - 0.5) * 6;
  const rotateY = (x / rect.width - 0.5) * -6;

  cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
 };

 const resetTilt = ()=>{
  cardRef.current.style.transform = `rotateX(0) rotateY(0)`;
 };

 const handleRegister = async ()=>{

  if(!name || !email || !password){
   setError("All fields are required");
   return;
  }

  try{

   setLoading(true);
   setError("");

   await API.post("/auth/register",{
    name,
    email,
    password
   });

   setSuccess(true);

   setTimeout(()=>{
    navigate("/");
   },1500);

  }catch(err){
   setError("Registration failed");
  }finally{
   setLoading(false);
  }

 };

 return(

  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">

   {/* Glow */}
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
    <h2 className="text-4xl font-semibold text-center mb-2">
     Student Register
    </h2>

    <p className="text-center text-sm mb-6 text-gray-400">
     Request access to LMS
    </p>

    {/* Error */}
    {error && (
     <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 text-red-300 rounded-xl text-sm animate-shake">
      {error}
     </div>
    )}

    {/* Success */}
    {success && (
     <div className="mb-4 p-3 bg-green-500/10 border border-green-400/30 text-green-300 rounded-xl text-sm">
      Registration submitted. Wait for admin approval ✅
     </div>
    )}

    {/* Name */}
    <input
     placeholder="Full Name"
     value={name}
     onChange={(e)=>setName(e.target.value)}
     className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 focus:ring-1 focus:ring-purple-400"
    />

    {/* Email */}
    <input
     type="email"
     placeholder="Email"
     value={email}
     onChange={(e)=>setEmail(e.target.value)}
     className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 focus:ring-1 focus:ring-purple-400"
    />

    {/* Password */}
    <input
     type="password"
     placeholder="Password"
     value={password}
     onChange={(e)=>setPassword(e.target.value)}
     className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10 focus:ring-1 focus:ring-blue-400"
    />

    {/* Button */}
    <button
     onClick={handleRegister}
     disabled={loading}
     className="w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition"
    >
     {loading ? "Submitting..." : "Register"}
    </button>

    {/* Back to login */}
    <p className="text-center text-sm text-gray-400 mt-4">
     Already have an account?{" "}
     <span
      onClick={()=>navigate("/")}
      className="text-blue-400 cursor-pointer"
     >
      Login
     </span>
    </p>

   </div>

   {/* Shake */}
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

export default Register;