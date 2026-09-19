import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import { initSocket } from "./config/socket.js";

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running with WebSockets on http://localhost:${PORT}`);
});