import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Attendance(){

 const [courses,setCourses] = useState([]);
 const [students,setStudents] = useState([]);

 const [courseId,setCourseId] = useState("");
 const [attendance,setAttendance] = useState({});

 const [loading,setLoading] = useState(false);
 const [success,setSuccess] = useState("");
 const [error,setError] = useState("");

 useEffect(()=>{
  fetchCourses();
 },[]);

 const fetchCourses = async ()=>{
 try{
  const teacherId = localStorage.getItem("userId");

  const res = await API.get(`/admin/courses/teacher/${teacherId}`);

  setCourses(res.data);

 }catch(err){
  console.log(err);
 }
};

 // 🔥 Load students when course selected
 const handleCourseChange = async (id)=>{
  setCourseId(id);

  try{

   const res = await API.get(`/admin/students?course=${id}`);

   // you can filter enrolled students later
   setStudents(res.data);

   // default all absent
   const initial = {};
   res.data.forEach(s=>{
    initial[s._id] = "absent";
   });

   setAttendance(initial);

  }catch(err){
   console.log(err);
  }
 };

 // 🔥 Change status
 const toggleStatus = (id,status)=>{
  setAttendance(prev=>({
   ...prev,
   [id]:status
  }));
 };

 // 🔥 Mark all present
 const markAllPresent = ()=>{
  const updated = {};
  students.forEach(s=>{
   updated[s._id] = "present";
  });
  setAttendance(updated);
 };

 // 🔥 Submit bulk
 const submitAttendance = async ()=>{

  try{

   setLoading(true);
   setError("");
   setSuccess("");

   const data = Object.keys(attendance).map(id=>({
    studentId:id,
    courseId,
    status:attendance[id]
   }));

   await API.post("/teacher/attendance/bulk", data);

   setSuccess("Attendance submitted successfully 🚀");

  }catch(err){
   console.log(err);
   setError("Error submitting attendance ❌");
  }finally{
   setLoading(false);
  }

 };

 return(

  <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white min-h-screen">

   <Sidebar role="teacher"/>

   <div className="flex-1 md:ml-64">

    <Navbar/>

    <div className="pt-20 px-4 md:px-8 space-y-6">

     <h1 className="text-3xl font-semibold">
      Bulk Attendance
     </h1>

     {/* MESSAGES */}
     {success && <div className="msg-success">{success}</div>}
     {error && <div className="msg-error">{error}</div>}

     {/* COURSE */}
     <select
      value={courseId}
      onChange={(e)=>handleCourseChange(e.target.value)}
      className="input text-black bg-white"
     >
      <option value="">Select Course</option>
      {courses.map(c=>(
       <option key={c._id} value={c._id}>
        {c.title}
       </option>
      ))}
     </select>

     {/* ACTION */}
     {students.length > 0 && (
      <div className="flex justify-between items-center">

       <p className="text-gray-400">
        Total Students: {students.length}
       </p>

       <button onClick={markAllPresent} className="btn-green">
        Mark All Present
       </button>

      </div>
     )}

     {/* STUDENTS LIST */}
     <div className="grid md:grid-cols-2 gap-4">

      {students.map(s=>(
       <div key={s._id} className="card">

        <div>
         <h3 className="font-semibold">{s.name}</h3>
         <p className="text-gray-400 text-sm">{s.email}</p>
        </div>

        <div className="flex gap-2 mt-3">

         <button
          onClick={()=>toggleStatus(s._id,"present")}
          className={`status-btn ${
           attendance[s._id] === "present" ? "present" : ""
          }`}
         >
          Present
         </button>

         <button
          onClick={()=>toggleStatus(s._id,"absent")}
          className={`status-btn ${
           attendance[s._id] === "absent" ? "absent" : ""
          }`}
         >
          Absent
         </button>

        </div>

       </div>
      ))}

     </div>

     {/* SUBMIT */}
     {students.length > 0 && (
      <button
       onClick={submitAttendance}
       disabled={loading}
       className="btn-main"
      >
       {loading ? "Submitting..." : "Submit Attendance 🚀"}
      </button>
     )}

    </div>

   </div>

   {/* STYLE */}
   <style>{`
    .input{
     width:100%;
     padding:12px;
     border-radius:12px;
     border:1px solid rgba(255,255,255,0.1);
    }

    .card{
     padding:16px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }

    .status-btn{
     flex:1;
     padding:8px;
     border-radius:8px;
     background:#333;
    }

    .present{
     background:#22c55e;
    }

    .absent{
     background:#ef4444;
    }

    .btn-main{
     width:100%;
     padding:12px;
     border-radius:12px;
     background:linear-gradient(to right,#6366f1,#9333ea);
    }

    .btn-green{
     background:#22c55e;
     padding:8px 12px;
     border-radius:8px;
    }

    .msg-success{
     background:#22c55e20;
     padding:10px;
     border-radius:10px;
    }

    .msg-error{
     background:#ef444420;
     padding:10px;
     border-radius:10px;
    }
   `}</style>

  </div>

 );

}

export default Attendance;