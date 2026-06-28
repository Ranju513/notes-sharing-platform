import axios from "axios";

const api = axios.create({
baseURL: "https://notes-sharing-platform-lofj.onrender.com/api"
});

export default api;

