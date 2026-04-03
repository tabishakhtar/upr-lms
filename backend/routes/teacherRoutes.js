const express = require("express");
const router = express.Router();

const {
 getQuiz,
 submitQuiz,
 markAttendance,
 getCourseAttendance,
 createQuiz,
 uploadResult,
 uploadLecture,
 getStudentResults,
 getLectures,getTranscript,bulkUploadResults,getCourseRanking
} = require("../controllers/teacherController");

const upload = require("../middleware/upload");
const Attendance = require("../models/Attendance"); // 🔥 ADD THIS


// ================= LECTURE UPLOAD =================
router.post(
 "/upload-lecture",
 upload.fields([
  { name: "pdf", maxCount: 1 },
  { name: "video", maxCount: 1 }
 ]),
 uploadLecture
);


// ================= ATTENDANCE =================

// Single attendance (old)
router.post("/attendance", markAttendance);

// 🔥 BULK ATTENDANCE (NEW FIX)
router.post("/attendance/bulk", async (req,res)=>{
 try{

  const data = req.body;

  if(!data || data.length === 0){
   return res.status(400).json({ message:"No attendance data provided" });
  }

  // 🔥 OPTIONAL: remove old attendance of same course (avoid duplicates)
  await Attendance.deleteMany({ course: data[0].courseId });

  const records = data.map(d=>({
   course: d.courseId,
   student: d.studentId,
   status: d.status
  }));

  await Attendance.insertMany(records);

  res.json({ message:"Bulk attendance saved successfully ✅" });

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
});


// Get attendance
router.get("/attendance/:courseId", getCourseAttendance);


// ================= QUIZ =================
router.post("/create-quiz", createQuiz);
router.get("/quiz/:courseId", getQuiz);
router.post("/submit-quiz", submitQuiz);


// ================= RESULT =================
router.post("/upload-result", uploadResult);
router.get("/results/:studentId", getStudentResults);
router.get("/transcript/:studentId", getTranscript);
router.post("/upload-results-bulk", upload.single("file"), bulkUploadResults);
router.get("/ranking/:courseId", getCourseRanking);

// ================= LECTURES =================
router.get("/lectures/:courseId", getLectures);


module.exports = router;