import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import socket from "../socket";

function Chat() {

 const [users, setUsers] = useState([]);
 const [selectedUser, setSelectedUser] = useState(null);
 const [messages, setMessages] = useState([]);
 const [text, setText] = useState("");
 const [file, setFile] = useState(null);
 const [typing, setTyping] = useState(false);
 const [onlineUsers, setOnlineUsers] = useState([]);
 const [unread, setUnread] = useState({});
 const [showUsers, setShowUsers] = useState(true);

 // 🔥 NEW FEATURES
 const [showEmoji, setShowEmoji] = useState(false);
 const [recording, setRecording] = useState(false);
 const mediaRecorderRef = useRef(null);
 const audioChunks = useRef([]);

 const messagesEndRef = useRef(null);
 const userId = localStorage.getItem("userId");

 // JOIN
 useEffect(() => {
  if (userId) socket.emit("join", userId);
 }, [userId]);

 // ONLINE USERS
 useEffect(() => {
  socket.on("onlineUsers", setOnlineUsers);
  return () => socket.off("onlineUsers");
 }, []);

 // AUTO SCROLL
 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [messages]);

 // LOAD USERS
 useEffect(() => {
  fetchUsers();
 }, [userId]);

 // LOAD MESSAGES
 useEffect(() => {
  if (!selectedUser) return;

  fetchMessages();

  setUnread(prev => ({ ...prev, [selectedUser._id]: 0 }));

  API.post("/chat/seen", {
   sender: selectedUser._id,
   receiver: userId
  });

 }, [selectedUser]);

 // SOCKET EVENTS
 useEffect(() => {

  socket.on("newMessage", (msg) => {

   if (
    msg.sender === selectedUser?._id ||
    msg.receiver === selectedUser?._id
   ) {
    setMessages(prev => [...prev, msg]);
   }

   if (msg.sender !== selectedUser?._id) {
    setUnread(prev => ({
     ...prev,
     [msg.sender]: (prev[msg.sender] || 0) + 1
    }));
   }

  });

  socket.on("typing", (data) => {
   if (data.sender === selectedUser?._id) {
    setTyping(true);
    setTimeout(() => setTyping(false), 2000);
   }
  });

  return () => {
   socket.off("newMessage");
   socket.off("typing");
  };

 }, [selectedUser]);

 const fetchUsers = async () => {
  const res = await API.get(`/chat/users/${userId}`);
  setUsers(res.data);
 };

 const fetchMessages = async () => {
  const res = await API.get(
   `/chat/messages?sender=${userId}&receiver=${selectedUser._id}`
  );
  setMessages(res.data);
 };

 // SEND TEXT/FILE
 const send = async () => {
  if (!text && !file) return;

  const formData = new FormData();
  formData.append("sender", userId);
  formData.append("receiver", selectedUser._id);
  formData.append("text", text);
  if (file) formData.append("file", file);

  const res = await API.post("/chat/send-message", formData);

  setMessages(prev => [...prev, res.data]);
  setText("");
  setFile(null);
 };

 // ENTER SEND
 const handleKey = (e) => {
  if (e.key === "Enter") send();
 };

 // EMOJI LIST
 const emojis = ["😀","😂","😍","😎","🔥","👍","🎉","❤️","😢","😡"];

 // VOICE RECORD
 const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);

  mediaRecorderRef.current = recorder;
  audioChunks.current = [];

  recorder.ondataavailable = (e) => {
   audioChunks.current.push(e.data);
  };

  recorder.onstop = async () => {
   const blob = new Blob(audioChunks.current, { type: "audio/webm" });
   const formData = new FormData();

   formData.append("sender", userId);
   formData.append("receiver", selectedUser._id);
   formData.append("file", blob, "voice.webm");

   const res = await API.post("/chat/send-message", formData);
   setMessages(prev => [...prev, res.data]);
  };

  recorder.start();
  setRecording(true);
 };

 const stopRecording = () => {
  mediaRecorderRef.current.stop();
  setRecording(false);
 };

 const avatar = (name) => name?.charAt(0).toUpperCase();

 return (

  <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

   {/* USERS */}
   <div className={`sidebar ${showUsers ? "show" : ""}`}>

    <div className="header flex justify-between">
     <h2>Chats</h2>
     <button className="md:hidden" onClick={()=>setShowUsers(false)}>✖</button>
    </div>

    {users.map(u => (
     <div key={u._id} onClick={()=>{
      setSelectedUser(u);
      setShowUsers(false);
     }} className="user">

      <div className="avatar">{avatar(u.name)}</div>

      <div className="flex-1">
       <p>{u.name}</p>
       <span className="text-xs">
        {onlineUsers.includes(u._id) ? "🟢 Online" : "⚫ Offline"}
       </span>
      </div>

      {unread[u._id] > 0 && <span className="badge">{unread[u._id]}</span>}

     </div>
    ))}

   </div>

   {/* CHAT */}
   <div className="flex-1 flex flex-col">

    {/* HEADER */}
    <div className="header flex items-center gap-3">
     <button className="md:hidden" onClick={()=>setShowUsers(true)}>☰</button>

     {selectedUser && (
      <>
       <div className="avatar">{avatar(selectedUser.name)}</div>
       <h2>{selectedUser.name}</h2>
      </>
     )}
    </div>

    {/* MESSAGES */}
    <div className="flex-1 p-4 overflow-y-auto space-y-3">

     {messages.map((m,i)=>(
      <div key={i} className={`flex ${m.sender===userId?"justify-end":"justify-start"}`}>
       <div className={`msg ${m.sender===userId?"me":"other"}`}>

        {m.text}

        {m.file && (
         m.file.includes("audio")
         ? <audio controls src={`http://localhost:5000/${m.file}`}/>
         : <img src={`http://localhost:5000/${m.file}`} className="mt-2 rounded"/>
        )}

       </div>
      </div>
     ))}

     {typing && <p className="text-sm opacity-60">typing...</p>}
     <div ref={messagesEndRef}/>

    </div>

    {/* FOOTER */}
    {selectedUser && (
     <div className="footer">

      <button onClick={()=>setShowEmoji(!showEmoji)}>😀</button>

      <input
       value={text}
       onKeyDown={handleKey}
       onChange={(e)=>{
        setText(e.target.value);
        socket.emit("typing",{sender:userId,receiver:selectedUser._id});
       }}
       placeholder="Type message..."
       className="input"
      />

      <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>

      {!recording
       ? <button onClick={startRecording}>🎤</button>
       : <button onClick={stopRecording} className="text-red-500">⏹</button>
      }

      <button onClick={send} className="send">Send</button>

      {/* EMOJI PANEL */}
      {showEmoji && (
       <div className="emoji-panel">
        {emojis.map((e,i)=>(
         <span key={i} onClick={()=>setText(prev=>prev+e)}>{e}</span>
        ))}
       </div>
      )}

     </div>
    )}

   </div>

   {/* STYLE */}
   <style>{`
    .sidebar{
     width:25%;
     background:rgba(255,255,255,0.05);
     backdrop-filter:blur(10px);
     border-right:1px solid #333;
    }

    .header{
     padding:12px;
     border-bottom:1px solid #333;
    }

    .user{
     display:flex;
     gap:10px;
     padding:10px;
     cursor:pointer;
    }

    .avatar{
     width:35px;height:35px;
     border-radius:50%;
     background:#3b82f6;
     display:flex;
     align-items:center;
     justify-content:center;
    }

    .msg{
     padding:10px;
     border-radius:12px;
     max-width:70%;
    }

    .me{background:#2563eb;}
    .other{background:#444;}

    .footer{
     display:flex;
     gap:8px;
     padding:10px;
     background:rgba(255,255,255,0.05);
     backdrop-filter:blur(10px);
     position:relative;
    }

    .input{
     flex:1;
     background:#222;
     border:none;
     padding:8px;
     border-radius:8px;
    }

    .send{
     background:#22c55e;
     padding:8px 12px;
     border-radius:8px;
    }

    .emoji-panel{
     position:absolute;
     bottom:60px;
     background:#111;
     padding:10px;
     border-radius:10px;
     display:flex;
     gap:8px;
     flex-wrap:wrap;
    }

    @media(max-width:768px){
     .sidebar{
      position:absolute;
      width:100%;
      height:100%;
      z-index:50;
     }
    }

   `}</style>

  </div>
 );
}

export default Chat;