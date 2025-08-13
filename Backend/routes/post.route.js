import express from "express";
import {
	addNewPost,
	getAllPost,
	getUserPost,
	likePost,
	dislikePost,
	addComments,
	getCommentsOfPost,
	deletePost,
	bookmarkPost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Add New Post (with image)
router.route("/addpost").post(isAuthenticated, upload.single("image"), addNewPost);

// Get All Posts (Public)
router.route("/allposts").get(getAllPost);

// Get Posts by Logged-In User
router.route("/userpost/all").get(isAuthenticated, getUserPost);

// Like & Dislike a Post
router.route("/:id/like").post(isAuthenticated, likePost);
router.route("/:id/dislike").post(isAuthenticated, dislikePost);

// Add and Get Comments for a Post
router.route("/:id/comment").post(isAuthenticated, addComments);
router.route("/:id/comment/all").get(getCommentsOfPost);

// Bookmark & Unbookmark a Post
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);

// Delete a Post (Author only)
router.route("/delete/:id").delete(isAuthenticated, deletePost);

export default router;
