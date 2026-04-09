import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StudentAttendance(){

 const { courseId } = useParams();
 const [attendance,setAttendance] = useState([]);

 useEffect(()=>{
  fetchAttendance();
 },[]);

 const fetchAttendance = async ()=>{

  try{

   const studentId = localStorage.getItem("userId");

   const res = await API.get(
    `/student/my-attendance/${studentId}?courseId=${courseId}`
   );

   setAttendance(res.data);

  }catch(err){
   console.log(err);
  }

 };

 return(

  <div className="flex">

   <Sidebar />
   <div className="flex-1 ml-64 bg-gray-100 min-h-screen">

    <Navbar />

    <div className="p-8">

     <h1 className="text-2xl font-bold mb-6">
      📝 Attendance
     </h1>

     {attendance.length === 0 ? (
      <p>No attendance found</p>
     ) : (
      <ul className="bg-white p-6 rounded shadow">

       {attendance.map(a=>(
        <li key={a._id} className="border-b py-2">
         {new Date(a.createdAt).toLocaleDateString()} — 
         <span className={`ml-2 ${
          a.status==="present" ? "text-green-600" : "text-red-600"
         }`}>
          {a.status}
         </span>
        </li>
       ))}

      </ul>
     )}

    </div>

   </div>

  </div>

 );

}

export default StudentAttendance;