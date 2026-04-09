import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function RegisterSemester(){

 const [semester,setSemester] = useState("");
 const [courses,setCourses] = useState([]);
 const [selected,setSelected] = useState([]);
 const [teachers,setTeachers] = useState([]);

 const [search,setSearch] = useState("");
 const [filterTeacher,setFilterTeacher] = useState("");

 const [message,setMessage] = useState("");
 const [success,setSuccess] = useState(""); // ✅ NEW

 const MAX_CREDIT = 18;

 useEffect(()=>{
  fetchCourses();
  fetchTeachers();
 },[]);

 const fetchCourses = async ()=>{
  const res = await API.get("/admin/courses");
  setCourses(res.data);
 };

 const fetchTeachers = async ()=>{
  const res = await API.get("/admin/teachers");
  setTeachers(res.data);
 };

 const totalCredit = selected.reduce((sum,id)=>{
  const course = courses.find(c=>c._id === id);
  return sum + (course?.creditHours || 3);
 },0);

 const toggleCourse = (id)=>{
  const course = courses.find(c=>c._id === id);
  const credit = course?.creditHours || 3;

  if(selected.includes(id)){
   setSelected(selected.filter(c=>c!==id));
   setMessage("");
  }else{
   if(totalCredit + credit > MAX_CREDIT){
    setMessage(`Max ${MAX_CREDIT} credit hours allowed ❌`);
    return;
   }
   setSelected([...selected,id]);
   setMessage("");
  }
 };

 const submit = async ()=>{
  const studentId = localStorage.getItem("userId");

  if(!semester || selected.length===0){
   setMessage("Select semester & courses ❌");
   return;
  }

  await API.post("/student/register",{
   studentId,
   semester,
   courses:selected
  });

  setSuccess("Registration Submitted Successfully ✅");

  // 🔥 AUTO HIDE
  setTimeout(()=>{
   setSuccess("");
  },3000);

  setSelected([]);
 };

 const filteredCourses = courses
  .filter(c=>c.semester == semester)
  .filter(c=>c.title.toLowerCase().includes(search.toLowerCase()))
  .filter(c=> filterTeacher ? c.teacher?._id === filterTeacher : true);

 return(

  <Layout>

   <div className="space-y-6 relative">

    {/* 🔥 SUCCESS TOAST */}
    {success && (
     <div className="toast-success">
      {success}
     </div>
    )}

    {/* HEADER */}
    <div>
     <h1 className="text-2xl md:text-3xl font-semibold">
      Course Registration Portal
     </h1>
     <p className="text-gray-400 text-sm">
      Max {MAX_CREDIT} Credit Hours Allowed
     </p>
    </div>

    {/* CREDIT PANEL */}
    <div className="glass">

     <div className="flex justify-between">
      <span>Credit</span>
      <span>{totalCredit} / {MAX_CREDIT}</span>
     </div>

     <div className="progress mt-2">
      <div
       className="progress-fill"
       style={{ width: `${(totalCredit/MAX_CREDIT)*100}%` }}
      />
     </div>

     {message && (
      <p className="text-red-400 text-sm mt-2">{message}</p>
     )}

    </div>

    {/* FILTER */}
    <div className="glass grid grid-cols-1 md:grid-cols-3 gap-3">

     <select
      value={semester}
      onChange={(e)=>setSemester(e.target.value)}
      className="dropdown"
     >
      <option value="">Select Semester</option>
      {[1,2,3,4,5,6,7,8].map(s=>(
       <option key={s} value={s}>
        Semester {s}
       </option>
      ))}
     </select>

     <input
      type="text"
      placeholder="Search course..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className="search"
     />

     <select
      value={filterTeacher}
      onChange={(e)=>setFilterTeacher(e.target.value)}
      className="dropdown"
     >
      <option value="">All Teachers</option>
      {teachers.map(t=>(
       <option key={t._id} value={t._id}>
        {t.name}
       </option>
      ))}
     </select>

    </div>

    {/* COURSES */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

     {filteredCourses.map(course=>{

      const isSelected = selected.includes(course._id);

      return(
       <div
        key={course._id}
        onClick={()=>toggleCourse(course._id)}
        className={`card ${isSelected ? "active" : ""}`}
       >

        <h2>{course.title}</h2>

        <p className="text-xs text-gray-400">
         👨‍🏫 {course?.teacher?.name || "No teacher"}
        </p>

        <p className="text-xs text-blue-400 mt-1">
         {course.creditHours || 3} CH
        </p>

       </div>
      )
     })}

    </div>

    {/* BUTTON */}
    <button onClick={submit} className="submit">
     Submit Registration
    </button>

   </div>

   {/* STYLE */}
   <style>{`

    .toast-success {
     position:fixed;
     top:20px;
     left:50%;
     transform:translateX(-50%);
     background:#16a34a;
     color:white;
     padding:12px 20px;
     border-radius:10px;
     z-index:999;
     animation:slideDown 0.3s ease;
     font-size:14px;
    }

    @keyframes slideDown {
     from { opacity:0; transform:translate(-50%,-20px); }
     to { opacity:1; transform:translate(-50%,0); }
    }

    .glass {
     padding:16px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }

    .dropdown {
     padding:10px;
     border-radius:8px;
     background:white;
     color:black;
     width:100%;
    }

    .search {
     padding:10px;
     border-radius:8px;
     background:#111827;
     color:white;
     border:1px solid #374151;
     width:100%;
    }

    .card {
     padding:14px;
     border-radius:10px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     cursor:pointer;
    }

    .active {
     background:#2563eb;
     color:white;
    }

    .submit {
     width:100%;
     padding:12px;
     border-radius:10px;
     background:#16a34a;
     color:white;
     font-weight:600;
    }

    .progress {
     height:6px;
     background:#1f2937;
     border-radius:10px;
    }

    .progress-fill {
     height:6px;
     background:#22c55e;
     border-radius:10px;
    }

   `}</style>

  </Layout>

 );

}

export default RegisterSemester;