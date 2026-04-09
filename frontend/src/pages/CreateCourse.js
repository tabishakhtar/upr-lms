import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function CreateCourse(){

 const [title,setTitle] = useState("");
 const [description,setDescription] = useState("");
 const [teacherId,setTeacherId] = useState("");
 const [semester,setSemester] = useState("");
 const [book,setBook] = useState("");

 const [teachers,setTeachers] = useState([]);
 const [loading,setLoading] = useState(false);
 const [error,setError] = useState("");
 const [success,setSuccess] = useState("");

 useEffect(()=>{
  fetchTeachers();
 },[]);

 const fetchTeachers = async ()=>{
  try{
   const res = await API.get("/admin/teachers");
   setTeachers(res.data);
  }catch(err){
   console.log(err);
  }
 };

 const createCourse = async ()=>{

  if(!title || !teacherId || !semester){
   setError("Title, Teacher & Semester are required");
   return;
  }

  try{
   setLoading(true);
   setError("");
   setSuccess("");

   await API.post("/admin/create-course",{
    title,
    description,
    teacherId,
    semester,
    book
   });

   setSuccess("Course created successfully ✅");

   // reset
   setTitle("");
   setDescription("");
   setTeacherId("");
   setSemester("");
   setBook("");

  }catch(err){
   console.log(err);
   setError("Error creating course ❌");
  }finally{
   setLoading(false);
  }

 };

 return(

  <Layout>

   <div className="max-w-2xl mx-auto">

    {/* HEADER */}
    <div className="mb-6">
     <h1 className="text-3xl font-bold text-white">
      Create Course
     </h1>
     <p className="text-gray-400 text-sm">
      Assign course to a teacher
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

      {/* Title */}
      <input
       value={title}
       placeholder="Course Title"
       onChange={(e)=>setTitle(e.target.value)}
       className="input"
      />

      {/* Description */}
      <textarea
       value={description}
       placeholder="Course Description"
       onChange={(e)=>setDescription(e.target.value)}
       className="input h-24"
      />

      {/* Teacher Dropdown */}
      <select
       value={teacherId}
       onChange={(e)=>setTeacherId(e.target.value)}
       className="input text-white bg-gray-900"
      >
       <option value="" className="bg-gray-900 text-white">
        Select Teacher
       </option>

       {teachers.map((t)=>(
        <option
         key={t._id}
         value={t._id}
         className="bg-gray-900 text-white"
        >
         {t.name}
        </option>
       ))}
      </select>

      {/* Semester */}
      <input
       type="number"
       value={semester}
       placeholder="Semester"
       onChange={(e)=>setSemester(e.target.value)}
       className="input"
      />

      {/* Book */}
      <input
       value={book}
       placeholder="Book / Material"
       onChange={(e)=>setBook(e.target.value)}
       className="input"
      />

      {/* BUTTON */}
      <button
       onClick={createCourse}
       disabled={loading}
       className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold hover:scale-[1.02] transition shadow-lg"
      >
       {loading ? "Creating..." : "Create Course"}
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

export default CreateCourse;