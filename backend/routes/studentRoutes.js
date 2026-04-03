const express = require("express");
const router = express.Router();

const {
 attemptQuiz,
 registerSemester,
 getMyCourses,
 getLectures,
 getMyResults,
 getMyAttendance,
 getCourseQuizzes,getTranscript,getSingleQuiz
} = require("../controllers/studentController");

// Quiz
router.post("/quiz/attempt", attemptQuiz);
router.get("/quizzes/:courseId", getCourseQuizzes);
router.get("/quiz/:id", getSingleQuiz);

// Registration
router.post("/register", registerSemester);


// Courses
router.get("/my-courses/:studentId", getMyCourses);

// Results
router.get("/my-results/:studentId", getMyResults);

// Attendance
router.get("/my-attendance/:studentId", getMyAttendance);
router.get("/my-courses/:studentId", getMyCourses);
router.get("/lectures/:courseId", getLectures);
router.get("/transcript/:studentId", getTranscript);

module.exports = router;