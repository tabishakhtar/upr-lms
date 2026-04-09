import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

function AttemptQuiz(){

 const { id } = useParams();

 const [quiz,setQuiz] = useState(null);
 const [answers,setAnswers] = useState({});
 const [timeLeft,setTimeLeft] = useState(0);
 const [loading,setLoading] = useState(true);

 const [result,setResult] = useState(null); // ✅ RESULT SCREEN

 useEffect(()=>{
  fetchQuiz();
 },[]);

 // 🔥 FETCH QUIZ
 const fetchQuiz = async ()=>{
  try{
   const res = await API.get(`/student/quiz/${id}`);
   setQuiz(res.data);
   setTimeLeft((res.data.duration || 10) * 60);
   setLoading(false);
  }catch(err){
   console.log(err);
  }
 };

 // 🔥 TIMER
 useEffect(()=>{
  if(timeLeft <= 0 && quiz && !result){
   submitQuiz();
   return;
  }

  const timer = setInterval(()=>{
   setTimeLeft(prev => prev - 1);
  },1000);

  return ()=> clearInterval(timer);

 },[timeLeft, quiz]);

 // 🔥 SELECT ANSWER
 const selectAnswer = (qIndex, option)=>{
  setAnswers({
   ...answers,
   [qIndex]: option
  });
 };

 // 🔥 SUBMIT
 const submitQuiz = async ()=>{
  try{

   const studentId = localStorage.getItem("userId");

   const res = await API.post("/student/quiz/attempt",{
    quizId: id,
    studentId,
    answers
   });

   setResult(res.data); // ✅ SHOW RESULT SCREEN

  }catch(err){
   console.log(err);
  }
 };

 // 🔥 FORMAT TIME
 const formatTime = ()=>{
  const min = Math.floor(timeLeft/60);
  const sec = timeLeft % 60;
  return `${min}:${sec < 10 ? "0"+sec : sec}`;
 };

 if(loading) return <p className="p-6 text-white">Loading...</p>;

 // 🔥 RESULT SCREEN
 if(result){

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const passed = percentage >= 50;

  return(
   <Layout>

    <div className="result-container">

     <h1 className="title">Quiz Result</h1>

     <div className="score-box">

      <h2>{result.score} / {result.totalQuestions}</h2>

      <p className="percentage">{percentage}%</p>

      <p className={`status ${passed ? "pass" : "fail"}`}>
       {passed ? "PASS ✅" : "FAIL ❌"}
      </p>

     </div>

    </div>

    <style>{`
     .result-container {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      height:60vh;
      text-align:center;
     }

     .title {
      font-size:24px;
      margin-bottom:20px;
     }

     .score-box {
      padding:30px;
      border-radius:16px;
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.1);
     }

     .percentage {
      font-size:22px;
      margin-top:10px;
     }

     .status.pass {
      color:#22c55e;
      margin-top:10px;
     }

     .status.fail {
      color:#ef4444;
      margin-top:10px;
     }
    `}</style>

   </Layout>
  );
 }

 return(

  <Layout>

   <div className="container">

    {/* HEADER */}
    <div className="header">
     <h1>{quiz.title}</h1>
     <div className="timer">⏱ {formatTime()}</div>
    </div>

    {/* QUESTIONS */}
    {quiz.questions.map((q,index)=>(

     <div key={index} className="card">

      <h2>Q{index+1}. {q.question}</h2>

      <div className="options">

       {q.options.map((opt,i)=>(
        <div
         key={i}
         onClick={()=>selectAnswer(index,opt)}
         className={`option ${answers[index] === opt ? "active" : ""}`}
        >
         {opt}
        </div>
       ))}

      </div>

     </div>

    ))}

    {/* BUTTON */}
    <button onClick={submitQuiz} className="submit">
     Submit Quiz
    </button>

   </div>

   {/* STYLE */}
   <style>{`

    .container {
     display:flex;
     flex-direction:column;
     gap:16px;
    }

    .header {
     display:flex;
     justify-content:space-between;
     flex-wrap:wrap;
     gap:10px;
     align-items:center;
    }

    .timer {
     background:#dc2626;
     padding:8px 12px;
     border-radius:8px;
     font-weight:bold;
    }

    .card {
     padding:16px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
    }

    .options {
     margin-top:10px;
     display:flex;
     flex-direction:column;
     gap:8px;
    }

    .option {
     padding:10px;
     border-radius:8px;
     border:1px solid rgba(255,255,255,0.1);
     cursor:pointer;
    }

    .option:hover {
     background:rgba(255,255,255,0.1);
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

    /* 📱 MOBILE */
    @media(max-width:600px){
     .header h1 {
      font-size:18px;
     }
    }

   `}</style>

  </Layout>

 );

}

export default AttemptQuiz;