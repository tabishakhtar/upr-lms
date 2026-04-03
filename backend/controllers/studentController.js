const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

// ================= QUIZ =================

// 🔥 Attempt Quiz
const QuizAttempt = require("../models/QuizAttempt");

exports.attemptQuiz = async (req,res)=>{

 try{

  const {quizId,answers,studentId} = req.body;

  const quiz = await Quiz.findById(quizId);

  if(!quiz){
   return res.status(404).json({message:"Quiz not found"});
  }

  // 🔥 CHECK ALREADY ATTEMPTED
  const already = await QuizAttempt.findOne({
   student: studentId,
   quiz: quizId
  });

  if(already){
   return res.status(400).json({message:"Already attempted"});
  }

  let score = 0;

  quiz.questions.forEach((q,index)=>{
   if(q.correctAnswer === answers[index]){
    score++;
   }
  });

  // 🔥 SAVE ATTEMPT
  await QuizAttempt.create({
   student: studentId,
   quiz: quizId,
   score,
   total: quiz.questions.length
  });

  res.json({
   totalQuestions: quiz.questions.length,
   score
  });

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }

};

// 🔥 Get quizzes for specific course (NEW)


exports.getCourseQuizzes = async (req,res)=>{

 try{

  const { courseId } = req.params;
  const { studentId } = req.query;

  const quizzes = await Quiz.find({ course: courseId });

  // 🔥 GET ATTEMPTED
  const attempts = await QuizAttempt.find({ student: studentId });

  const attemptedIds = attempts.map(a => a.quiz.toString());

  // 🔥 FILTER
  const filtered = quizzes.filter(q =>
   !attemptedIds.includes(q._id.toString())
  );

  res.json(filtered);

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }

};

// ================= RESULTS =================

// 🔥 Get Student Results (with course filter FIXED)
exports.getMyResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.query;

    let query = { student: studentId };

    if (courseId) {
      query.course = courseId;
    }

    const results = await Result.find(query).populate("course", "title");

    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// ================= ATTENDANCE =================

// 🔥 Get Student Attendance (NEW - THIS WAS MISSING)
exports.getMyAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.query;

    let query = { student: studentId };

    if (courseId) {
      query.course = courseId;
    }

    const attendance = await Attendance.find(query).sort({ createdAt: -1 });

    res.json(attendance);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// ================= REGISTRATION =================

// 🔥 Submit registration
exports.registerSemester = async (req, res) => {
  try {
    const { studentId, semester, courses } = req.body;

    const reg = new Registration({
      student: studentId,
      semester,
      courses,
    });

    await reg.save();

    res.json({ message: "Registration submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// 🔥 Get approved courses
exports.getMyCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data = await Registration.find({
      student: studentId,
      status: "approved",
    }).populate({
      path: "courses",
      select: "title semester book teacher",
      populate: {
        path: "teacher",
        select: "name",
      },
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
const Lecture = require("../models/Lecture");

exports.getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lectures = await Lecture.find({ course: courseId }).sort({
      createdAt: -1,
    }); // latest first (optional)

    res.json(lectures);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await Result.find({ student: studentId }).populate(
      "course",
    );

    // group by semester
    const grouped = {};

    results.forEach((r) => {
      const sem = r.semester || "N/A";
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(r);
    });

    res.json(grouped);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getSingleQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
