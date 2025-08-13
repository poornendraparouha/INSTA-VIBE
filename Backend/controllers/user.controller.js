import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utility/datauri.js";
import cloudinary from "../utility/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({
				message: "Something is Missing, please fill all the fields",
				success: false,
			});
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				message: "User already exists",
				success: false,
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.create({
			username,
			email,
			password: hashedPassword,
		});
		return res.status(201).json({
			message: "User registered successfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				message: "Something is Missing, please Check!",
				success: false,
			});
		}
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "User does not exist",
				success: false,
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: "Invalid Password",
				success: false,
			});
		}
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

		// populate each post id in the post array
		const populatedPosts = await Promise.all(
			user.posts.map(async (postId) => {
				const post = await Post.findById(postId);
				if (post.author.equals(user._id)) {
					return post;
				}
				return null;
			})
		);
		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			gender: user.gender,
			followers: user.followers,
			following: user.following,
			posts: populatedPosts,
			bookmarks: user.bookmarks,
		};

		return res
			.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
			})
			.json({
				message: `Welcome back ${user.username}`,
				success: true,
				user,
			});
	} catch (error) {
		console.log(error);
	}
};
export const logout = async (req, res) => {
	try {
		return res.cookie("token", "", { maxAge: 0 }).json({
			message: "Logged out successfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId)
			.populate({ path: "posts", options: { sort: { createdAt: -1 } } })
			.populate("bookmarks")
			.select("-password");
		return res.status(200).json({
			message: "User profile fetched successfully",
			user,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};
export const updateProfile = async (req, res) => {
	try {
		const userId = req.id;
		const { bio, gender } = req.body;
		const profilePicture = req.file;
		let cloudResponse;

		if (profilePicture) {
			const fileUri = getDataUri(profilePicture);
			cloudResponse = await cloudinary.uploader.upload(fileUri);
		}
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({
				message: "User not found",
				success: false,
			});
		}
		if (bio) user.bio = bio;
		if (gender) user.gender = gender;
		if (profilePicture) user.profilePicture = cloudResponse.secure_url;
		await user.save();
		return res.status(200).json({
			message: "Profile updated successfully",
			success: true,
			user,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
		if (!suggestedUsers) {
			return res.status(400).json({
				message: "Currently do not hav any suggested users",
				success: false,
			});
		}
		return res.status(200).json({
			message: "Suggested users fetched successfully",
			success: true,
			users: suggestedUsers,
		});
	} catch (error) {
		console.log(error);
	}
};

export const followOrUnfollow = async (req, res) => {
	try {
		const follower = req.id;
		const following = req.params.id;
		if (follower === following) {
			return res.status(400).json({
				message: "You cannot follow/Unfollow yourself",
				success: false,
			});
		}
		const user = await User.findById(follower);
		const userToFollow = await User.findById(following);
		if (!user || !userToFollow) {
			return res.status(404).json({
				message: "User not found",
				success: false,
			});
		}
		// Checking for the user to follow or unfollow
		const isFollowing = user.following.includes(following);
		if (isFollowing) {
			// Unfollow
			await Promise.all([
				User.updateOne({ _id: follower }, { $pull: { following: following } }),
				User.updateOne({ _id: following }, { $pull: { followers: follower } }),
			]);
			return res.status(200).json({
				message: "Unfollowed successfully",
				success: true,
			});
		} else {
			// Follow
			await Promise.all([
				User.updateOne({ _id: follower }, { $push: { following: following } }),
				User.updateOne({ _id: following }, { $push: { followers: follower } }),
			]);
			return res.status(200).json({
				message: "Followed successfully",
				success: true,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
