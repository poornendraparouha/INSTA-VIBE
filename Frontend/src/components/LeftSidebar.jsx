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
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "/public/instagram.png";

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
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		),
		text: "Profile",
	},
	{ icon: <LogOutIcon />, text: "Logout" },
];

function LeftSidebar() {
	return (
		<div className="fixed top-0 left-0 h-screen w-[16%] min-w-[200px] bg-white border-r border-gray-200 shadow-md px-4 py-6 hidden sm:flex flex-col justify-between z-10">
			<div className="flex flex-col gap-6">
				<div className="mb-6 flex items-center gap-2 justify-center">
					<img src={logo} alt="App Logo" className="w-8 h-8 object-contain" />
					<span className="text-xl font-semibold text-gray-800">Instagram</span>
				</div>

				{sidebarItems.map((item, index) => {
					return (
						<div
							key={index}
							className="flex items-center gap-4 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
						>
							{item.icon}
							<span className="text-sm font-medium text-gray-800">
								{item.text}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default LeftSidebar;
