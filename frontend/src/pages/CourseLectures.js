import React, {useEffect,useState} from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";

function CourseLectures(){

 const {courseId} = useParams();

 const [lectures,setLectures] = useState([]);

 useEffect(()=>{
  fetchLectures();
 },[]);

 const fetchLectures = async ()=>{

  const res = await API.get(`/teacher/lectures/${courseId}`);
  setLectures(res.data);

 };

 return(

  <div className="p-10">

   <h1 className="text-2xl mb-6">Lectures</h1>

   {lectures.map(l=>(
    <div key={l._id} className="bg-white p-4 shadow mb-3">

     <h2 className="font-semibold">{l.title}</h2>

     <a href={l.content} target="_blank" rel="noreferrer" className="text-blue-500">
      Open Lecture
     </a>

    </div>
   ))}

  </div>

 );

}

export default CourseLectures;