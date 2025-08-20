import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send, MoreHorizontal, Bookmark } from "lucide-react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";

export default function Post({ post }) {
	const [text, setText] = useState("");
	const [open, setOpen] = useState(false);
	const { user } = useSelector((store) => store.auth);
	const { posts } = useSelector((store) => store.post);
	const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
	const [likeCount, setLikeCount] = useState(post.likes.length);
	const [comment, setComment] = useState(post.comments);
	const { followUnfollowHandler, following } = useFollowUnfollow();

	const dispatch = useDispatch();

	const chanegEventeHandler = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setText(inputText);
		} else {
			setText("");
		}
	};
	const likeOrDislikeHandler = async () => {
		try {
			const action = liked ? "dislike" : "like";
			const res = await axios.post(
				`insta-vibe-production.up.railway.app/api/v1/post/${post._id}/${action}`,
				{},
				{ withCredentials: true }
			);
			if (res.data.success) {
				const totalLikes = liked ? likeCount - 1 : likeCount + 1;
				setLikeCount(totalLikes);
				setLiked(!liked);
				// Update the post in the Redux store to reflect the new likes
				const updatedPostData = posts.map((p) =>
					p._id === post._id
						? {
								...p,
								likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id],
						  }
						: p
				);
				dispatch(setPosts(updatedPostData));
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error liking post");
		}
	};
	const commentHandler = async () => {
		try {
			const res = await axios.post(
				`insta-vibe-production.up.railway.app/api/v1/post/${post._id}/comment`,
				{ text },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			console.log(res.data);
			if (res.data.success) {
				const updatedCommentsData = [...comment, res.data.comment];
				setComment(updatedCommentsData);

				const updatedPostData = posts.map((p) => (p._id === post._id ? { ...p, comments: updatedCommentsData } : p));
				dispatch(setPosts(updatedPostData));
				toast.success(res.data.message);
				setText("");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error posting comment");
		}
	};

	const deletePostHandler = async () => {
		try {
			const res = await axios.delete(`insta-vibe-production.up.railway.app/api/v1/post/delete/${post?._id}`, {
				withCredentials: true,
			});
			if (res.data.success) {
				const updatedPosts = posts.filter((p) => p?._id !== post?._id);
				dispatch(setPosts(updatedPosts));
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error deleting post");
		}
	};

	const bookmarkHandler = async () => {
		try {
			const res = await axios.get(`insta-vibe-production.up.railway.app/api/v1/post/${post._id}/bookmark`, {
				withCredentials: true,
			});
			if (res.data.success) {
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error in saving post");
		}
	};

	return (
		<div className="my-8 w-full max-w-sm mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Link to={`/profile/${post?.author?._id}`}>
						<Avatar>
							<AvatarImage src={post.author?.profilePicture} alt="post_image" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</Link>
					<div className="flex items-center gap-3">
						<Link to={`/profile/${post?.author?._id}`}>
							<h1 className="font-semibold text-sm">{post.author?.username}</h1>
						</Link>
						{user?._id === post.author?._id && <Badge variant="secondary"> Author </Badge>}
					</div>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<MoreHorizontal className="cursor-pointer" />
					</DialogTrigger>
					<DialogContent className="flex flex-col items-center text-sm text-center">
						{post?.author?._id !== user?._id && (
							<Button
								variant="ghost"
								onClick={() => followUnfollowHandler(post.author._id)}
								className={`cursor-pointer w-fit font-bold ${
									following.includes(post.author._id) ? "text-[#ED4956]" : "text-blue-500"
								}`}
							>
								{following.includes(post.author._id) ? "Unfollow" : "Follow"}
							</Button>
						)}
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
			<img className="rounded-sm my-2 w-full aspect-square object-cover" src={post.image} alt="post_image" />
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-4">
					{liked ? (
						<AiFillHeart onClick={likeOrDislikeHandler} size={22} className="text-red-500" />
					) : (
						<AiOutlineHeart
							onClick={likeOrDislikeHandler}
							size={22}
							className="cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-200"
						/>
					)}
					<MessageCircle
						onClick={() => {
							dispatch(setSelectedPost(post));
							setOpen(true);
						}}
						size={22}
						className="cursor-pointer text-gray-700 hover:text-blue-500 transition-colors duration-200"
					/>
					<Send
						size={22}
						className="cursor-pointer text-gray-700 hover:text-green-500 transition-colors duration-200"
					/>
				</div>
				<Bookmark
					onClick={bookmarkHandler}
					size={22}
					className="cursor-pointer text-gray-700 hover:text-yellow-500 transition-colors duration-200"
				/>
			</div>
			<span className="text-sm font-semibold text-gray-800 tracking-tight mb-2">{likeCount} likes</span>
			<p>
				<span className="font-sm mr-2">{post.author?.username}</span>
				{post.caption}
			</p>
			{comment.length > 0 && (
				<span
					onClick={() => {
						dispatch(setSelectedPost(post));
						setOpen(true);
					}}
					className="text-sm cursor-pointer text-grey-400"
				>
					View all {comment.length} comments
				</span>
			)}
			<CommentDialog open={open} setOpen={setOpen} />
			<div className="flex items-center justify-between gap-2 mt-2">
				<input
					type="text"
					value={text}
					onChange={chanegEventeHandler}
					placeholder="Add a comment..."
					className="outline-none text-sm w-full"
				/>
				{text && (
					<span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">
						Post
					</span>
				)}
			</div>
		</div>
	);
}
