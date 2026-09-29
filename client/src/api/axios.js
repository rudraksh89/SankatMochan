import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL;
    // Use environment URL directly if it points to a deployed remote server
    if (!envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }
  }

  // If accessed over LAN/mobile (e.g. 192.168.x.x), dynamically use host IP for API calls
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const { protocol, hostname } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${protocol}//${hostname}:5000/api`;
    }
  }

  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 4000, // 4s timeout so cross-network / unreachable API calls fast-fail to offline payload
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;