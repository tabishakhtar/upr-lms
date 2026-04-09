import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Login";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResults from "./pages/StudentResults";
import StudentAttendance from "./pages/StudentAttendance";
import StudentCourses from "./pages/StudentCourses.js";

// Admin Pages
import CreateTeacher from "./pages/CreateTeacher";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import EnrollStudent from "./pages/EnrollStudent";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import CreateQuiz from "./pages/CreateQuiz";
import Attendance from "./pages/Attendance";
import Register from "./pages/Register";
import StudentAllAttendance from "./pages/StudentAllAttendance.js";

// Teacher Pages
import UploadLecture from "./pages/UploadLecture";
import Results from "./pages/Results";
import RegisterSemester from "./pages/RegisterSemester";
import Registrations from "./pages/Registrations";
import CourseDetails from "./pages/CourseDetails";
import StudentTranscript from "./pages/StudentTranscript";
import AdminAnalytics from "./pages/AdminAnalytics";
import AttemptQuiz from "./pages/AttemptQuiz";

// Shared
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        {/* 🔐 DASHBOARDS */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        {/* ✅ ADD THIS (FIX FOR SIDEBAR COURSES) */}
        <Route
          path="/student-courses"
          element={
            <ProtectedRoute role="student">
              <StudentCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-all-attendance"
          element={
            <ProtectedRoute role="student">
              <StudentAllAttendance />
            </ProtectedRoute>
          }
        />
        {/* 🔥 STUDENT ROUTES */}
        <Route
          path="/student-results/:courseId"
          element={
            <ProtectedRoute role="student">
              <StudentResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-attendance/:courseId"
          element={
            <ProtectedRoute role="student">
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-transcript"
          element={
            <ProtectedRoute role="student">
              <StudentTranscript />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-semester"
          element={
            <ProtectedRoute role="student">
              <RegisterSemester />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute role="student">
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        {/* ✅ OPTIONAL FIX (prevents lecture warning) */}
        <Route
          path="/student-results"
          element={
            <ProtectedRoute role="student">
              <StudentResults />
            </ProtectedRoute>
          }
        />
        {/* FALLBACK */}
        <Route
          path="/student-results"
          element={
            <div style={{ padding: "40px" }}>Please select a course first</div>
          }
        />
        <Route
          path="/student-attendance"
          element={
            <div style={{ padding: "40px" }}>Please select a course first</div>
          }
        />
        {/* 🔐 ADMIN ROUTES */}
        <Route
          path="/create-teacher"
          element={
            <ProtectedRoute role="admin">
              <CreateTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute role="admin">
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute role="admin">
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enroll"
          element={
            <ProtectedRoute role="admin">
              <EnrollStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute role={["admin", "student"]}>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attempt-quiz/:id"
          element={
            <ProtectedRoute role="student">
              <AttemptQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute role="admin">
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrations"
          element={
            <ProtectedRoute role="admin">
              <Registrations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-analytics"
          element={
            <ProtectedRoute role="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        {/* 🔐 TEACHER ROUTES */}
        <Route
          path="/upload-lecture"
          element={
            <ProtectedRoute role="teacher">
              <UploadLecture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-result"
          element={
            <ProtectedRoute role="teacher">
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <ProtectedRoute role="teacher">
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute role="teacher">
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        {/* 🔐 SHARED */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        {/* REGISTER PAGE (PUBLIC) */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
