import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { readFileDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

export default function CreatePost({ open, setOpen }) {
	const imageRef = useRef();
	const [file, setFile] = useState("");
	const [caption, setCaption] = useState("");
	const [imagePreview, setImagePreview] = useState("");
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((store) => store.auth);
	const { posts } = useSelector((store) => store.post);
	const dispatch = useDispatch();

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
			const dataUrl = await readFileDataURL(file);
			setImagePreview(dataUrl);
		}
	};

	const createPostHandler = async (e) => {
		const formData = new FormData();
		formData.append("caption", caption);
		if (imagePreview) formData.append("image", file);
		try {
			setLoading(true);
			const res = await axios.post("insta-vibe-production.up.railway.app/api/v1/post/addpost", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			});
			if (res.data.success) {
				dispatch(setPosts([res.data.post, ...posts]));
				toast.success(res.data.message);
				setOpen(false);
				setFile("");
				setCaption("");
				setImagePreview("");
			}
		} catch (error) {
			toast.error(error.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open}>
			<DialogContent onInteractOutside={() => setOpen(false)}>
				<DialogHeader className="font-semibold text-center">Create New Post</DialogHeader>
				<div className="flex gap-3 items-center">
					<Avatar>
						<AvatarImage src={user?.profilePicture} alt="post_image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="font-semibold text-xs">{user?.username}</h1>
						<span className="text-xs text-grey-600">{user?.bio}</span>
					</div>
				</div>
				<Textarea
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					className="focus-visible:ring-transparent border-none"
					placeholder="What's on your mind?"
				/>
				{imagePreview && (
					<div className="w-full h-64 flex items-center justify-center">
						<img src={imagePreview} alt="preview_image" className="object-cover h-full w-full rounded-md" />
					</div>
				)}

				<input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
				<Button
					onClick={() => imageRef.current.click()}
					type="submit"
					className="w-fix mx-auto bg-[#0095F6] hover:bg=[#258bcf]"
				>
					Select a media file
				</Button>
				{imagePreview &&
					(loading ? (
						<Button>
							<Loader2 className="mr-2 w-4 h-4 animate-spin" />
							Please wait
						</Button>
					) : (
						<Button onClick={createPostHandler} type="submit" className="w-full">
							Post
						</Button>
					))}
			</DialogContent>
		</Dialog>
	);
}
