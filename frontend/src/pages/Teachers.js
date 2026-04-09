import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function Teachers(){

 const [teachers,setTeachers] = useState([]);

 const [editingTeacher,setEditingTeacher] = useState(null);
 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [teacherId,setTeacherId] = useState("");

 const [loading,setLoading] = useState(false);
 const [message,setMessage] = useState("");

 useEffect(()=>{
  fetchTeachers();
 },[]);

 const fetchTeachers = async () => {
  try{
   const res = await API.get("/admin/teachers");
   setTeachers(res.data);
  }catch(err){
   console.log(err);
  }
 };

 // DELETE
 const deleteTeacher = async (id) => {
  try{
   await API.delete(`/admin/teacher/${id}`);
   setMessage("Teacher deleted ✅");
   fetchTeachers();
  }catch(err){
   console.log(err);
  }
 };

 // EDIT
 const editTeacher = (teacher)=>{
  setEditingTeacher(teacher);
  setName(teacher.name);
  setEmail(teacher.email);
  setTeacherId(teacher.teacherId);
 };

 // UPDATE
 const updateTeacher = async ()=>{
  try{
   setLoading(true);

   await API.put(`/admin/teacher/${editingTeacher._id}`,{
    name,
    email,
    teacherId
   });

   setEditingTeacher(null);
   setMessage("Teacher updated ✅");
   fetchTeachers();

  }catch(err){
   console.log(err);
  }finally{
   setLoading(false);
  }
 };

 return(

  <Layout>

   <div className="space-y-6">

    {/* HEADER */}
    <div>
     <h1 className="text-3xl font-bold">Teachers Management</h1>
     <p className="text-gray-400 text-sm">
      Manage all teachers in your LMS
     </p>
    </div>

    {/* MESSAGE */}
    {message && (
     <div className="p-3 bg-green-500/10 border border-green-400/30 text-green-300 rounded-lg text-sm">
      {message}
     </div>
    )}

    {/* EDIT PANEL */}
    {editingTeacher && (

     <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg">

      <h2 className="text-lg font-semibold mb-4">
       Edit Teacher
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

       <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        className="input"
        placeholder="Name"
       />

       <input
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="input"
        placeholder="Email"
       />

       <input
        value={teacherId}
        onChange={(e)=>setTeacherId(e.target.value)}
        className="input"
        placeholder="Teacher ID"
       />

      </div>

      <div className="flex gap-3 mt-4">

       <button
        onClick={updateTeacher}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition"
       >
        {loading ? "Updating..." : "Update"}
       </button>

       <button
        onClick={()=>setEditingTeacher(null)}
        className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600"
       >
        Cancel
       </button>

      </div>

     </div>

    )}

    {/* TABLE */}
    <div className="overflow-x-auto">

     <table className="w-full border border-gray-800 rounded-2xl overflow-hidden">

      <thead>
       <tr className="bg-gray-900 text-gray-300 text-sm">
        <th className="p-4 text-left">Name</th>
        <th className="p-4 text-left">Email</th>
        <th className="p-4 text-left">Teacher ID</th>
        <th className="p-4 text-left">Action</th>
       </tr>
      </thead>

      <tbody>

       {teachers.map((teacher)=>(
        
        <tr key={teacher._id} className="border-t border-gray-800 hover:bg-white/5 transition">

         <td className="p-4">{teacher.name}</td>
         <td className="p-4">{teacher.email}</td>
         <td className="p-4">{teacher.teacherId}</td>

         <td className="p-4 flex gap-2 flex-wrap">

          <button
           onClick={()=>editTeacher(teacher)}
           className="px-3 py-1 rounded-lg bg-yellow-500/90 hover:bg-yellow-600 text-white text-sm"
          >
           Edit
          </button>

          <button
           onClick={()=>deleteTeacher(teacher._id)}
           className="px-3 py-1 rounded-lg bg-red-500/90 hover:bg-red-600 text-white text-sm"
          >
           Delete
          </button>

         </td>

        </tr>

       ))}

      </tbody>

     </table>

    </div>

   </div>

   {/* INPUT STYLE */}
   <style>{`
    .input {
     width:100%;
     padding:10px;
     border-radius:10px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
     outline:none;
    }
    .input:focus {
     border-color:#6366f1;
    }
   `}</style>

  </Layout>

 );

}

export default Teachers;