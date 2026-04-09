import React,{useState} from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function BulkUploadResults(){

 const [file,setFile] = useState(null);
 const [msg,setMsg] = useState("");

 const upload = async ()=>{

  if(!file){
   setMsg("Select CSV file ❌");
   return;
  }

  const formData = new FormData();
  formData.append("file",file);

  await API.post("/teacher/upload-results-bulk",formData);

  setMsg("Uploaded Successfully 🚀");

 };

 return(

  <div className="flex bg-black text-white min-h-screen">

   <Sidebar role="teacher"/>

   <div className="flex-1 md:ml-64">

    <Navbar/>

    <div className="pt-20 p-6">

     <div className="glass p-6 rounded-xl max-w-md mx-auto">

      <h1 className="text-xl mb-4">Bulk Upload Results</h1>

      <input
       type="file"
       accept=".csv"
       onChange={(e)=>setFile(e.target.files[0])}
      />

      <button onClick={upload} className="btn-main mt-4">
       Upload CSV
      </button>

      <p className="mt-3">{msg}</p>

     </div>

    </div>

   </div>

  </div>

 );

}

export default BulkUploadResults;