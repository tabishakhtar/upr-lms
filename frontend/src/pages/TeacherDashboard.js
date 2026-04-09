import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function TeacherDashboard() {

 const [stats,setStats] = useState({
  courses: 0,
  students: 0,
  lectures: 0
 });

 const teacherId = localStorage.getItem("userId");

 useEffect(()=>{
  fetchStats();
 },[]);

 const fetchStats = async ()=>{
  try{

   const coursesRes = await API.get("/admin/courses");
   const lecturesRes = await API.get("/teacher/lectures/all");
   const studentsRes = await API.get("/admin/students");

   const myCourses = coursesRes.data.filter(c=>c.teacher?._id === teacherId);
   const myLectures = lecturesRes.data.filter(l=>l.teacher === teacherId);

   const totalStudents = studentsRes.data.length;

   setStats({
    courses: myCourses.length,
    lectures: myLectures.length,
    students: totalStudents
   });

  }catch(err){
   console.log(err);
  }
 };

 return (

  <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white min-h-screen">

   {/* Sidebar */}
   <Sidebar role="teacher" />

   {/* Main */}
   <div className="flex-1 md:ml-64">

    {/* Navbar */}
    <Navbar />

    <div className="pt-20 px-4 md:px-8 space-y-8">

     {/* HEADER */}
     <div>
      <h1 className="text-3xl md:text-4xl font-semibold">
       Teacher Dashboard
      </h1>
      <p className="text-gray-400 text-sm">
       Manage lectures, students & performance
      </p>
     </div>

     {/* ACTION CARDS */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

      <Link to="/upload-lecture">
       <div className="card border-blue-500/30">
        <h2>📚 Upload</h2>
        <p>Lecture content</p>
       </div>
      </Link>

      <Link to="/mark-attendance">
       <div className="card border-green-500/30">
        <h2>📝 Attendance</h2>
        <p>Track presence</p>
       </div>
      </Link>

      <Link to="/create-quiz">
       <div className="card border-purple-500/30">
        <h2>🧠 Quiz</h2>
        <p>Create tests</p>
       </div>
      </Link>

      <Link to="/upload-result">
       <div className="card border-pink-500/30">
        <h2>📊 Results</h2>
        <p>Upload marks</p>
       </div>
      </Link>

      {/* ✅ NEW CHAT CARD */}
      <Link to="/chat">
       <div className="card border-cyan-500/30">
        <h2>💬 Chat</h2>
        <p>Talk with students</p>
       </div>
      </Link>

     </div>

     {/* STATS */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="glass">
       <p className="text-gray-400 text-sm">My Courses</p>
       <h2 className="text-3xl font-bold text-blue-400 mt-2">
        {stats.courses}
       </h2>
      </div>

      <div className="glass">
       <p className="text-gray-400 text-sm">My Students</p>
       <h2 className="text-3xl font-bold text-green-400 mt-2">
        {stats.students}
       </h2>
      </div>

      <div className="glass">
       <p className="text-gray-400 text-sm">Lectures Uploaded</p>
       <h2 className="text-3xl font-bold text-purple-400 mt-2">
        {stats.lectures}
       </h2>
      </div>

     </div>

     {/* INFO */}
     <div className="glass">

      <h2 className="text-lg font-semibold mb-3">
       📌 Teaching Guide
      </h2>

      <ul className="text-gray-400 text-sm space-y-1">
       <li>• Upload lectures per course</li>
       <li>• Track attendance daily</li>
       <li>• Create quizzes for engagement</li>
       <li>• Upload results timely</li>
      </ul>

     </div>

    </div>

   </div>

   {/* STYLE */}
   <style>{`
    .card {
     padding:16px;
     border-radius:16px;
     border:1px solid;
     background:rgba(255,255,255,0.03);
     backdrop-filter: blur(10px);
     transition:0.3s;
    }

    .card:hover {
     transform: translateY(-4px);
     box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .glass {
     padding:16px;
     border-radius:16px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }
   `}</style>

  </div>

 );
}

export default TeacherDashboard;