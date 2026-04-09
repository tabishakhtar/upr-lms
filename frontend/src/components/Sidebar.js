import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaUpload,
  FaClipboardList,
  FaChartBar,
  FaFileAlt,
} from "react-icons/fa";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black border-r border-gray-800 z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        w-64`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <h1 className="font-bold text-lg tracking-wide text-white">
            UPR LMS
          </h1>
        </div>

        <ul className="mt-6 space-y-2 px-3">

          {/* Dashboard */}
          <Link to={`/${role}`}>
            <li className={`menu ${isActive(`/${role}`) && "active"}`}>
              <FaHome /> Dashboard
            </li>
          </Link>

          {/* ================= ADMIN ================= */}
          {role === "admin" && (
            <>
              <Link to="/students">
                <li className={`menu ${isActive("/students") && "active"}`}>
                  <FaUserGraduate /> Students
                </li>
              </Link>

              <Link to="/teachers">
                <li className={`menu ${isActive("/teachers") && "active"}`}>
                  <FaChalkboardTeacher /> Teachers
                </li>
              </Link>

              <Link to="/courses">
                <li className={`menu ${isActive("/courses") && "active"}`}>
                  <FaBook /> Courses
                </li>
              </Link>

              <Link to="/admin-analytics">
                <li className={`menu ${isActive("/admin-analytics") && "active"}`}>
                  <FaChartBar /> Analytics
                </li>
              </Link>
            </>
          )}

          {/* ================= TEACHER ================= */}
          {role === "teacher" && (
            <>
              <Link to="/upload-lecture">
                <li className={`menu ${isActive("/upload-lecture") && "active"}`}>
                  <FaUpload /> Upload
                </li>
              </Link>

              <Link to="/mark-attendance">
                <li className={`menu ${isActive("/mark-attendance") && "active"}`}>
                  <FaClipboardList /> Attendance
                </li>
              </Link>

              <Link to="/create-quiz">
                <li className={`menu ${isActive("/create-quiz") && "active"}`}>
                  <FaClipboardList /> Quiz
                </li>
              </Link>

              <Link to="/upload-result">
                <li className={`menu ${isActive("/upload-result") && "active"}`}>
                  <FaChartBar /> Results
                </li>
              </Link>
            </>
          )}

          {/* ================= STUDENT ================= */}
          {role === "student" && (
            <>
              <Link to="/student-courses">
                <li className={`menu ${isActive("/student-courses") && "active"}`}>
                  <FaBook /> Courses
                </li>
              </Link>

              {/* ✅ REPLACED LECTURES WITH ATTENDANCE */}
              <Link to="/student-all-attendance">
                <li className={`menu ${isActive("/student-all-attendance") && "active"}`}>
                  <FaClipboardList /> Attendance
                </li>
              </Link>

              <Link to="/student-results">
                <li className={`menu ${isActive("/student-results") && "active"}`}>
                  <FaChartBar /> Results
                </li>
              </Link>

              <Link to="/student-transcript">
                <li className={`menu ${isActive("/student-transcript") && "active"}`}>
                  <FaFileAlt /> Transcript
                </li>
              </Link>
            </>
          )}
        </ul>

        {/* FOOTER */}
        <div className="absolute bottom-4 w-full text-center text-xs text-gray-500">
          © UPR LMS
        </div>

        {/* STYLE */}
        <style>{`
          .menu {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 10px;
            color: #9ca3af;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .menu:hover {
            background: linear-gradient(to right, #1f2937, #111827);
            color: white;
            transform: translateX(4px);
          }

          .active {
            background: white;
            color: black;
            font-weight: 600;
          }
        `}</style>

      </div>
    </>
  );
}

export default Sidebar;