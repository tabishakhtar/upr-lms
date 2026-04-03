const Lecture = require("../models/Lecture");
const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");


const csv = require("csv-parser");
const fs = require("fs");

// ================= HELPER FUNCTIONS =================
const calculateGrade = (marks)=>{
 if(marks >= 85) return "A";
 if(marks >= 70) return "B";
 if(marks >= 50) return "C";
 return "F";
};

const calculateGPA = (grade)=>{
 if(grade === "A") return 4;
 if(grade === "B") return 3;
 if(grade === "C") return 2;
 return 0;
};

// ================= LECTURE =================
exports.uploadLecture = async (req, res) => {
 try{

  const { course, title, teacherId, content, book } = req.body;

  if (!course || !title) {
   return res.status(400).json({ message: "Course and Title are required" });
  }

  let fileUrl = null;

  if (req.files?.pdf) {
   fileUrl = "/" + req.files["pdf"][0].path.replace(/\\/g, "/");
  }

  if (!fileUrl && req.files?.video) {
   fileUrl = "/" + req.files["video"][0].path.replace(/\\/g, "/");
  }

  if (!fileUrl && !content) {
   return res.status(400).json({
    message: "Upload file or provide link",
   });
  }

  const lecture = await Lecture.create({
   title,
   content: content || null,
   fileUrl,
   book: book || null,
   course,
   teacher: teacherId,
  });

  res.json({ message:"Lecture uploaded", lecture });

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
};

exports.getLectures = async (req,res)=>{
 try{
  const {courseId} = req.params;
  const lectures = await Lecture.find({course:courseId});
  res.json(lectures);
 }catch(err){
  res.status(500).json(err);
 }
};

// ================= ATTENDANCE =================


exports.markAttendance = async (req,res)=>{
 try{

  const { courseId, studentId, status } = req.body;

  const isRegistered = await Registration.findOne({
   student: studentId,
   courses: courseId,
   status: "approved"
  });

  if(!isRegistered){
   return res.status(400).json({
    message: "Student not registered in this course ❌"
   });
  }

  const attendance = new Attendance({
   course: courseId,
   student: studentId,
   status,
   date: new Date() // ✅ ADD THIS
  });

  await attendance.save();

  res.json({ message:"Attendance marked successfully ✅" });

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
};

exports.getCourseAttendance = async (req,res)=>{
 try{
  const {courseId} = req.params;

  const attendance = await Attendance.find({course:courseId})
   .populate("student","name email");

  res.json(attendance);
 }catch(err){
  res.status(500).json(err);
 }
};

// ================= QUIZ =================
exports.createQuiz = async (req,res)=>{
 try{
  const {courseId,questions} = req.body;

  const quiz = new Quiz({
   course:courseId,
   questions
  });

  await quiz.save();

  res.json({message:"Quiz created",quiz});
 }catch(err){
  res.status(500).json(err);
 }
};

exports.getQuiz = async (req,res)=>{
 try{
  const {courseId} = req.params;
  const quiz = await Quiz.findOne({course:courseId});
  res.json(quiz);
 }catch(err){
  res.status(500).json(err);
 }
};

exports.submitQuiz = async (req,res)=>{
 try{
  const {courseId,answers} = req.body;

  const quiz = await Quiz.findOne({course:courseId});

  let score = 0;

  quiz.questions.forEach((q,index)=>{
   if(q.correctAnswer === answers[index]){
    score++;
   }
  });

  res.json({
   score,
   total:quiz.questions.length
  });

 }catch(err){
  res.status(500).json(err);
 }
};

// ================= RESULT =================
exports.uploadResult = async (req,res)=>{
 try{

  const {studentId,courseId,marks,semester} = req.body;

  const grade = calculateGrade(Number(marks));
  const gpa = calculateGPA(grade);

  const result = new Result({
   student:studentId,
   course:courseId,
   marks,
   grade,
   gpa,
   semester
  });

  await result.save();

  res.json({message:"Result uploaded",result});

 }catch(err){
  res.status(500).json(err);
 }
};

// ================= STUDENT RESULTS =================
exports.getStudentResults = async (req,res)=>{
 try{
  const {studentId} = req.params;

  const results = await Result.find({student:studentId})
   .populate("course","title");

  res.json(results);

 }catch(err){
  res.status(500).json(err);
 }
};

// ================= TRANSCRIPT =================
exports.getTranscript = async (req,res)=>{
 try{

  const {studentId} = req.params;

  const results = await Result.find({student:studentId})
   .populate("course","title");

  const grouped = {};

  results.forEach(r=>{
   if(!grouped[r.semester]){
    grouped[r.semester] = [];
   }
   grouped[r.semester].push(r);
  });

  res.json(grouped);

 }catch(err){
  res.status(500).json(err);
 }
};

// ================= BULK UPLOAD =================
exports.bulkUploadResults = async (req,res)=>{
 try{

  const results = [];

  fs.createReadStream(req.file.path)
   .pipe(csv())
   .on("data",(row)=>{

    const grade = calculateGrade(Number(row.marks));

    results.push({
     student: row.studentId,
     course: row.courseId,
     marks: row.marks,
     grade
    });

   })
   .on("end", async ()=>{

    await Result.insertMany(results);

    res.json({message:"Bulk upload success 🚀"});

   });

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
};
exports.getCourseRanking = async (req,res)=>{
 try{

  const {courseId} = req.params;

  const results = await Result.find({course:courseId})
   .populate("student","name")
   .sort({marks:-1});

  const ranked = results.map((r,index)=>({
   rank:index+1,
   name:r.student.name,
   marks:r.marks,
   grade:r.grade
  }));

  res.json(ranked);

 }catch(err){
  res.status(500).json(err);
 }
};