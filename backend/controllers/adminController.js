const User = require("../models/User");
const Course = require("../models/Course");
const Registration = require("../models/Registration");
const Notification = require("../models/Notification"); // ✅ added
const bcrypt = require("bcryptjs");


// Create Teacher
exports.createTeacher = async (req, res) => {
  try {

    const { name, email, password, teacherId } = req.body;

    if (!name || !email || !password || !teacherId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      teacherId
    });

    await teacher.save();

    res.json({
      message: "Teacher created successfully",
      teacher
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// Create Student
exports.createStudent = async (req,res)=>{

 try{

  const {name,email,password,studentId} = req.body;

  const hashedPassword = await bcrypt.hash(password,10);

  const student = new User({
   name,
   email,
   password:hashedPassword,
   role:"student",
   studentId
  });

  await student.save();

  res.json({message:"Student created successfully",student});

 }catch(err){
  res.status(500).json(err);
 }

};


// Create Course
exports.createCourse = async (req, res) => {
 try {

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const { title, description, teacherId, semester, book } = req.body;

  const fileUrl = req.file ? `/uploads/${req.file.filename}` : "";

  const course = await Course.create({
   title,
   description,
   teacherId,
   semester,
   book,
   fileUrl
  });

  res.json(course);

 } catch (err) {
  console.log(err);
  res.status(500).json({ message: "Server Error ❌" });
 }
};


// Get Teachers
exports.getTeachers = async (req, res) => {

 try {

  const teachers = await User.find({ role: "teacher" });

  res.json(teachers);

 } catch (err) {

  res.status(500).json(err);

 }

};


// Get Students
exports.getStudents = async (req,res)=>{

 try{

  const students = await User.find({role:"student"});

  res.json(students);

 }catch(err){

  res.status(500).json(err);

 }

};


// Delete Teacher
exports.deleteTeacher = async (req,res)=>{

 try{

  const {id} = req.params;

  await User.findByIdAndDelete(id);

  res.json({message:"Teacher deleted successfully"});

 }catch(err){

  res.status(500).json(err);

 }

};


// Delete Student
exports.deleteStudent = async (req,res)=>{

 try{

  const {id} = req.params;

  await User.findByIdAndDelete(id);

  res.json({message:"Student deleted successfully"});

 }catch(err){

  res.status(500).json(err);

 }

};


// Update Teacher
exports.updateTeacher = async (req,res)=>{
 try{

  const {id} = req.params;
  const {name,email,teacherId} = req.body;

  const updatedTeacher = await User.findByIdAndUpdate(
   id,
   {name,email,teacherId},
   {new:true}
  );

  res.json(updatedTeacher);

 }catch(err){
  res.status(500).json(err);
 }
};


// Update Student
exports.updateStudent = async (req,res)=>{
 try{

  const {id} = req.params;
  const {name,email,studentId} = req.body;

  const updated = await User.findByIdAndUpdate(
   id,
   {name,email,studentId},
   {new:true}
  );

  res.json(updated);

 }catch(err){
  res.status(500).json(err);
 }
};


// Enroll Student
exports.enrollStudent = async (req,res)=>{

 try{

  const {studentId,courseId} = req.body;

  const course = await Course.findById(courseId);

  course.students.push(studentId);

  await course.save();

  res.json({message:"Student enrolled successfully"});

 }catch(err){

  res.status(500).json(err);

 }

};


// Get Courses
exports.getCourses = async (req,res)=>{

 try{

  const courses = await Course.find()
   .populate("teacher","name email");

  res.json(courses);

 }catch(err){
  res.status(500).json(err);
 }

};


// Get Registrations
exports.getRegistrations = async (req,res)=>{

 const regs = await Registration.find()
  .populate("student","name email")
  .populate("courses","title");

 res.json(regs);

};


// Approve / Reject Registration
exports.updateRegistrationStatus = async (req,res)=>{

 try{

  const {id} = req.params;
  const {status} = req.body;

  const updated = await Registration.findByIdAndUpdate(
   id,
   {status},
   {new:true}
  );

  // ✅ create notification
  await Notification.create({
   message: `Registration ${status}`
  });

  // ✅ real-time emit
  if(global.io){
   global.io.emit("newNotification", {
    message: `Registration ${status}`
   });
  }

  res.json(updated);

 }catch(err){
  res.status(500).json(err);
 }

};


// DELETE COURSE
exports.deleteCourse = async (req,res)=>{
 try{

  const { id } = req.params;

  await Course.findByIdAndDelete(id);

  res.json({ message: "Course deleted successfully" });

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
};
exports.getPendingStudents = async (req,res)=>{
 try{

  const students = await User.find({
   role:"student",
   status:"pending"
  });

  res.json(students);

 }catch(err){
  res.status(500).json(err);
 }
};
exports.updateStudentStatus = async (req,res)=>{

 try{

  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
   id,
   { status },
   { new:true }
  );

  res.json(user);

 }catch(err){
  res.status(500).json(err);
 }

};
// 🔥 GET COURSES BY TEACHER
exports.getTeacherCourses = async (req,res)=>{
 try{

  const { teacherId } = req.params;

  const courses = await Course.find({ teacher: teacherId });

  res.json(courses);

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
};
// ================= GET STUDENTS BY COURSE (REGISTERED ONLY) =================
// ================= GET STUDENTS BY COURSE (FINAL FIX) =================
exports.getStudents = async (req,res)=>{
 try{

  const { course } = req.query;

  // 🔥 IF course filter is provided
  if(course){

   const registrations = await Registration.find({
    courses: course,        // 🔥 match course
    status: "approved"      // 🔥 only approved students
   }).populate("student","name email");

   // 🔥 extract students
   const students = registrations.map(r => r.student);

   return res.json(students);
  }

  // 🔥 fallback (old functionality)
  const students = await User.find({role:"student"});

  res.json(students);

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }
};