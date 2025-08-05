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
// import { FaRegHeart , FaHeart} from "react-icons/fa";

export default function Post() {
	const [text, setText] = useState("");
		const [open, setOpen] = useState(false);

	const chanegEventeHandler = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()){
			setText(inputText);
		}else {
			setText("");
		}
	};

	return (
		<div className="my-8 w-full max-w-sm mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src="" alt="post_image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<h1>username</h1>
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
						<Button variant="ghost" className="cursor-pointer w-fit ">
							Delete
						</Button>
					</DialogContent>
				</Dialog>
			</div>
			<img
				className="rounded-sm my-2 w-full aspect-square object-cover"
				src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
				alt="post_image"
			/>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-4">
						<HeartIcon
							size={22}
							className="cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-200"
						/>
						<MessageCircle
						onClick={() =>setOpen(true)}
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
				<span className="text-sm font-semibold text-gray-800 tracking-tight mb-2">1k likes</span>
				<p>
					<span className="font-sm mr-2">username</span>
					caption 
				</p>
				<span onClick={() =>setOpen(true)} className="text-sm cursor-pointer text-grey-400" >View all 10 comments </span>
				<CommentDialog open={open} setOpen={setOpen} />
				<div className="flex items-center justify-between gap-2 mt-2">
					<input type="text" 
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
