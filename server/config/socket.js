import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`📡 Socket Connected: ${socket.id}`);

    socket.on("join_radar", () => {
      socket.join("sos_radar_room");
      console.log(`🚑 Socket ${socket.id} joined SOS Radar Room`);
    });

    socket.on("join_user_room", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`👤 Socket ${socket.id} joined user_${userId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
