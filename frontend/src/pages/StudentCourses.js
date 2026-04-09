import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function StudentCourses() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      const res = await API.get(`/student/my-courses/${studentId}`);
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>

      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold">
          📚 My Courses
        </h1>
        <p className="text-gray-400 text-sm">
          View your registered and approved courses
        </p>
      </div>

      {/* COURSES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        {courses.length === 0 && (
          <p className="text-gray-400">
            No courses found
          </p>
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

              <p className="text-sm mt-2 text-green-400">
                ✔ Approved
              </p>

              {/* ONLY VIEW */}
              <div className="mt-4">
                <Link to={`/course/${course._id}`}>
                  <button className="btn blue">
                    📺 View Lectures
                  </button>
                </Link>
              </div>

            </div>

          ))
        )}

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
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        }

        .btn {
          width:100%;
          padding:10px;
          border-radius:10px;
          color:white;
          transition:0.3s;
        }

        .btn.blue {
          background:linear-gradient(to right,#3b82f6,#2563eb);
        }

      `}</style>

    </Layout>
  );
}

export default StudentCourses;