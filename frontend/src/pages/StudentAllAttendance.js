import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function StudentAllAttendance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const studentId = localStorage.getItem("userId");

      const coursesRes = await API.get(`/student/my-courses/${studentId}`);

      let allCourses = [];

      coursesRes.data.forEach((reg) => {
        reg.courses.forEach((course) => {
          allCourses.push(course);
        });
      });

      let attendanceData = [];

      for (let course of allCourses) {
        try {
          // ✅ USE SAME API AS DASHBOARD
          const res = await API.get(
            `/student/my-attendance/${studentId}?courseId=${course._id}`,
          );

          const records = res.data || [];

          const total = records.length;
          const present = records.filter(
            (r) => r.status && r.status.toLowerCase().trim() === "present",
          ).length;
          const percentage =
            total > 0 ? Math.round((present / total) * 100) : 0;

          attendanceData.push({
            courseName: course.title,
            teacher: course?.teacher?.name || "N/A",
            records,
            percentage,
          });
        } catch (err) {
          console.log("Error:", err);
        }
      }

      setData(attendanceData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-semibold">📝 Attendance Overview</h1>
      </div>

      <div className="space-y-6 mt-6">
        {data.length === 0 && (
          <p className="text-gray-400">No attendance data found</p>
        )}

        {data.map((item, index) => (
          <div key={index} className="glass">
            <h2 className="text-xl font-semibold">{item.courseName}</h2>

            <p className="text-gray-400 mb-2">👨‍🏫 {item.teacher}</p>

            {/* % */}
            <p className="text-sm text-gray-300 mb-1">
              Attendance: {item.percentage}%
            </p>

            <div className="w-full bg-gray-700 rounded h-2 mb-3">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            {item.records.length === 0 ? (
              <p className="text-gray-500">No attendance yet</p>
            ) : (
              item.records.map((rec, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-gray-700 pb-1"
                >
                  <span>{new Date(rec.date).toLocaleDateString()}</span>
                  <span
                    className={
                      rec.status?.toLowerCase().trim() === "present"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {rec.status}
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <style>{`
        .glass {
          padding:20px;
          border-radius:16px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </Layout>
  );
}

export default StudentAllAttendance;
