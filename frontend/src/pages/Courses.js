import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function Courses(){

 const [courses,setCourses] = useState([]);
 const [teachers,setTeachers] = useState([]);

 const [editingCourse,setEditingCourse] = useState(null);
 const [title,setTitle] = useState("");
 const [teacherId,setTeacherId] = useState("");

 const [message,setMessage] = useState("");

 const role = localStorage.getItem("role"); // ✅ KEY LINE

 useEffect(()=>{
  fetchCourses();

  if(role === "admin"){
   fetchTeachers();
  }

 },[role]);

 // 🔥 FETCH COURSES (ROLE BASED)
 const fetchCourses = async ()=>{

  try{

   if(role === "admin"){
    const res = await API.get("/admin/courses");
    setCourses(res.data);
   }

   else if(role === "student"){
    const studentId = localStorage.getItem("userId");

    const res = await API.get(`/student/my-courses/${studentId}`);

    let allCourses = [];

    res.data.forEach(reg=>{
     reg.courses.forEach(course=>{
      allCourses.push(course);
     });
    });

    setCourses(allCourses);
   }

  }catch(err){
   console.log(err);
  }

 };

 // 🔥 FETCH TEACHERS (ADMIN ONLY)
 const fetchTeachers = async ()=>{
  const res = await API.get("/admin/teachers");
  setTeachers(res.data);
 };

 // DELETE (ADMIN ONLY)
 const deleteCourse = async (id)=>{
  try{
   await API.delete(`/admin/course/${id}`);
   setMessage("Course deleted ✅");
   fetchCourses();
  }catch(err){
   console.log(err);
  }
 };

 // EDIT (ADMIN ONLY)
 const editCourse = (course)=>{
  setEditingCourse(course);
  setTitle(course.title);
  setTeacherId(course.teacher?._id || "");
 };

 // UPDATE (ADMIN ONLY)
 const updateCourse = async ()=>{
  try{
   await API.put(`/admin/course/${editingCourse._id}`,{
    title,
    teacherId
   });

   setEditingCourse(null);
   setMessage("Course updated ✅");
   fetchCourses();

  }catch(err){
   console.log(err);
  }
 };

 return(

  <Layout>

   <div className="space-y-6">

    {/* HEADER */}
    <div>
     <h1 className="text-3xl font-bold">
      {role === "admin" ? "Courses Management" : "My Courses"}
     </h1>
     <p className="text-gray-400 text-sm">
      {role === "admin"
       ? "Manage all courses in your LMS"
       : "View your enrolled courses"}
     </p>
    </div>

    {/* MESSAGE */}
    {message && (
     <div className="p-3 bg-green-500/10 border border-green-400/30 text-green-300 rounded-lg text-sm">
      {message}
     </div>
    )}

    {/* 🔥 EDIT PANEL (ADMIN ONLY) */}
    {role === "admin" && editingCourse && (

     <div className="glass">

      <h2 className="text-lg font-semibold mb-4">
       Edit Course
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

       <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        className="input"
        placeholder="Course Title"
       />

       <select
        value={teacherId}
        onChange={(e)=>setTeacherId(e.target.value)}
        className="input bg-gray-900"
       >
        <option value="">Select Teacher</option>

        {teachers.map((t)=>(
         <option key={t._id} value={t._id}>
          {t.name}
         </option>
        ))}

       </select>

      </div>

      <div className="flex gap-3 mt-4">

       <button onClick={updateCourse} className="btn-green">
        Update
       </button>

       <button
        onClick={()=>setEditingCourse(null)}
        className="btn-gray"
       >
        Cancel
       </button>

      </div>

     </div>

    )}

    {/* 🔥 COURSES */}
    {role === "admin" ? (

     // ================= ADMIN TABLE =================
     <div className="overflow-x-auto">

      <table className="w-full border border-gray-800 rounded-2xl overflow-hidden">

       <thead>
        <tr className="bg-gray-900 text-gray-300 text-sm">
         <th className="p-4 text-left">Course</th>
         <th className="p-4 text-left">Teacher</th>
         <th className="p-4 text-left">Actions</th>
        </tr>
       </thead>

       <tbody>

        {courses.map((course)=>(

         <tr key={course._id} className="border-t border-gray-800 hover:bg-white/5">

          <td className="p-4">{course.title}</td>

          <td className="p-4">
           {course.teacher ? course.teacher.name : "Not Assigned"}
          </td>

          <td className="p-4 flex gap-2">

           <button
            onClick={()=>editCourse(course)}
            className="btn-yellow"
           >
            Edit
           </button>

           <button
            onClick={()=>deleteCourse(course._id)}
            className="btn-red"
           >
            Delete
           </button>

          </td>

         </tr>

        ))}

       </tbody>

      </table>

     </div>

    ) : (

     // ================= STUDENT CARDS =================
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {courses.map((course)=>(

       <div key={course._id} className="glass">

        <h2 className="text-xl font-semibold mb-2">
         {course.title}
        </h2>

        <p className="text-gray-400 text-sm mb-3">
         👨‍🏫 {course?.teacher?.name || "Not Assigned"}
        </p>

        <div className="flex flex-col gap-2">

         <Link to={`/student-results/${course._id}`}>
          <button className="btn-purple">📊 Result</button>
         </Link>

         <Link to={`/student-attendance/${course._id}`}>
          <button className="btn-green">📝 Attendance</button>
         </Link>

         <Link to={`/course/${course._id}`}>
          <button className="btn-blue">📺 Lectures</button>
         </Link>

        </div>

       </div>

      ))}

     </div>

    )}

   </div>

   {/* STYLE */}
   <style>{`

    .glass {
     padding:20px;
     border-radius:16px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }

    .input {
     padding:10px;
     border-radius:10px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
     width:100%;
    }

    .btn-green { background:#16a34a; padding:8px 12px; border-radius:8px; color:white; }
    .btn-blue { background:#2563eb; padding:8px 12px; border-radius:8px; color:white; }
    .btn-purple { background:#7c3aed; padding:8px 12px; border-radius:8px; color:white; }
    .btn-red { background:#dc2626; padding:6px 10px; border-radius:6px; color:white; }
    .btn-yellow { background:#f59e0b; padding:6px 10px; border-radius:6px; color:white; }
    .btn-gray { background:#374151; padding:8px 12px; border-radius:8px; color:white; }

   `}</style>

  </Layout>

 );

}

export default Courses;