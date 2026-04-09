import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import API from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

function AdminDashboard() {

 const [stats, setStats] = useState({
  students: 0,
  teachers: 0,
  courses: 0
 });

 const [activities, setActivities] = useState([]);

 useEffect(()=>{
  fetchStats();

  const interval = setInterval(fetchStats, 5000);
  return ()=>clearInterval(interval);

 },[]);

 const fetchStats = async () => {

  try{

   const [studentsRes, teachersRes, coursesRes] = await Promise.all([
    API.get("/admin/students"),
    API.get("/admin/teachers"),
    API.get("/admin/courses")
   ]);

   const newStats = {
    students: studentsRes.data.length,
    teachers: teachersRes.data.length,
    courses: coursesRes.data.length
   };

   setStats(newStats);

   setActivities(prev => [
    { text: "New student registered", time: "Just now" },
    ...prev.slice(0,4)
   ]);

  }catch(err){
   console.log(err);
  }

 };

 const chartData = [
  { name: "Students", value: stats.students },
  { name: "Teachers", value: stats.teachers },
  { name: "Courses", value: stats.courses }
 ];

 return (

  <Layout>

   <div className="space-y-8">

    {/* HEADER */}
    <div>
     <h1 className="text-3xl font-bold">Admin Dashboard</h1>
     <p className="text-gray-400 text-sm">
      Real-time LMS insights
     </p>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

     {[
      { title:"Students", value:stats.students },
      { title:"Teachers", value:stats.teachers },
      { title:"Courses", value:stats.courses }
     ].map((card,i)=>(
      <div key={i} className="glass">
       <h2 className="text-gray-400 text-sm">{card.title}</h2>
       <p className="text-3xl font-bold mt-2">{card.value}</p>
      </div>
     ))}

    </div>

    {/* ACTION BUTTONS */}
    <div className="flex flex-wrap gap-4">

     <Link to="/create-teacher">
      <button className="btn green">
       + Teacher
      </button>
     </Link>

     {/* ❌ REMOVED STUDENT BUTTON */}

     <Link to="/create-course">
      <button className="btn purple">
       + Course
      </button>
     </Link>

     <Link to="/registrations">
      <button className="btn orange">
       Registrations
      </button>
     </Link>

     {/* ✅ NEW CHAT BUTTON */}
     <Link to="/chat">
      <button className="btn blue">
       💬 Chat
      </button>
     </Link>

    </div>

    {/* GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

     {/* CHART */}
     <div className="lg:col-span-2 glass">
      <h2 className="mb-4 font-semibold">Growth Analytics</h2>
      <AnalyticsChart data={chartData} />
     </div>

     {/* ACTIVITY */}
     <div className="glass">
      <h2 className="mb-4 font-semibold">Recent Activity</h2>

      {activities.map((a,i)=>(
       <div key={i} className="text-sm mb-3 border-b border-gray-800 pb-2">
        <p>{a.text}</p>
        <span className="text-gray-500 text-xs">{a.time}</span>
       </div>
      ))}

     </div>

    </div>

    {/* INSIGHTS */}
    <div className="glass">

     <h2 className="mb-4 font-semibold">Admin Insights</h2>

     <div className="grid md:grid-cols-3 gap-4 text-sm">

      <div className="insight">📈 Growth is stable</div>
      <div className="insight">🎓 Courses engagement high</div>
      <div className="insight">⚠️ Add more teachers</div>

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
     transition:0.3s;
    }

    .glass:hover {
     transform: translateY(-4px);
     box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .btn {
     padding:10px 18px;
     border-radius:12px;
     color:white;
     font-weight:500;
     transition:0.3s;
    }

    .btn:hover {
     transform:scale(1.05);
    }

    .green {
     background:linear-gradient(to right,#22c55e,#16a34a);
    }

    .blue {
     background:linear-gradient(to right,#3b82f6,#2563eb);
    }

    .purple {
     background:linear-gradient(to right,#9333ea,#7e22ce);
    }

    .orange {
     background:linear-gradient(to right,#f97316,#ea580c);
    }

    .insight {
     padding:14px;
     border-radius:12px;
     background:rgba(255,255,255,0.05);
    }

   `}</style>

  </Layout>

 );

}

export default AdminDashboard;