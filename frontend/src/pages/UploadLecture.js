import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function UploadLecture(){

 const [title,setTitle] = useState("");
 const [content,setContent] = useState("");
 const [courseId,setCourseId] = useState("");
 const [book,setBook] = useState("");

 const [pdf,setPdf] = useState(null);
 const [video,setVideo] = useState(null);

 const [pdfPreview,setPdfPreview] = useState("");
 const [videoPreview,setVideoPreview] = useState("");

 const [courses,setCourses] = useState([]);

 const [loading,setLoading] = useState(false);
 const [progress,setProgress] = useState(0);

 const [success,setSuccess] = useState("");
 const [error,setError] = useState("");

 useEffect(()=>{
  fetchCourses();
 },[]);

 const fetchCourses = async ()=>{
  const res = await API.get("/admin/courses");
  setCourses(res.data);
 };

 const handleFile = (file,type)=>{
  if(type === "pdf"){
   setPdf(file);
   setPdfPreview(URL.createObjectURL(file));
  }else{
   setVideo(file);
   setVideoPreview(URL.createObjectURL(file));
  }
 };

 const handleDrop = (e,type)=>{
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  handleFile(file,type);
 };

 const upload = async ()=>{

  if(!title || !courseId){
   setError("Title & Course required ❌");
   return;
  }

  try{

   setLoading(true);
   setProgress(0);
   setError("");
   setSuccess("");

   const teacherId = localStorage.getItem("userId");

   const formData = new FormData();

   formData.append("title", title);
   formData.append("content", content);
   formData.append("course", courseId);
   formData.append("teacherId", teacherId);
   formData.append("book", book);

   if(pdf) formData.append("pdf", pdf);
   if(video) formData.append("video", video);

   await API.post("/teacher/upload-lecture", formData,{
    headers:{ "Content-Type":"multipart/form-data" },
    onUploadProgress:(e)=>{
     const percent = Math.round((e.loaded * 100)/e.total);
     setProgress(percent);
    }
   });

   setSuccess("Lecture uploaded successfully 🚀");

   setTitle("");
   setContent("");
   setCourseId("");
   setBook("");
   setPdf(null);
   setVideo(null);
   setPdfPreview("");
   setVideoPreview("");
   setProgress(0);

  }catch(err){
   setError("Upload failed ❌");
  }finally{
   setLoading(false);
  }

 };

 return(

  <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white min-h-screen">

   <Sidebar role="teacher"/>

   <div className="flex-1 md:ml-64">

    <Navbar />

    <div className="pt-20 px-4 md:px-8 flex justify-center">

     <div className="glass w-full max-w-3xl p-6 rounded-2xl space-y-5">

      <h1 className="text-2xl font-semibold">Upload Lecture</h1>

      {success && <div className="msg-success">{success}</div>}
      {error && <div className="msg-error">{error}</div>}

      {/* INPUTS */}
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="input"/>

      <input value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Optional link" className="input"/>

      {/* 🔥 FIXED SELECT */}
      <select
       value={courseId}
       onChange={(e)=>setCourseId(e.target.value)}
       className="input text-black"
      >
       <option value="" className="text-black">Select Course</option>

       {courses.map(c=>(
        <option key={c._id} value={c._id} className="text-black">
         {c.title}
        </option>
       ))}
      </select>

      <input value={book} onChange={(e)=>setBook(e.target.value)} placeholder="Book" className="input"/>

      {/* DRAG DROP */}
      <div className="grid md:grid-cols-2 gap-4">

       <div className="drop-box" onDrop={(e)=>handleDrop(e,"pdf")} onDragOver={(e)=>e.preventDefault()}>
        <p>Drop PDF here</p>
        <input type="file" accept="application/pdf" onChange={(e)=>handleFile(e.target.files[0],"pdf")} />
       </div>

       <div className="drop-box" onDrop={(e)=>handleDrop(e,"video")} onDragOver={(e)=>e.preventDefault()}>
        <p>Drop Video here</p>
        <input type="file" accept="video/*" onChange={(e)=>handleFile(e.target.files[0],"video")} />
       </div>

      </div>

      {/* PREVIEW */}
      {pdfPreview && (
       <iframe src={pdfPreview} className="preview-box"/>
      )}

      {videoPreview && (
       <video src={videoPreview} controls className="preview-box"/>
      )}

      {/* PROGRESS */}
      {progress > 0 && (
       <div className="progress">
        <div style={{width:`${progress}%`}}></div>
       </div>
      )}

      <button onClick={upload} disabled={loading} className="btn-main">
       {loading ? "Uploading..." : "Upload 🚀"}
      </button>

     </div>

    </div>

   </div>

   <style>{`
    .glass{
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }

    .input{
     width:100%;
     padding:12px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
    }

    /* 🔥 IMPORTANT FIX */
    select.input {
     color: black;
     background: white;
    }

    .drop-box{
     padding:20px;
     border:2px dashed rgba(255,255,255,0.2);
     border-radius:12px;
     text-align:center;
    }

    .preview-box{
     width:100%;
     height:200px;
     border-radius:10px;
    }

    .progress{
     height:8px;
     background:#222;
     border-radius:10px;
    }

    .progress div{
     height:100%;
     background:linear-gradient(to right,#6366f1,#9333ea);
    }

    .btn-main{
     width:100%;
     padding:12px;
     border-radius:12px;
     background:linear-gradient(to right,#6366f1,#9333ea);
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

export default UploadLecture;