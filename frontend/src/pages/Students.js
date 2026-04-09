import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function Students() {

 const [students, setStudents] = useState([]);

 const [editingStudent, setEditingStudent] = useState(null);
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [studentId, setStudentId] = useState("");

 const [message,setMessage] = useState("");

 useEffect(() => {
  fetchStudents();
 }, []);

 const fetchStudents = async () => {
  try {
   const res = await API.get("/admin/students");
   setStudents(res.data);
  } catch (err) {
   console.log(err);
  }
 };

 // 🔥 FILTER
 const pending = students.filter(s=>s.status === "pending");
 const approved = students.filter(s=>s.status === "approved");

 // ✅ APPROVE
 const approveStudent = async (id)=>{
  try{

   await API.put(`/admin/student-status/${id}`,{
    status:"approved",
    studentId:"LMS" + Date.now()
   });

   setMessage("Student approved ✅");
   fetchStudents();

  }catch(err){
   console.log(err);
  }
 };

 // ❌ REJECT
 const rejectStudent = async (id)=>{
  try{

   await API.put(`/admin/student-status/${id}`,{
    status:"rejected"
   });

   setMessage("Student rejected ❌");
   fetchStudents();

  }catch(err){
   console.log(err);
  }
 };

 // 🗑 DELETE
 const deleteStudent = async (id) => {
  if (!window.confirm("Delete student?")) return;

  try {
   await API.delete(`/admin/student/${id}`);
   setMessage("Student deleted 🗑");
   fetchStudents();
  } catch (err) {
   console.log(err);
  }
 };

 // ✏️ EDIT
 const editStudent = (student) => {
  setEditingStudent(student);
  setName(student.name);
  setEmail(student.email);
  setStudentId(student.studentId);
 };

 // 🔄 UPDATE
 const updateStudent = async () => {
  try {
   await API.put(`/admin/student/${editingStudent._id}`, {
    name,
    email,
    studentId
   });

   setEditingStudent(null);
   setMessage("Student updated ✏️");
   fetchStudents();

  } catch (err) {
   console.log(err);
  }
 };

 return (

  <Layout>

   <div className="space-y-8">

    <h1 className="text-3xl font-bold">Students Management</h1>

    {/* MESSAGE */}
    {message && (
     <div className="p-3 bg-green-500/10 border border-green-400/30 text-green-300 rounded-lg text-sm">
      {message}
     </div>
    )}

    {/* ✏️ EDIT PANEL */}
    {editingStudent && (
     <div className="glass p-6 rounded-2xl">

      <h2 className="mb-4 font-semibold">Edit Student</h2>

      <div className="grid md:grid-cols-3 gap-4">

       <input value={name} onChange={(e)=>setName(e.target.value)} className="input" placeholder="Name" />
       <input value={email} onChange={(e)=>setEmail(e.target.value)} className="input" placeholder="Email" />
       <input value={studentId} onChange={(e)=>setStudentId(e.target.value)} className="input" placeholder="LMS ID" />

      </div>

      <div className="flex gap-3 mt-4">

       <button onClick={updateStudent} className="btn-green">Update</button>
       <button onClick={()=>setEditingStudent(null)} className="btn-gray">Cancel</button>

      </div>

     </div>
    )}

    {/* 🔥 PENDING */}
    <div>
     <h2 className="text-xl font-semibold mb-4">Pending Registrations</h2>

     <div className="grid md:grid-cols-2 gap-4">

      {pending.map(s=>(
       <div key={s._id} className="glass p-4 rounded-xl">

        <h3>{s.name}</h3>
        <p className="text-gray-400 text-sm">{s.email}</p>

        <div className="flex gap-2 mt-3">

         <button onClick={()=>approveStudent(s._id)} className="btn-green">
          Approve
         </button>

         <button onClick={()=>rejectStudent(s._id)} className="btn-red">
          Reject
         </button>

        </div>

       </div>
      ))}

      {pending.length === 0 && <p className="text-gray-500">No pending students</p>}

     </div>
    </div>

    {/* ✅ APPROVED */}
    <div>
     <h2 className="text-xl font-semibold mb-4">Approved Students</h2>

     <div className="overflow-x-auto">

      <table className="w-full border border-gray-800 rounded-xl">

       <thead>
        <tr className="bg-gray-900 text-gray-300">
         <th className="p-3 text-left">Name</th>
         <th className="p-3 text-left">Email</th>
         <th className="p-3 text-left">LMS ID</th>
         <th className="p-3 text-left">Action</th>
        </tr>
       </thead>

       <tbody>

        {approved.map(student => (
         <tr key={student._id} className="border-t border-gray-800">

          <td className="p-3">{student.name}</td>
          <td className="p-3">{student.email}</td>
          <td className="p-3">{student.studentId}</td>

          <td className="p-3 flex gap-2">

           <button onClick={()=>editStudent(student)} className="btn-yellow">Edit</button>

           <button onClick={()=>deleteStudent(student._id)} className="btn-red">Delete</button>

          </td>

         </tr>
        ))}

       </tbody>

      </table>

     </div>

    </div>

   </div>

   {/* STYLE */}
   <style>{`
    .glass {
     background: rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     backdrop-filter: blur(12px);
    }

    .input {
     padding:10px;
     border-radius:10px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
    }

    .btn-green {
     background:linear-gradient(to right,#22c55e,#16a34a);
     padding:6px 12px;
     border-radius:8px;
     color:white;
    }

    .btn-red {
     background:#ef4444;
     padding:6px 12px;
     border-radius:8px;
     color:white;
    }

    .btn-yellow {
     background:#eab308;
     padding:6px 12px;
     border-radius:8px;
     color:black;
    }

    .btn-gray {
     background:#374151;
     padding:6px 12px;
     border-radius:8px;
     color:white;
    }
   `}</style>

  </Layout>

 );
}

export default Students;