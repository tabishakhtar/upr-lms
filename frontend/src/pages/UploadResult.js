import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function UploadResult(){

 const [courses,setCourses] = useState([]);
 const [students,setStudents] = useState([]);

 const [courseId,setCourseId] = useState("");
 const [studentId,setStudentId] = useState("");
 const [marks,setMarks] = useState("");

 const [file,setFile] = useState(null);

 const [loading,setLoading] = useState(false);
 const [success,setSuccess] = useState("");
 const [error,setError] = useState("");

 useEffect(()=>{
  fetchCourses();
 },[]);

 // 🔥 FETCH TEACHER COURSES
 const fetchCourses = async ()=>{
  try{
   const teacherId = localStorage.getItem("userId");
   const res = await API.get(`/admin/courses/teacher/${teacherId}`);
   setCourses(res.data);
  }catch(err){
   console.log(err);
  }
 };

 // 🔥 FETCH STUDENTS BY COURSE
 const fetchStudents = async (id)=>{
  try{
   const res = await API.get(`/admin/students?course=${id}`);
   setStudents(res.data);
  }catch(err){
   console.log(err);
  }
 };

 const handleCourseChange = (id)=>{
  setCourseId(id);
  setStudentId("");
  fetchStudents(id);
 };

 // 🔥 AUTO GRADE
 const calculateGrade = (marks)=>{
  if(marks >= 85) return "A";
  if(marks >= 70) return "B";
  if(marks >= 50) return "C";
  return "F";
 };

 // 🔥 SINGLE RESULT
 const submitSingle = async ()=>{

  if(!courseId || !studentId || !marks){
   setError("Fill all fields ❌");
   return;
  }

  try{
   setLoading(true);
   setError("");
   setSuccess("");

   const grade = calculateGrade(Number(marks));

   await API.post("/teacher/upload-result",{
    studentId,
    courseId,
    marks,
    grade
   });

   setSuccess(`Result uploaded (Grade: ${grade}) 🎉`);

   setMarks("");
   setStudentId("");

  }catch(err){
   console.log(err);
   setError("Upload failed ❌");
  }finally{
   setLoading(false);
  }
 };

 // 🔥 BULK UPLOAD
 const submitBulk = async ()=>{

  if(!file){
   setError("Select CSV file ❌");
   return;
  }

  try{
   setLoading(true);
   setError("");
   setSuccess("");

   const formData = new FormData();
   formData.append("file",file);

   await API.post("/teacher/upload-results-bulk",formData);

   setSuccess("Bulk upload successful 🚀");

   setFile(null);

  }catch(err){
   console.log(err);
   setError("Bulk upload failed ❌");
  }finally{
   setLoading(false);
  }
 };

 return(

  <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white min-h-screen">

   <Sidebar role="teacher"/>

   <div className="flex-1 md:ml-64">

    <Navbar/>

    <div className="pt-20 px-4 md:px-8 flex justify-center">

     <div className="glass w-full max-w-xl p-6 rounded-2xl space-y-6">

      {/* HEADER */}
      <div>
       <h1 className="text-3xl font-bold">Upload Results</h1>
       <p className="text-gray-400 text-sm">
        Single or Bulk upload student results
       </p>
      </div>

      {/* MESSAGES */}
      {success && <div className="msg-success">{success}</div>}
      {error && <div className="msg-error">{error}</div>}

      {/* 🔹 SINGLE RESULT */}
      <div className="space-y-3">

       <h2 className="text-lg font-semibold">Single Result</h2>

       <select
        value={courseId}
        onChange={(e)=>handleCourseChange(e.target.value)}
        className="select-dark"
       >
        <option value="">Select Course</option>
        {courses.map(c=>(
         <option key={c._id} value={c._id}>
          {c.title}
         </option>
        ))}
       </select>

       <select
        value={studentId}
        onChange={(e)=>setStudentId(e.target.value)}
        className="select-dark"
        disabled={!courseId}
       >
        <option value="">Select Student</option>
        {students.map(s=>(
         <option key={s._id} value={s._id}>
          {s.name}
         </option>
        ))}
       </select>

       <input
        type="number"
        value={marks}
        onChange={(e)=>setMarks(e.target.value)}
        placeholder="Enter Marks"
        className="input"
       />

       <button
        onClick={submitSingle}
        disabled={loading}
        className="btn-main"
       >
        Upload Result 🚀
       </button>

      </div>

      {/* 🔹 BULK RESULT */}
      <div className="space-y-3">

       <h2 className="text-lg font-semibold">Bulk Upload (CSV)</h2>

       <input
        type="file"
        accept=".csv"
        onChange={(e)=>setFile(e.target.files[0])}
        className="input-file"
       />

       <button
        onClick={submitBulk}
        disabled={loading}
        className="btn-main"
       >
        Upload CSV 🚀
       </button>

      </div>

     </div>

    </div>

   </div>

   {/* STYLE */}
   <style>{`

    .glass{
     background: rgba(255,255,255,0.05);
     border: 1px solid rgba(255,255,255,0.1);
     backdrop-filter: blur(15px);
    }

    .input{
     width:100%;
     padding:12px;
     border-radius:12px;
     background: rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
    }

    .select-dark{
     width:100%;
     padding:12px;
     border-radius:12px;
     background:#111;
     color:white;
     border:1px solid rgba(255,255,255,0.2);
    }

    .select-dark option{
     background:#111;
     color:white;
    }

    .input-file{
     color:white;
    }

    .btn-main{
     width:100%;
     padding:12px;
     border-radius:12px;
     background: linear-gradient(to right,#6366f1,#9333ea);
     font-weight:600;
    }

    .msg-success{
     background:#22c55e20;
     padding:10px;
     border-radius:10px;
     text-align:center;
    }

    .msg-error{
     background:#ef444420;
     padding:10px;
     border-radius:10px;
     text-align:center;
    }

   `}</style>

  </div>

 );

}

export default UploadResult;