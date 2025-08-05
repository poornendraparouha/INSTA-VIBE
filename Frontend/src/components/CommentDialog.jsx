import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export default function CommentDialog({ open, setOpen }) {
    const [text, setText] = useState("");

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    const sendMessageHandler = async () => {
        alert("Comment sent: " + text);
        // console.log("Comment sent:", text);
        // setText(""); 
    };
	return (
		<Dialog open={open}>
			<DialogContent
				onInteractOutside={() => setOpen(false)}
				className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl p-0 flex flex-col bg-white rounded-lg shadow-xl z-50"
			>
				<div className="flex items-start justify-between border-b">
					<div className="flex flex-1">
						{/* Left image */}
						<div className="w-1/2">
							<img
								src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
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
											<AvatarImage src="" alt="" />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</Link>
									<div className="flex flex-col">
										<Link to="/profile" className="font-semibold text-sm">
											username
										</Link>
										<span className="text-xs text-gray-600">Bio here...</span>
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
								<p>all the comments here</p>
							</div>
							<div className="p-4">
								<div className="flex items-center gap-2">
									<input
                                    onChange={changeEventHandler}
                                        value={text}
										type="text"
										placeholder="Add a comment..."
										className="w-full outline-none border border-gray-300 p-2 rounded"
									/>
									<Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Add comment</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
