import React,{useEffect,useState} from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import {
 BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
 PieChart, Pie, Cell
} from "recharts";

function AdminAnalytics(){

 const [results,setResults] = useState([]);

 useEffect(()=>{
  fetchData();
 },[]);

 const fetchData = async ()=>{
  try{
   const res = await API.get("/admin/results");
   setResults(res.data || []);
  }catch(err){
   console.log(err);
  }
 };

 const pass = results.filter(r=>r.marks>=50).length;
 const fail = results.filter(r=>r.marks<50).length;

 const avg =
  results.length
   ? (results.reduce((a,r)=>a+r.marks,0)/results.length).toFixed(1)
   : 0;

 const passPercent = results.length
  ? ((pass / results.length) * 100).toFixed(0)
  : 0;

 // 🔥 BAR DATA (Marks Distribution)
 const barData = results.map((r,index)=>({
  name: `S${index+1}`,
  marks: r.marks
 }));

 // 🔥 PIE DATA
 const pieData = [
  { name: "Pass", value: pass },
  { name: "Fail", value: fail }
 ];

 return(

  <Layout>

   <div className="space-y-8">

    {/* HEADER */}
    <div>
     <h1 className="text-3xl font-semibold">
      📊 Admin Analytics
     </h1>
     <p className="text-gray-400 text-sm">
      Performance insights with charts
     </p>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

     <div className="glass">
      <p className="label">Total Results</p>
      <h2 className="value">{results.length}</h2>
     </div>

     <div className="glass">
      <p className="label">Average Marks</p>
      <h2 className="value text-blue-400">{avg}</h2>
     </div>

     <div className="glass">
      <p className="label">Pass Rate</p>
      <h2 className="value text-green-400">
       {pass} / {fail}
      </h2>
      <p className="text-xs text-gray-400 mt-1">
       {passPercent}% Passed
      </p>
     </div>

    </div>

    {/* CHARTS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

     {/* BAR CHART */}
     <div className="glass h-[300px]">
      <p className="label mb-2">Marks Distribution</p>

      <ResponsiveContainer width="100%" height="100%">
       <BarChart data={barData}>
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip />
        <Bar dataKey="marks" />
       </BarChart>
      </ResponsiveContainer>

     </div>

     {/* PIE CHART */}
     <div className="glass h-[300px]">
      <p className="label mb-2">Pass vs Fail</p>

      <ResponsiveContainer width="100%" height="100%">
       <PieChart>
        <Pie
         data={pieData}
         dataKey="value"
         nameKey="name"
         outerRadius={100}
         label
        >
         {pieData.map((entry,index)=>(
          <Cell key={index} />
         ))}
        </Pie>
        <Tooltip />
       </PieChart>
      </ResponsiveContainer>

     </div>

    </div>

   </div>

   {/* STYLE */}
   <style>{`

    .glass {
     padding:20px;
     border-radius:16px;
     background:rgba(255,255,255,0.05);
     border:1px solid rgba(255,255,255,0.1);
     backdrop-filter: blur(12px);
    }

    .label {
     font-size:13px;
     color:#9ca3af;
    }

    .value {
     font-size:28px;
     font-weight:bold;
     margin-top:6px;
    }

   `}</style>

  </Layout>

 );

}

export default AdminAnalytics;