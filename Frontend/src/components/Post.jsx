import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	HeartIcon,
	MessageCircle,
	Send,
	MoreHorizontal,
	Bookmark,
} from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

export default function Post({ post }) {
	const [text, setText] = useState("");
	const [open, setOpen] = useState(false);
	const { user } = useSelector((store) => store.auth);
	const { posts } = useSelector((store) => store.post);
	const dispatch = useDispatch();

	const chanegEventeHandler = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setText(inputText);
		} else {
			setText("");
		}
	};

	const deletePostHandler = async () => {
		try {
			const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true,
			});
			if (res.data.success) {
				const updatedPosts = posts.filter((p) => p?._id !== post?._id);
				dispatch(setPosts(updatedPosts));
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error deleting post");
		}
	}

	return (
		<div className="my-8 w-full max-w-sm mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={post.author?.profilePicture} alt="post_image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<h1>{post.author?.username}</h1>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<MoreHorizontal className="cursor-pointer" />
					</DialogTrigger>
					<DialogContent className="flex flex-col items-center text-sm text-center">
						<Button
							variant="ghost"
							className="cursor-pointer w-fit text-[#ED4956] font-bold"
						>
							Unfollow
						</Button>
						<Button variant="ghost" className="cursor-pointer w-fit ">
							Add to Favorites
						</Button>
						{user && user._id === post.author._id && (
							<Button variant="ghost" onClick={deletePostHandler} className="cursor-pointer w-fit ">
								Delete
							</Button>
						)}
					</DialogContent>
				</Dialog>
			</div>
			<img
				className="rounded-sm my-2 w-full aspect-square object-cover"
				src={post.image}
				alt="post_image"
			/>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-4">
					<HeartIcon
						size={22}
						className="cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-200"
					/>
					<MessageCircle
						onClick={() => setOpen(true)}
						size={22}
						className="cursor-pointer text-gray-700 hover:text-blue-500 transition-colors duration-200"
					/>
					<Send
						size={22}
						className="cursor-pointer text-gray-700 hover:text-green-500 transition-colors duration-200"
					/>
				</div>
				<Bookmark
					size={22}
					className="cursor-pointer text-gray-700 hover:text-yellow-500 transition-colors duration-200"
				/>
			</div>
			<span className="text-sm font-semibold text-gray-800 tracking-tight mb-2">
				{post.likes.length} likes
			</span>
			<p>
				<span className="font-sm mr-2">{post.author?.username}</span>
				{post.caption}
			</p>
			<span
				onClick={() => setOpen(true)}
				className="text-sm cursor-pointer text-grey-400"
			>
				{post.comments.length} comments{" "}
			</span>
			<CommentDialog open={open} setOpen={setOpen} />
			<div className="flex items-center justify-between gap-2 mt-2">
				<input
					type="text"
					value={text}
					onChange={chanegEventeHandler}
					placeholder="Add a comment..."
					className="outline-none text-sm w-full"
				/>
				{text && <span className="text-[#3BADF8]">Post</span>}
			</div>
		</div>
	);
}
