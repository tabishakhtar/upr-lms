import axios from "axios";

const API = axios.create({
 baseURL: "https://upr-lms-backend.onrender.com/api"
});

export default API;