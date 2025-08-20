import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [
		 "http://localhost:5173",
		process.env.FRONTEND_URL
	],
		methods: ["GET", "POST"],
	},
});

const userSocketMap = {}; // this map stores id corresponding to user id; user id --> socket id

export const getReceierSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId) {
		userSocketMap[userId] = socket.id;
		// console.log(`User connected: userId = ${userId} socketId = ${socket.id} `);
	}
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		if (userId) {
			// console.log(`User disconnected: userId = ${userId} socketId = ${socket.id} `);
			delete userSocketMap[userId];
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, server, io };
