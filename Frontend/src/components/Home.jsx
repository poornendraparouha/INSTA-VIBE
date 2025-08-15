import React from "react";
import Feed from "./feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

function Home() {
	useGetAllPost();
	useGetSuggestedUsers();
	return (
		<div className="flex">
			<div className="flex-grow">
				<Feed />
				<Outlet />
			</div>
			<div className="hidden md:block border-l border-gray-200 pl-[5px]">
				<RightSidebar />
			</div>
		</div>
	);
}

export default Home;
