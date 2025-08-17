import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useFollowUnfollow from "@/hooks/useFollowUnfollow";

const SuggestedUsers = () => {
	const { suggestedUsers } = useSelector((store) => store.auth);
	const { followUnfollowHandler, following } = useFollowUnfollow(); 	
	return (
		<div className="mt-8 px-4">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-sm font-semibold text-gray-500">Suggested for you</h1>
				<span className="text-sm font-medium text-blue-500 cursor-pointer hover:underline">See All</span>
			</div>
			{suggestedUsers?.length === 0 && <p className="text-sm text-gray-400">No suggestions available.</p>}

			{suggestedUsers?.map((user) => {
				return (
					<div
						key={user._id}
						className="flex items-center justify-between mb-4 hover:bg-gray-50 rounded-lg p-2 transition duration-200"
					>
						<div className="flex items-center gap-3">
							<Link to={`/profile/${user?._id}`}>
								<Avatar className="w-10 h-10">
									<AvatarImage src={user?.profilePicture} className="object-cover" alt="post_image" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</Link>
							<div>
								<h1 className="leading-tight">
									<Link to={`/profile/${user?._id}`} className="text-sm font-medium hover:underline">
										{user?.username}
									</Link>
								</h1>
								<span className="text-xs text-gray-600 max-w-[180px] line-clamp-1">{user?.bio || "Bio here..."}</span>
							</div>
						</div>
						<span
							onClick={() => followUnfollowHandler(user._id)}
							className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition cursor-pointer"
						>
							{following.includes(user._id) ? "Unfollow" : "Follow"}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export default SuggestedUsers;
