import {
	Heart,
	Home,
	LogOutIcon,
	MessageCircle,
	PlusSquare,
	Search,
	Sidebar,
	TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "/instagram.png";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

function LeftSidebar() {
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);

	const logoutHandler = async () => {
		try {
			const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
				withCredentials: true,
			});
			if (res.data.success) {
				dispatch(setAuthUser(null));
				dispatch(setSelectedPost(null));
				dispatch(setPosts([]));
				navigate("/login");
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
	const sidebarHandler = (textType) => {
		if (textType === "Logout") {
			logoutHandler();
		}else if(textType === "Create") {
			setOpen(true);
		}else if (textType === "Profile") {
			navigate(`/profile/${user?._id}`);
		}else if(textType === "Home") {
			navigate("/")
		}
	};
	const sidebarItems = [
		{ icon: <Home />, text: "Home" },
		{ icon: <Search />, text: "Search" },
		{ icon: <TrendingUp />, text: "Explore" },
		{ icon: <MessageCircle />, text: "Messages" },
		{ icon: <Heart />, text: "Notifications" },
		{ icon: <PlusSquare />, text: "Create" },
		{
			icon: (
				<Avatar>
					<AvatarImage src={user?.profilePicture} alt="profile_image" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			),
			text: "Profile",
		},
		{ icon: <LogOutIcon />, text: "Logout" },
	];
	return (
		<div className="fixed top-0 left-0 h-screen w-[16%] min-w-[200px] bg-white border-r border-gray-200 shadow-md px-4 py-6 hidden sm:flex flex-col justify-between z-10">
			<div className="flex flex-col gap-6">
				<div className="mb-2 flex items-center gap-2 justify-center">
					<img src={logo} alt="App Logo" className="w-8 h-8 object-contain" />
					<span className="text-xl font-semibold text-gray-800">Instagram</span>
				</div>

				{sidebarItems.map((item, index) => {
					return (
						<div
							onClick={() => sidebarHandler(item.text)}
							key={index}
							className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer relative"
						>
							{item.icon}
							<span className="text-sm font-medium text-gray-800">
								{item.text}
							</span>
						</div>
					);
				})}
			</div>
			<CreatePost open={open} setOpen={setOpen} />
		</div>
	);
}

export default LeftSidebar;
