# 🎓 UPR LMS – Frontend (React)

This is the frontend of the **UPR Learning Management System (LMS)** built using React.
It provides a modern UI for students and teachers to interact with lectures, chat, attendance, and results.

---

## 🚀 Live Demo

👉 Frontend (Vercel):
https://your-project.vercel.app

👉 Backend (Render):
https://upr-lms-backend.onrender.com

---

## ⚙️ Tech Stack

* React (Create React App)
* React Router DOM
* Axios
* Socket.io Client
* Tailwind CSS / Bootstrap
* Recharts

---

## 📁 Project Structure

```
frontend/
│── src/
│   ├── pages/
│   ├── components/
│   ├── api.js
│   └── App.js
│
│── public/
│── .env
│── package.json
```

---

## 🔑 Environment Variables

Create a file in the frontend root:

```
frontend/.env
```

Add:

```
REACT_APP_API_URL=https://upr-lms-backend.onrender.com
```

⚠️ Important:

* Must start with `REACT_APP_`
* Restart deployment after changes

---

## 📡 API Configuration

All API calls use:

```js
process.env.REACT_APP_API_URL
```

Example:

```js
axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
```

---

## 🔌 Socket Connection

```js
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL, {
  transports: ["websocket"]
});

export default socket;
```

---

## ▶️ Available Scripts

### `npm start`

Run development server:

```
http://localhost:3000
```

---

### `npm run build`

Builds the app for production.

---

### `npm test`

Runs tests.

---

## 🌍 Deployment

### Frontend (Vercel)

* Root Directory: `frontend`
* Build Command:

```
npm run build
```

* Output Directory:

```
build
```

---

### Backend (Render)

Ensure CORS is enabled:

```js
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-project.vercel.app"
  ],
  credentials: true
}));
```

---

## ⚠️ Common Issues

### ❌ API not working

* Check backend URL
* Check `.env` file
* Check CORS settings

---

### ❌ Images / Files not loading

Replace:

```
http://localhost:5000
```

With:

```
process.env.REACT_APP_API_URL
```

---

### ❌ Socket not connecting

* Check backend socket config
* Ensure correct URL in frontend

---

## 👨‍💻 Author

Developed by **Ammar Sajid**

---

## ⭐ Features

* 📚 Lecture Upload & View
* 💬 Real-time Chat (Socket.io)
* 📊 Student Results & Attendance
* 🎥 Media Support (Audio/Images)
* 👨‍🏫 Teacher Dashboard

---

## 📌 Notes

* This project is part of a MERN stack system
* Backend is hosted on Render
* Frontend is hosted on Vercel

---

## 🎉 Status

✅ Fully Deployed
✅ Frontend + Backend Connected
🚀 Production Ready
