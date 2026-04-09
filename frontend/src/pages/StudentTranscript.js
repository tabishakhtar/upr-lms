import React,{useEffect,useState} from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf"; // 🔥 HERE

function StudentTranscript(){

 const [data,setData] = useState({});

 useEffect(()=>{
  fetchData();
 },[]);

 const fetchData = async ()=>{
  const studentId = localStorage.getItem("userId");
  const res = await API.get(`/student/transcript/${studentId}`);
  setData(res.data);
 };

 // 🔥 PDF FUNCTION (PUT HERE)
 const downloadPDF = ()=>{

  const doc = new jsPDF();

  let y = 20;

  doc.text("University Transcript",20,y);
  y+=10;

  Object.keys(data).forEach(sem=>{
   doc.text(`Semester ${sem}`,20,y);
   y+=10;

   data[sem].forEach(r=>{
    doc.text(`${r.course.title} - ${r.grade}`,20,y);
    y+=8;
   });

   y+=5;
  });

  doc.save("transcript.pdf");
 };

 return(

  <div className="flex bg-black text-white min-h-screen">

   <Sidebar role="student"/>

   <div className="flex-1 md:ml-64">

    <Navbar/>

    <div className="pt-20 p-6">

     <h1 className="text-2xl mb-6">Transcript</h1>

     {Object.keys(data).map(sem=>{

      const semesterData = data[sem];

      const avgGPA =
       semesterData.reduce((a,r)=>a+r.gpa,0)/semesterData.length;

      return(
       <div key={sem} className="card mb-4">

        <h2>Semester {sem}</h2>
        <p>GPA: {avgGPA.toFixed(2)}</p>

        {semesterData.map(r=>(
         <p key={r._id}>
          {r.course.title} - {r.grade}
         </p>
        ))}

       </div>
      );

     })}

     <button onClick={downloadPDF} className="btn-main">
      Download Transcript PDF
     </button>

    </div>

   </div>

  </div>

 );

}

export default StudentTranscript;