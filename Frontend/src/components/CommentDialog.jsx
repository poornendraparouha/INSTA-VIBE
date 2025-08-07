import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

export default function CommentDialog({ open, setOpen }) {
	const [text, setText] = useState("");
	const { selectedPost, posts } = useSelector((store) => store.post);
	const [comment, setComment] = useState([]);

	const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (selectedPost) {
	// 		setComment(selectedPost.comments);
	// 	}
	// }, [selectedPost]);
	useEffect(() => {
		if (open && selectedPost?._id) {
			const fetchComments = async () => {
				try {
					const res = await axios.get(
						`http://localhost:8000/api/v1/post/${selectedPost._id}/comment/all`,
						{ withCredentials: true }
					);
					if (res.data.success) {
						setComment(res.data.comments);
					} else {
						toast.error(res.data.message || "Failed to load comments");
					}
				} catch (error) {
					toast.error(
						error.response?.data?.message || "Error fatching comment"
					);
				}
			};
			fetchComments();
		}
	}, [open, selectedPost]);

	const changeEventHandler = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setText(inputText);
		} else {
			setText("");
		}
	};

	const sendMessageHandler = async () => {
		try {
			const res = await axios.post(
				`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
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

				const updatedPostData = posts.map((p) =>
					p._id === selectedPost._id
						? { ...p, comments: updatedCommentsData }
						: p
				);
				dispatch(setPosts(updatedPostData));
				toast.success(res.data.message);
				setText("");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error posting comment");
		}
	};
	return (
		<Dialog open={open}>
			<DialogContent
				onInteractOutside={() => setOpen(false)}
				className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-screen overflow-y-auto p-0 flex flex-col bg-white rounded-lg shadow-xl z-50"
			>
				<div className="flex items-start justify-between border-b">
					<div className="flex flex-1">
						{/* Left image */}
						<div className="w-1/2">
							<img
								src={selectedPost?.image}
								alt="post_image"
								className="rounded-l-lg w-full h-full object-cover"
							/>
						</div>

						{/* Right section */}
						<div className="w-1/2 flex flex-col justify-between border-l relative">
							{/* Header */}
							<div className="flex items-center justify-between p-4 border-b">
								<div className="flex items-center gap-3">
									<Link to="/profile">
										<Avatar>
											<AvatarImage
												src={selectedPost?.author?.profilePicture}
												alt="profile_picture"
											/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</Link>
									<div className="flex flex-col">
										<Link to="/profile" className="font-semibold text-sm">
											{selectedPost?.author?.username}
										</Link>
										{/* <span className="text-xs text-gray-600">Bio here...</span> */}
									</div>
								</div>

								{/* More options button */}
								<Dialog>
									<DialogTrigger asChild>
										<MoreHorizontal className="cursor-pointer" />
									</DialogTrigger>
									<DialogContent className="flex flex-col items-center gap-2 text-sm text-center bg-white p-4 rounded-md shadow-md z-50 w-48">
										<div className="cursor-pointer w-full text-[#ED4956] font-bold">
											Unfollow
										</div>
										<div className="cursor-pointer w-full text-gray-700">
											Add to Favorites
										</div>
									</DialogContent>
								</Dialog>
							</div>

							{/* Comment area */}
							<div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-2 text-sm text-gray-700">
								{comment.map((comment) => (
									<Comment key={comment._id} comment={comment} />
								))}
							</div>
							<div className="p-4">
								<div className="flex items-center gap-2">
									<input
										onChange={changeEventHandler}
										value={text}
										type="text"
										placeholder="Add a comment..."
										className="w-full text-sm outline-none border border-gray-300 p-2 rounded"
									/>
									<Button
										disabled={!text.trim()}
										onClick={sendMessageHandler}
										variant="outline"
									>
										Add comment
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
