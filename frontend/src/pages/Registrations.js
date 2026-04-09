import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function Registrations(){

 const [data,setData] = useState([]);
 const [loadingId,setLoadingId] = useState(null);

 useEffect(()=>{
  fetchData();
 },[]);

 const fetchData = async ()=>{
  try{
   const res = await API.get("/admin/registrations");
   setData(res.data || []);
  }catch(err){
   console.log(err);
  }
 };

 // ✅ APPROVE
 const approve = async (id)=>{
  try{
   setLoadingId(id);

   await API.put(`/admin/registration/${id}`,{
    status:"approved"
   });

   fetchData();

  }catch(err){
   console.log(err);
  }finally{
   setLoadingId(null);
  }
 };

 // ❌ REJECT
 const reject = async (id)=>{
  try{
   setLoadingId(id);

   await API.put(`/admin/registration/${id}`,{
    status:"rejected"
   });

   fetchData();

  }catch(err){
   console.log(err);
  }finally{
   setLoadingId(null);
  }
 };

 return(

  <Layout>

   <div className="space-y-8">

    {/* HEADER */}
    <div>
     <h1 className="text-3xl font-semibold">
      Student Registrations
     </h1>
     <p className="text-gray-400 text-sm">
      Approve or reject semester registrations
     </p>
    </div>

    {/* EMPTY */}
    {data.length === 0 && (
     <p className="text-gray-400">
      No registrations found
     </p>
    )}

    {/* GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

     {data.map((reg)=>(

      <div
       key={reg._id}
       className="glass-card"
      >

       {/* STUDENT */}
       <h2 className="text-lg font-semibold">
        👤 {reg.student?.name || "Unknown"}
       </h2>

       <p className="text-sm text-gray-400">
        📧 {reg.student?.email}
       </p>

       {/* SEMESTER */}
       <p className="mt-2 text-sm">
        🎓 Semester: <span className="font-medium">{reg.semester}</span>
       </p>

       {/* COURSES */}
       <div className="mt-3">
        <p className="text-sm font-semibold mb-1">Courses:</p>

        <ul className="text-sm text-gray-400 space-y-1">
         {reg.courses?.map((c)=>(
          <li key={c._id}>• {c.title}</li>
         ))}
        </ul>
       </div>

       {/* STATUS */}
       <div className="mt-4">
        <span className={`badge ${
         reg.status === "approved"
          ? "approved"
          : reg.status === "rejected"
          ? "rejected"
          : "pending"
        }`}>
         {reg.status}
        </span>
       </div>

       {/* ACTIONS */}
       {reg.status === "pending" && (
        <div className="mt-4 flex gap-2">

         <button
          onClick={(e)=>{
           e.stopPropagation();
           approve(reg._id);
          }}
          disabled={loadingId === reg._id}
          className="btn approve"
         >
          {loadingId === reg._id ? "..." : "Approve"}
         </button>

         <button
          onClick={(e)=>{
           e.stopPropagation();
           reject(reg._id);
          }}
          disabled={loadingId === reg._id}
          className="btn reject"
         >
          Reject
         </button>

        </div>
       )}

      </div>

     ))}

    </div>

   </div>

   {/* STYLE */}
   <style>{`

    .glass-card {
     padding:18px;
     border-radius:16px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     backdrop-filter: blur(12px);
     transition:0.3s;
    }

    .glass-card:hover {
     transform:translateY(-5px);
     box-shadow:0 12px 30px rgba(0,0,0,0.6);
    }

    .badge {
     padding:4px 10px;
     border-radius:999px;
     font-size:12px;
     font-weight:500;
    }

    .approved {
     background:#16a34a20;
     color:#22c55e;
    }

    .rejected {
     background:#dc262620;
     color:#ef4444;
    }

    .pending {
     background:#f59e0b20;
     color:#facc15;
    }

    .btn {
     flex:1;
     padding:8px;
     border-radius:10px;
     font-size:14px;
     font-weight:500;
     transition:0.3s;
    }

    .approve {
     background:linear-gradient(to right,#22c55e,#16a34a);
     color:white;
    }

    .reject {
     background:linear-gradient(to right,#ef4444,#dc2626);
     color:white;
    }

    .btn:hover {
     opacity:0.9;
    }

   `}</style>

  </Layout>

 );

}

export default Registrations;