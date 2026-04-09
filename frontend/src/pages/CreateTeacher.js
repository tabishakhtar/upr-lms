import React, { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function CreateTeacher(){

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [teacherId,setTeacherId] = useState("");

 const [loading,setLoading] = useState(false);
 const [error,setError] = useState("");
 const [success,setSuccess] = useState("");

 const handleSubmit = async () => {

  if(!name || !email || !password){
   setError("All fields are required");
   return;
  }

  try{

   setLoading(true);
   setError("");
   setSuccess("");

   await API.post("/admin/create-teacher",{
    name,
    email,
    password,
    teacherId
   });

   setSuccess("Teacher created successfully ✅");

   // reset
   setName("");
   setEmail("");
   setPassword("");
   setTeacherId("");

  }catch(err){
   console.log(err);
   setError("Error creating teacher ❌");
  }finally{
   setLoading(false);
  }

 };

 return(

  <Layout>

   <div className="max-w-xl mx-auto">

    {/* HEADER */}
    <div className="mb-6">
     <h1 className="text-3xl font-bold text-white">
      Create Teacher
     </h1>
     <p className="text-gray-400 text-sm">
      Add a new teacher to the system
     </p>
    </div>

    {/* CARD */}
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl p-6 md:p-8 rounded-2xl">

     {/* ERROR */}
     {error && (
      <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-300 text-sm">
       {error}
      </div>
     )}

     {/* SUCCESS */}
     {success && (
      <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-400/30 text-green-300 text-sm">
       {success}
      </div>
     )}

     {/* FORM */}
     <div className="space-y-4">

      {/* Name */}
      <input
       type="text"
       value={name}
       placeholder="Teacher Name"
       onChange={(e)=>setName(e.target.value)}
       className="input"
      />

      {/* Email */}
      <input
       type="email"
       value={email}
       placeholder="Email Address"
       onChange={(e)=>setEmail(e.target.value)}
       className="input"
      />

      {/* Password */}
      <input
       type="password"
       value={password}
       placeholder="Password"
       onChange={(e)=>setPassword(e.target.value)}
       className="input"
      />

      {/* Teacher ID */}
      <input
       type="text"
       value={teacherId}
       placeholder="Teacher ID (optional)"
       onChange={(e)=>setTeacherId(e.target.value)}
       className="input"
      />

      {/* BUTTON */}
      <button
       onClick={handleSubmit}
       disabled={loading}
       className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold hover:scale-[1.02] transition shadow-lg"
      >
       {loading ? "Creating..." : "Create Teacher"}
      </button>

     </div>

    </div>

   </div>

   {/* INPUT STYLE */}
   <style>{`
    .input {
     width:100%;
     padding:12px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
     outline:none;
     transition:0.2s;
    }
    .input:focus {
     border-color:#6366f1;
     box-shadow:0 0 0 1px #6366f1;
    }
   `}</style>

  </Layout>

 );

}

export default CreateTeacher;