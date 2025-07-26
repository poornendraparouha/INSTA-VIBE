import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { get } from "http";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Something is Missing, please fill all the fields",
                success: false
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await newUser.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message: "User registered successfully",
            success: true
        });

    } catch (error) {
        console.log(error);  
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is Missing, please Check!",
                success: false
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                success: false
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid Password",
                success: false
            });
        };
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            bookmarks: user.bookmarks
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user,
            });

    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.cookie("token","", {maxAge: 0}).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
        return res.status(200).json({
            message: "User profile fetched successfully",
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const { profilePicture} = req.file;
        let cloudResponse;
        
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        });
        
    } catch (error) {
        console.log(error);
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        

        
    } catch (error) {
        console.log(error);
        
    }
}