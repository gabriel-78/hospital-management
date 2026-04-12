import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});
