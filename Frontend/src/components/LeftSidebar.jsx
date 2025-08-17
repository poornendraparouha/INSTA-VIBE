import { Heart, Home, LogOutIcon, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
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
import NotificationMenu from "./NotificationMenu";

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
		} else if (textType === "Create") {
			setOpen(true);
		} else if (textType === "Profile") {
			navigate(`/profile/${user?._id}`);
		} else if (textType === "Home") {
			navigate("/");
		} else if (textType === "Messages") {
			navigate("/chat");
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
		<div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] lg:w-[16%] md:w-[80px] h-screen">
			<div className="flex flex-col">
				<h1 className="flex font-bold text-xl gap-2 mt-[20px] mb-[15px]  pl-3">
					<img src={logo} alt="App Logo" className="w-8 h-8 object-contain" />
					<span className="hidden lg:inline">Instagram</span>
				</h1>
				<div>
					{sidebarItems.map((item, index) => {
						if (item.text === "Notifications") {
							return <NotificationMenu key={index} />;
						}
						return (
							<div
								onClick={() => sidebarHandler(item.text)}
								key={index}
								className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
							>
								{item.icon}
								<span className="hidden lg:inline">{item.text}</span>
							</div>
						);
					})}
				</div>
			</div>
			<CreatePost open={open} setOpen={setOpen} />
		</div>
	);
}

export default LeftSidebar;
