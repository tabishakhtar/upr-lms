const express = require("express");
const router = express.Router();

// ✅ Controllers
const {
 createTeacher,
 createStudent,
 createCourse,
 getTeachers,
 getStudents, // ✅ ONLY THIS (smart filter inside)
 deleteTeacher,
 deleteStudent,
 updateTeacher,
 updateStudent,
 enrollStudent,
 getCourses,
 getRegistrations,
 getTeacherCourses,
 updateRegistrationStatus,
 deleteCourse,
 getPendingStudents,
 updateStudentStatus,
} = require("../controllers/adminController");

// ✅ Multer upload
const upload = require("../middleware/upload");

// ================= ROUTES =================

// 🔹 Teachers
router.post("/create-teacher", createTeacher);
router.get("/teachers", getTeachers);
router.delete("/teacher/:id", deleteTeacher);
router.put("/teacher/:id", updateTeacher);

// 🔹 Students
router.post("/create-student", createStudent);

// ✅ IMPORTANT (ONLY ONE ROUTE)
router.get("/students", getStudents);

router.delete("/student/:id", deleteStudent);
router.put("/student/:id", updateStudent);
router.get("/pending-students", getPendingStudents);
router.put("/student-status/:id", updateStudentStatus);

// 🔹 Courses
router.post("/create-course", upload.single("file"), createCourse);
router.delete("/course/:id", deleteCourse);
router.get("/courses", getCourses);
router.get("/courses/teacher/:teacherId", getTeacherCourses);

// 🔹 Enrollment
router.post("/enroll", enrollStudent);

// 🔹 Registrations
router.get("/registrations", getRegistrations);
router.put("/registration/:id", updateRegistrationStatus);

module.exports = router;