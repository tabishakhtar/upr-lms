import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function CourseDetails(){

 const { courseId } = useParams();
 const [lectures,setLectures] = useState([]);

 useEffect(()=>{
  fetchLectures();
 },[]);

 const fetchLectures = async ()=>{
  try{
   const res = await API.get(`/student/lectures/${courseId}`);
   setLectures(res.data || []);
  }catch(err){
   console.log(err);
  }
 };

 return(

  <div className="p-10 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">

   <h1 className="text-3xl font-bold mb-8">
    🎬 Course Lectures
   </h1>

   {lectures.length === 0 && (
    <p className="text-gray-400">
     No lectures uploaded yet
    </p>
   )}

   <div className="grid md:grid-cols-2 gap-6">

    {lectures.map((lec)=>{

     const fileUrl = lec.fileUrl
      ? `http://localhost:5000${lec.fileUrl}`
      : null;

     return(
      <div
       key={lec._id}
       className="bg-gray-900 p-5 rounded-xl shadow-lg hover:scale-105 transition"
      >

       <h2 className="text-lg font-semibold mb-3">
        {lec.title}
       </h2>

       {/* 🎥 VIDEO */}
       {fileUrl && fileUrl.match(/\.(mp4|webm|ogg)$/) && (
        <video
         src={fileUrl}
         controls
         className="w-full rounded mb-3"
        />
       )}

       {/* 📄 PDF */}
       {fileUrl && fileUrl.endsWith(".pdf") && (
        <iframe
         src={fileUrl}
         className="w-full h-64 rounded mb-3 bg-white"
         title="PDF"
        />
       )}

       {/* 🔗 OPEN BUTTON */}
       {fileUrl && (
        <a
         href={fileUrl}
         target="_blank"
         rel="noreferrer"
         className="text-blue-400 underline"
        >
         Open Full Lecture →
        </a>
       )}

      </div>
     );
    })}

   </div>

  </div>

 );
}

export default CourseDetails;