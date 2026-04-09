import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
function StudentResults() {
  const [results, setResults] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);
 const { courseId } = useParams();

const fetchResults = async () => {
  try {
    const studentId = localStorage.getItem("userId");

    const res = await API.get(`/student/my-results/${studentId}`);

    let finalData = res.data;

    // ✅ ONLY FILTER IF courseId EXISTS
    if (courseId) {
      finalData = res.data.filter(
        (r) => String(r.course?._id) === String(courseId)
      );
    }

    setResults(finalData);

    // GROUPING (same)
    const groupedData = {};
    finalData.forEach((r) => {
      const sem = r.semester || "N/A";
      if (!groupedData[sem]) groupedData[sem] = [];
      groupedData[sem].push(r);
    });

    setGrouped(groupedData);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // 🔥 GPA CALCULATION
  const calculateGPA = (grade) => {
    if (grade === "A") return 4;
    if (grade === "B") return 3;
    if (grade === "C") return 2;
    return 0;
  };

  // 🔥 PDF DOWNLOAD
  const downloadPDF = (r) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("UPR LMS - Result Card", 20, 20);

    doc.setFontSize(12);
    doc.text(`Course: ${r.course.title}`, 20, 40);
    doc.text(`Marks: ${r.marks}`, 20, 50);
    doc.text(`Grade: ${r.grade}`, 20, 60);

    doc.save(`${r.course.title}-result.pdf`);
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white min-h-screen">
      <Sidebar role="student" />

      <div className="flex-1 md:ml-64">
        <Navbar />

        <div className="pt-20 px-4 md:px-8">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Results</h1>
            <p className="text-gray-400 text-sm">
              Semester-wise performance overview
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="text-center mt-20 text-gray-400">
              Loading results...
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center mt-20 text-gray-400">
              No results available
            </div>
          ) : (
            Object.keys(grouped).map((sem) => {
              const semesterData = grouped[sem];

              const semesterGPA =
                semesterData.reduce((a, r) => a + calculateGPA(r.grade), 0) /
                semesterData.length;

              return (
                <div key={sem} className="mb-10">
                  {/* SEMESTER HEADER */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Semester {sem}</h2>

                    <div className="bg-white/10 px-4 py-1 rounded-full text-sm">
                      GPA: {semesterGPA.toFixed(2)}
                    </div>
                  </div>

                  {/* CARDS */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {semesterData.map((r) => {
                      const percent = (r.marks / 100) * 100;

                      return (
                        <div
                          key={r._id}
                          className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition"
                        >
                          {/* COURSE */}
                          <h3 className="text-lg font-semibold mb-2">
                            {r.course.title}
                          </h3>

                          {/* MARKS */}
                          <p className="text-sm text-gray-400 mb-1">
                            Marks: <span className="text-white">{r.marks}</span>
                          </p>

                          {/* GRADE */}
                          <p className="text-sm mb-2">
                            Grade:
                            <span
                              className={`ml-2 font-semibold ${
                                r.grade === "A"
                                  ? "text-green-400"
                                  : r.grade === "B"
                                    ? "text-blue-400"
                                    : r.grade === "C"
                                      ? "text-yellow-400"
                                      : "text-red-400"
                              }`}
                            >
                              {r.grade}
                            </span>
                          </p>

                          {/* GPA */}
                          <p className="text-sm mb-3 text-gray-400">
                            GPA: {calculateGPA(r.grade)}
                          </p>

                          {/* 🔥 PROGRESS BAR */}
                          <div className="mb-4">
                            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-gradient-to-r from-green-400 to-blue-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {percent.toFixed(0)}%
                            </p>
                          </div>

                          {/* DOWNLOAD */}
                          <button
                            onClick={() => downloadPDF(r)}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition text-sm font-semibold"
                          >
                            Download PDF
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
