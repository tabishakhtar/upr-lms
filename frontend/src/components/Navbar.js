import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function Navbar({ setSidebarOpen }) {

 const navigate = useNavigate();

 const [notifications, setNotifications] = useState([]);
 const [open, setOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);

 const notifRef = useRef();
 const profileRef = useRef();

 const role = localStorage.getItem("role");
 const name = localStorage.getItem("name") || "User";

 // 🔥 CLICK OUTSIDE CLOSE
 useEffect(() => {
  const handleClick = (e) => {
   if (notifRef.current && !notifRef.current.contains(e.target)) {
    setOpen(false);
   }
   if (profileRef.current && !profileRef.current.contains(e.target)) {
    setProfileOpen(false);
   }
  };
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
 }, []);

 useEffect(() => {

  fetchNotifications();

  socket.on("newNotification", (data) => {
   setNotifications(prev => [{ message: data.message }, ...prev]);
  });

  return () => socket.off("newNotification");

 }, []);

 const fetchNotifications = async () => {
  const userId = localStorage.getItem("userId");
  const res = await API.get(`/notifications/${userId}`);
  setNotifications(res.data || []);
 };

 const handleLogout = () => {
  localStorage.clear();
  navigate("/");
 };

 const avatar = name.charAt(0).toUpperCase();

 return (

  <div className="navbar">

   {/* LEFT */}
   <div className="flex items-center gap-4">

    <button
     onClick={() => setSidebarOpen(true)}
     className="text-xl md:hidden"
    >
     <FaBars />
    </button>

    <h2 className="title">
     {role?.toUpperCase()} DASHBOARD
    </h2>

   </div>

   {/* RIGHT */}
   <div className="flex items-center gap-4 md:gap-6">

    {/* 🔔 NOTIFICATION */}
    <div className="relative" ref={notifRef}>

     <button
      onClick={()=>setOpen(!open)}
      className="icon-btn"
     >
      🔔
     </button>

     {notifications.length > 0 && (
      <span className="badge">
       {notifications.length}
      </span>
     )}

     {open && (
      <div className="dropdown notif">

       <h3 className="dropdown-title">Notifications</h3>

       {notifications.length === 0 ? (
        <p className="empty">No notifications</p>
       ) : (
        notifications.map((n,i)=>(
         <div key={i} className="notif-item">
          {n.message}
         </div>
        ))
       )}

      </div>
     )}

    </div>

    {/* 👤 PROFILE */}
    <div className="relative" ref={profileRef}>

     <button
      onClick={()=>setProfileOpen(!profileOpen)}
      className="avatar"
     >
      {avatar}
     </button>

     {profileOpen && (
      <div className="dropdown profile">

       <div className="profile-header">
        <div className="avatar big">{avatar}</div>
        <div>
         <p className="name">{name}</p>
         <p className="role">{role}</p>
        </div>
       </div>

       <button
        onClick={handleLogout}
        className="logout"
       >
        Logout
       </button>

      </div>
     )}

    </div>

   </div>

   {/* STYLE */}
   <style>{`

    .navbar {
     position:fixed;
     top:0;
     left:0;
     right:0;
     height:60px;
     display:flex;
     align-items:center;
     justify-content:space-between;
     padding:0 16px;
     background:rgba(0,0,0,0.7);
     backdrop-filter:blur(12px);
     border-bottom:1px solid rgba(255,255,255,0.1);
     z-index:50;
    }

    .title {
     font-size:14px;
     font-weight:600;
    }

    .icon-btn {
     width:40px;
     height:40px;
     border-radius:50%;
     background:rgba(255,255,255,0.1);
     display:flex;
     align-items:center;
     justify-content:center;
     transition:0.3s;
    }

    .icon-btn:hover {
     background:rgba(255,255,255,0.2);
    }

    .badge {
     position:absolute;
     top:-4px;
     right:-4px;
     background:#ef4444;
     color:white;
     font-size:10px;
     padding:2px 6px;
     border-radius:999px;
    }

    .avatar {
     width:40px;
     height:40px;
     border-radius:50%;
     background:linear-gradient(to right,#6366f1,#3b82f6);
     display:flex;
     align-items:center;
     justify-content:center;
     font-weight:bold;
     cursor:pointer;
    }

    .avatar.big {
     width:50px;
     height:50px;
    }

    .dropdown {
     position:absolute;
     right:0;
     margin-top:10px;
     width:260px;
     background:rgba(255,255,255,0.05);
     backdrop-filter:blur(12px);
     border:1px solid rgba(255,255,255,0.1);
     border-radius:14px;
     padding:12px;
     animation:fadeIn 0.2s ease;
    }

    .dropdown-title {
     font-size:14px;
     margin-bottom:8px;
     color:#9ca3af;
    }

    .notif-item {
     padding:8px;
     border-radius:8px;
     font-size:13px;
     transition:0.2s;
    }

    .notif-item:hover {
     background:rgba(255,255,255,0.1);
    }

    .empty {
     font-size:12px;
     color:#9ca3af;
    }

    .profile-header {
     display:flex;
     align-items:center;
     gap:10px;
     margin-bottom:10px;
    }

    .name {
     font-weight:600;
    }

    .role {
     font-size:12px;
     color:#9ca3af;
    }

    .logout {
     width:100%;
     padding:8px;
     border-radius:10px;
     background:#ef4444;
     margin-top:8px;
     transition:0.3s;
    }

    .logout:hover {
     background:#dc2626;
    }

    @keyframes fadeIn {
     from {opacity:0; transform:translateY(-5px);}
     to {opacity:1; transform:translateY(0);}
    }

   `}</style>

  </div>

 );

}

export default Navbar;