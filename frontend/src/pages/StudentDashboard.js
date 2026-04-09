import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]); // ✅ NEW

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      const res = await API.get(`/student/my-courses/${studentId}`);

      setCourses(res.data || []);

      // 🔥 FETCH QUIZZES FOR EACH COURSE
      let allQuizzes = [];

      for (let reg of res.data) {
        for (let course of reg.courses) {
          try {
            const studentId = localStorage.getItem("userId");

            const qRes = await API.get(
              `/student/quizzes/${course._id}?studentId=${studentId}`,
            );
            qRes.data.forEach((q) => {
              allQuizzes.push({
                ...q,
                courseName: course.title,
                teacher: course?.teacher?.name || "N/A",
              });
            });
          } catch (err) {
            console.log("Quiz fetch error", err);
          }
        }
      }

      setQuizzes(allQuizzes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="pt-20 px-4 md:px-8 space-y-8">
          {/* HEADER */}
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              🎓 Student Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Access your courses, quizzes & academic progress
            </p>
          </div>

          {/* ACTION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/chat">
              <div className="card border-blue-500/30">
                <h2>💬 Chat</h2>
                <p>Connect with teachers</p>
              </div>
            </Link>

            <Link to="/courses">
              <div className="card border-green-500/30">
                <h2>📚 Courses</h2>
                <p>View all courses</p>
              </div>
            </Link>

            <Link to="/register-semester">
              <div className="card border-purple-500/30">
                <h2>📝 Registration</h2>
                <p>Register semester</p>
              </div>
            </Link>

            {/* ✅ NEW QUIZ BUTTON */}
            <div className="card border-pink-500/30">
              <h2>🧠 Quiz</h2>
              <p>Attempt quizzes</p>
            </div>
          </div>

          {/* 🔥 QUIZ SECTION */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Quizzes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.length === 0 && (
                <p className="text-gray-400">No quizzes available</p>
              )}

              {quizzes.map((quiz) => (
                <div key={quiz._id} className="glass">
                  <h2 className="text-lg font-semibold">{quiz.title}</h2>

                  <p className="text-sm text-gray-400">📚 {quiz.courseName}</p>

                  <p className="text-sm text-gray-400">👨‍🏫 {quiz.teacher}</p>

                  <p className="text-xs text-yellow-400 mt-1">
                    ⏱ {quiz.duration || 10} mins
                  </p>

                  <Link to={`/attempt-quiz/${quiz._id}`}>
                    <button className="btn purple mt-3">Start Quiz</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* COURSES */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Approved Courses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length === 0 && (
                <p className="text-gray-400">No approved courses yet</p>
              )}

              {courses.map((reg) =>
                reg?.courses?.map((course) => (
                  <div key={course._id} className="glass">
                    <h2 className="text-xl font-semibold mb-2">
                      {course.title}
                    </h2>

                    <p className="text-gray-400">
                      👨‍🏫 {course?.teacher?.name || "Not Assigned"}
                    </p>

                    <p className="text-sm mt-2 text-green-400 font-medium">
                      ✔ Approved
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      <Link to={`/student-results/${course._id}`}>
                        <button className="btn purple">📊 View Result</button>
                      </Link>

                      <Link to={`/student-attendance/${course._id}`}>
                        <button className="btn green">
                          📝 View Attendance
                        </button>
                      </Link>

                      <Link to={`/course/${course._id}`}>
                        <button className="btn blue">📺 View Lectures</button>
                      </Link>
                    </div>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STYLE */}
      <style>{`

    .card {
      padding:16px;
      border-radius:16px;
      border:1px solid;
      background:rgba(255,255,255,0.03);
      backdrop-filter: blur(10px);
      transition:0.3s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .glass {
      padding:20px;
      border-radius:16px;
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(12px);
      transition:0.3s;
    }

    .glass:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.6);
    }

    .btn {
      width:100%;
      padding:10px;
      border-radius:10px;
      color:white;
      font-size:14px;
    }

    .btn.purple {
      background:linear-gradient(to right,#9333ea,#7e22ce);
    }

    .btn.green {
      background:linear-gradient(to right,#22c55e,#16a34a);
    }

    .btn.blue {
      background:linear-gradient(to right,#3b82f6,#2563eb);
    }

   `}</style>
    </div>
  );
}

export default StudentDashboard;
