import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function EnrollStudent(){

 const [studentId,setStudentId] = useState("");
 const [courseId,setCourseId] = useState("");

 const [students,setStudents] = useState([]);
 const [courses,setCourses] = useState([]);

 const [loading,setLoading] = useState(false);
 const [error,setError] = useState("");
 const [success,setSuccess] = useState("");

 useEffect(()=>{
  fetchData();
 },[]);

 const fetchData = async ()=>{
  try{
   const [studentsRes, coursesRes] = await Promise.all([
    API.get("/admin/students"),
    API.get("/admin/courses")
   ]);

   setStudents(studentsRes.data);
   setCourses(coursesRes.data);

  }catch(err){
   console.log(err);
  }
 };

 const enroll = async ()=>{

  if(!studentId || !courseId){
   setError("Select student and course");
   return;
  }

  try{
   setLoading(true);
   setError("");
   setSuccess("");

   await API.post("/admin/enroll",{
    studentId,
    courseId
   });

   setSuccess("Student enrolled successfully ✅");

   setStudentId("");
   setCourseId("");

  }catch(err){
   console.log(err);
   setError("Enrollment failed ❌");
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
      Enroll Student
     </h1>
     <p className="text-gray-400 text-sm">
      Assign a student to a course
     </p>
    </div>

    {/* CARD */}
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl">

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

      {/* Student Dropdown */}
      <select
       value={studentId}
       onChange={(e)=>setStudentId(e.target.value)}
       className="input bg-gray-900"
      >
       <option value="">Select Student</option>

       {students.map((s)=>(
        <option key={s._id} value={s._id}>
         {s.name} ({s.email})
        </option>
       ))}
      </select>

      {/* Course Dropdown */}
      <select
       value={courseId}
       onChange={(e)=>setCourseId(e.target.value)}
       className="input bg-gray-900"
      >
       <option value="">Select Course</option>

       {courses.map((c)=>(
        <option key={c._id} value={c._id}>
         {c.title}
        </option>
       ))}
      </select>

      {/* BUTTON */}
      <button
       onClick={enroll}
       disabled={loading}
       className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:scale-[1.02] transition shadow-lg"
      >
       {loading ? "Enrolling..." : "Enroll Student"}
      </button>

     </div>

    </div>

   </div>

   {/* STYLE */}
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

export default EnrollStudent;