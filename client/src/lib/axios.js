import axios from "axios";

const URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://social-media-green-five.vercel.app/api"
    : "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: URL,
  //
  withCredentials: true,
});
