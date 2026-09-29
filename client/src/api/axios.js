import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;

    // 1. Cloudflare Tunnel / Ngrok / Public URLs: use relative /api which Vite proxies to backend
    const isPublicTunnel =
      hostname.includes("trycloudflare.com") ||
      hostname.includes("ngrok") ||
      hostname.includes("localtunnel") ||
      hostname.includes("vercel.app") ||
      hostname.includes("render.com");

    if (isPublicTunnel) {
      return "/api";
    }

    // 2. Direct LAN IP access (e.g. 192.168.x.x or 10.x.x.x)
    const isLanIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname) && hostname !== "127.0.0.1";
    if (isLanIp) {
      return `${protocol}//${hostname}:5000/api`;
    }
  }

  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }
  }

  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000, // 8s timeout for remote network scans
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;