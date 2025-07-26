import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    caption: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    }],
}, {timestamps: true});

export const Post = mongoose.model("Post", postSchema);
