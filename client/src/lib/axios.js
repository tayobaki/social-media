import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api" // Local backend
    : "https://social-media-green-five.vercel.app/api"; // Deployed backend

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// import.meta.env.MODE === "development" ? "http://localhost:3000" : "/api",
