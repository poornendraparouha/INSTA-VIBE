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

router.route("/addpost").post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/allposts").get(getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").post(isAuthenticated, likePost);
router.route("/:id/dislike").post(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComments);
router.route("/:id/comment/all").get(getCommentsOfPost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);

export default router;
