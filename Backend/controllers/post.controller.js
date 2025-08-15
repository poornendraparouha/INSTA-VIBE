import sharp from "sharp";
import cloudinary from "../utility/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import {getReceierSocketId, io} from "../socket/socket.js"

export const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const image = req.file;
		const authorId = req.id;

		if (!image) {
			return res.status(400).json({
				message: "Image Required",
			});
		}
		// image loading
		const optimizedImageBuffer = await sharp(image.buffer)
			.resize({ width: 800, height: 800, fit: "inside" })
			.toFormat("jpeg", { quality: 80 })
			.toBuffer();
		// converting buffer to data URI
		const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
		const cloudResponse = await cloudinary.uploader.upload(fileUri);
		const post = await Post.create({
			caption,
			image: cloudResponse.secure_url,
			author: authorId,
		});
		const user = await User.findById(authorId);
		if (user) {
			user.posts.push(post._id);
			await user.save();
		}
		await post.populate({ path: "author", select: "-password" });
		return res.status(200).json({
			message: "New Post Added",
			post,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getAllPost = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({ path: "author", select: "username profilePicture" })
			.populate({
				path: "comments",
				options: { sort: { createdAt: -1 } },
				populate: { path: "author", select: "username profilePicture" },
			});
		return res.status(200).json({
			message: "All Posts Fatched Successfully",
			posts,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getUserPost = async (req, res) => {
	try {
		const authorId = req.id;
		const posts = await Post.find({ author: authorId })
			.sort({ createdAt: -1 })
			.populate({ path: "author", select: "username profilePicture" })
			.populate({
				path: "comments",
				options: { sort: { createdAt: -1 } },
				populate: { path: "author", select: "username profilePicture" },
			});
		return res.status(200).json({
			posts,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const likePost = async (req, res) => {
	try {
		const likingPersonsUserId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				message: "Post Not Found",
				success: false,
			});
		}
		// Like Logic
		// await post.updateOne({$addToSet:{likes:likingPersonsUserId}});
		// await post.save();
		await Post.findByIdAndUpdate(postId, { $addToSet: { likes: likingPersonsUserId } });

		// implement socket io for realtime notification
		const user = await User.findById(likingPersonsUserId).select("username profilePicture");
		const postOwnerId = post.author.toString();
		if (postOwnerId !== likingPersonsUserId) {
			// emit notification event
			const notification = {
				type: "like",
				userId: likingPersonsUserId,
				userDetails: user,
				postId,
				message: "Your Post was liked",
			};
			const postOwnerSocketId = getReceierSocketId(postOwnerId);
			io.to(postOwnerSocketId).emit("notification", notification);
		}

		return res.status(200).json({
			message: "Post Liked",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const dislikePost = async (req, res) => {
	try {
		const likingPersonsId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				message: "Post Not Found",
				success: false,
			});
		}
		// Like Logic
		// await post.updateOne({$pull:{likes:likingPersonsId}});
		// await post.save();
		await Post.findByIdAndUpdate(postId, { $pull: { likes: likingPersonsId } });

		//socket implementation for realtime updates
		const user = await User.findById(likingPersonsId).select("username profilePicture");
		const postOwnerId = post.author.toString();
		if (postOwnerId !== likingPersonsId) {
			// emit notification event
			const notification = {
				type: "dislike",
				userId: likingPersonsId,
				userDetails: user,
				postId,
				message: "Your Post was disliked",
			};
			const postOwnerSocketId = getReceierSocketId(postOwnerId);
			io.to(postOwnerSocketId).emit("notification", notification);
		}

		return res.status(200).json({
			message: "Post Disliked",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const addComments = async (req, res) => {
	try {
		const commentingPersonsId = req.id;
		const postId = req.params.id;
		const { text } = req.body;
		const post = await Post.findById(postId);
		if (!text) {
			return res.status(404).json({
				message: "Text is Required",
				success: false,
			});
		}
		const comment = await Comment.create({
			text,
			author: commentingPersonsId,
			post: postId,
		});
		await comment.populate({ path: "author", select: "username profilePicture" });

		post.comments.push(comment._id);
		await post.save();

		return res.status(201).json({
			message: "Comment Added Successfully",
			comment,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getCommentsOfPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const comments = await Comment.find({ post: postId })
			.sort({ createdAt: -1 })
			.populate("author", "username profilePicture");
		if (!comments) {
			return res.status(404).json({
				message: "Comments Not Found",
				success: false,
			});
		}
		return res.status(200).json({
			message: "All Comments Loaded",
			comments,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const authorId = req.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				message: "Post Not Found",
				success: false,
			});
		}
		// check if the logged in user is the author of the post
		if (post.author.toString() !== authorId) {
			return res.status(403).json({
				message: "Unauthorized User",
			});
		}
		// Delete Post
		await Post.findByIdAndDelete(postId);

		// remove post id from user's post
		let user = await User.findById(authorId);
		user.posts = user.posts.filter((id) => id.toString() !== postId);
		await user.save();

		// delete Associated comments
		await Comment.deleteMany({ post: postId });

		return res.status(200).json({
			message: "Post Deleted Sucessfully",
			success: true,
		});
	} catch (error) {
		comsole.log(error);
	}
};

export const bookmarkPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const authorId = req.id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				message: "Post Not Found",
				success: false,
			});
		}
		let user = await User.findById(authorId);
		if (user.bookmarks.includes(post._id)) {
			// if already bookmarked -->remove from bookmarks
			await user.updateOne({ $pull: { bookmarks: post._id } });
			await user.save();
			return res.status(200).json({
				type: "unsaved",
				message: "Post removed from bookmarks",
				success: true,
			});
		} else {
			await user.updateOne({ $addToSet: { bookmarks: post._id } });
			await user.save();
			return res.status(200).json({
				type: "saved",
				message: "Post bookmarked successfully",
				success: true,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
