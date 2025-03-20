import axios from "axios";

const URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://social-media-green-five.vercel.app/api";

export const axiosInstance = axios.create({
  baseURL: URL,
  //
  withCredentials: true,
});
