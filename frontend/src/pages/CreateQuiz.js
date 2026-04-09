import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function CreateQuiz(){

 const [courseId,setCourseId] = useState("");
 const [courses,setCourses] = useState([]);

 const [duration,setDuration] = useState("");

 const [questions,setQuestions] = useState([
  { question:"", image:null, imagePreview:"", options:["","","",""], correctAnswer:0 }
 ]);

 const [preview,setPreview] = useState(false);

 const [success,setSuccess] = useState("");
 const [error,setError] = useState("");
 const [loading,setLoading] = useState(false);

 useEffect(()=>{
  fetchCourses();
 },[]);

 // 🔥 FETCH ONLY TEACHER COURSES
 const fetchCourses = async ()=>{
  try{

   const teacherId = localStorage.getItem("userId");

   const res = await API.get(`/admin/courses/teacher/${teacherId}`);
   setCourses(res.data);

  }catch(err){
   console.log(err);
  }
 };

 // ADD QUESTION
 const addQuestion = ()=>{
  setQuestions([
   ...questions,
   { question:"", image:null, imagePreview:"", options:["","","",""], correctAnswer:0 }
  ]);
 };

 const updateQuestion = (index,field,value)=>{
  const updated = [...questions];
  updated[index][field] = value;
  setQuestions(updated);
 };

 const updateOption = (qIndex,optIndex,value)=>{
  const updated = [...questions];
  updated[qIndex].options[optIndex] = value;
  setQuestions(updated);
 };

 const handleImage = (index,file)=>{
  const updated = [...questions];
  updated[index].image = file;
  updated[index].imagePreview = URL.createObjectURL(file);
  setQuestions(updated);
 };

 const handleSubmit = async ()=>{

  try{

   setLoading(true);

   const formattedQuestions = questions.map(q=>({
    question:q.question,
    options:q.options,
    correctAnswer:q.options[q.correctAnswer],
    image:q.imagePreview
   }));

   await API.post("/teacher/create-quiz",{
    courseId,
    questions:formattedQuestions,
    duration
   });

   setSuccess("Quiz created successfully 🚀");
   setPreview(false);

  }catch(err){
   setError("Error creating quiz ❌");
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

     <div className="glass w-full max-w-4xl p-6 rounded-2xl space-y-6">

      <h1 className="text-2xl font-semibold">Create Advanced Quiz</h1>

      {success && <div className="msg-success">{success}</div>}
      {error && <div className="msg-error">{error}</div>}

      {/* 🔥 FIXED DROPDOWN */}
      <select
       value={courseId}
       onChange={(e)=>setCourseId(e.target.value)}
       className="select-dark"
      >
       <option value="">Select Your Course</option>

       {courses.map(c=>(
        <option key={c._id} value={c._id}>
         {c.title}
        </option>
       ))}

      </select>

      {/* TIMER */}
      <input
       placeholder="Quiz Duration (minutes)"
       value={duration}
       onChange={(e)=>setDuration(e.target.value)}
       className="input"
      />

      {/* QUESTIONS */}
      {questions.map((q,index)=>(

       <div key={index} className="card">

        <h3 className="font-semibold mb-2">Question {index+1}</h3>

        <input
         value={q.question}
         onChange={(e)=>updateQuestion(index,"question",e.target.value)}
         placeholder="Enter question"
         className="input mb-2"
        />

        <input
         type="file"
         accept="image/*"
         onChange={(e)=>handleImage(index,e.target.files[0])}
        />

        {q.imagePreview && (
         <img src={q.imagePreview} className="preview-img"/>
        )}

        {q.options.map((opt,i)=>(
         <div key={i} className="flex gap-2 mb-2">

          <input
           type="radio"
           name={`correct-${index}`}
           checked={q.correctAnswer === i}
           onChange={()=>updateQuestion(index,"correctAnswer",i)}
          />

          <input
           value={opt}
           onChange={(e)=>updateOption(index,i,e.target.value)}
           placeholder={`Option ${i+1}`}
           className="input"
          />

         </div>
        ))}

       </div>

      ))}

      <div className="flex gap-3 flex-wrap">

       <button onClick={addQuestion} className="btn-gray">
        + Add Question
       </button>

       <button onClick={()=>setPreview(true)} className="btn-blue">
        Preview
       </button>

       <button onClick={handleSubmit} className="btn-main">
        Submit Quiz 🚀
       </button>

      </div>

     </div>

    </div>

   </div>

   {/* STYLE */}
   <style>{`

    .glass{
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }

    .input{
     width:100%;
     padding:10px;
     border-radius:10px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     color:white;
    }

    /* 🔥 FIXED SELECT */
    .select-dark{
     width:100%;
     padding:10px;
     border-radius:10px;
     background:#111;
     color:white;
     border:1px solid rgba(255,255,255,0.2);
    }

    .select-dark option{
     background:#111;
     color:white;
    }

    .card{
     padding:15px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
    }

    .btn-main{
     padding:10px 16px;
     background:linear-gradient(to right,#6366f1,#9333ea);
     border-radius:10px;
    }

    .btn-gray{
     padding:10px;
     background:#374151;
     border-radius:10px;
    }

    .btn-blue{
     padding:10px;
     background:#3b82f6;
     border-radius:10px;
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

    .preview-img{
     width:100%;
     max-height:200px;
     border-radius:10px;
     margin-top:5px;
    }

   `}</style>

  </div>

 );

}

export default CreateQuiz;