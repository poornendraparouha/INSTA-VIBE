import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utility/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from 'path';

dotenv.config({});

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
	origin: process.env.NEW_URL,
	credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/Frontend/dist")));
app.get("*", (req, res) =>{
	res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"))
})

server.listen(PORT, () => {
	connectDB();
	console.log(`Server is running on port ${PORT}`);
});
