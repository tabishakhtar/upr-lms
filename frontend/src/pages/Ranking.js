import React,{useEffect,useState} from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Ranking(){

 const [data,setData] = useState([]);
 const [courseId,setCourseId] = useState("");

 const fetchRanking = async ()=>{
  const res = await API.get(`/teacher/ranking/${courseId}`);
  setData(res.data);
 };

 return(

  <div className="flex bg-black text-white min-h-screen">

   <Sidebar role="teacher"/>

   <div className="flex-1 md:ml-64">

    <Navbar/>

    <div className="pt-20 p-6">

     <h1 className="text-xl mb-4">Course Ranking</h1>

     <input
      placeholder="Enter Course ID"
      onChange={(e)=>setCourseId(e.target.value)}
      className="input"
     />

     <button onClick={fetchRanking} className="btn-main mt-2">
      Load Ranking
     </button>

     <div className="mt-6">

      {data.map(r=>(
       <div key={r.rank} className="card mb-2">

        <p>#{r.rank} - {r.name}</p>
        <p>Marks: {r.marks} | Grade: {r.grade}</p>

       </div>
      ))}

     </div>

    </div>

   </div>

  </div>

 );

}

export default Ranking;