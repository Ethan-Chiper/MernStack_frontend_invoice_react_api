import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5026/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 AUTO ATTACH HEADERS
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (userId) {
      config.headers["x-consumer-username"] = userId;
    }

    console.log("🚀 API Request:", config.baseURL + config.url);
    console.log("🚀 Headers:", config.headers);

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;