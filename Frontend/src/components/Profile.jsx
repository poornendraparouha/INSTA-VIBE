import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
function Profile() {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId);
	const [activeTab, setActiveTab] = useState("posts");

	const { userProfile, user } = useSelector((store) => store.auth);
	const isLoggedInUserProfile = user?._id === userProfile?._id;
	const isFollowing = true;

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};
	const displayedPost = activeTab === "posts" ? userProfile?.posts : activeTab === "saved" ? userProfile?.bookmarks  : activeTab === "reels" ? userProfile?.reels : userProfile?.taggedPosts;

	return (
		<div className="flex max-w-5xl justify-center mx-auto pl-[4%]">
			<div className="flex flex-col gap-2 p-8">
				<div className="grid grid-cols-2">
					<section className="flex items-center justify-center">
						<Avatar className="w-50 h-50">
							<AvatarImage src={userProfile?.profilePicture} alt="post_image" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</section>
					<section>
						<div className="flex flex-col gap-5">
							<div className="flex items-center gap-2 line-clamp-1">
								<span className="font-bold">{userProfile?.username}</span>
								{isLoggedInUserProfile ? (
									<>
										<Link to="/account/edit">
											<Button variant="secondary" className="hover:bg-grey-200 h-8">
												Edit Profile
											</Button>
										</Link>
										<Button variant="secondary" className="hover:bg-grey-200 h-8">
											View Archive
										</Button>
										<Button variant="secondary" className="hover:bg-grey-200 h-8">
											Ad Tools
										</Button>
									</>
								) : isFollowing ? (
									<Button variant="secondary" className=" bg-[#72c3f8] h-8">
										{" "}
										Follow{" "}
									</Button>
								) : (
									<>
										<Button className=" bg-[#0095F6] hover:bg-[#3192d2] h-8"> Unfollow </Button>
										<Button variant="secondary" className="bg-[#72c3f8] h-8">
											{" "}
											Message{" "}
										</Button>
									</>
								)}
							</div>
							<div className="flex items-center gap-10">
								<p>
									<span className="font-bold">{userProfile?.posts?.length}</span> Posts{" "}
								</p>
								<p>
									{" "}
									<span className="font-bold">{userProfile?.followers?.length}</span> Followers{" "}
								</p>
								<p>
									{" "}
									<span className="font-bold">{userProfile?.following?.length}</span> Following{" "}
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<span className="font-bold">{userProfile?.username}</span>
								<Badge className="w-fit font-semibold" variant="secondary">
									<AtSign />
									<span>{userProfile?.username}</span>
								</Badge>
								<span className="font-semibold">{userProfile?.bio || "No bio available"}</span>
							</div>
						</div>
					</section>
				</div>
				<div className="border-t border-t-border-gray-200">
					<div className="flex items-center justify-center gap-45 text-sm p-2">
						<span
							onClick={() => {
								handleTabChange("posts");
							}}
							className={`py--3 cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`}
						>
							POSTS
						</span>
						<span
							onClick={() => {
								handleTabChange("reels");
							}}
							className={`py--3 cursor-pointer ${activeTab === "reels" ? "font-bold" : ""}`}
						>
							REELS
						</span>
						<span
							onClick={() => {
								handleTabChange("saved");
							}}
							className={`py--3 cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`}
						>
							SAVED
						</span>
						<span
							onClick={() => {
								handleTabChange("tagged");
							}}
							className={`py--3 cursor-pointer ${activeTab === "tagged" ? "font-bold" : ""}`}
						>
							TAGGED
						</span>
					</div>
					<div className="grid grid-cols-3 gap-2 pl-[2%]">
						{displayedPost?.map((post) => (
							<div key={post?._id} className="group relative cursor-pointer overflow-hidden">
								<img
									src={post?.image}
									alt={post?.caption}
									className="object-cover w-full h-full rounded-sm my-2 aspect-[4/5] transition duration-300 group-hover:blur-sm"
								/>
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
									<div className="flex text-white items-center space-x-4">
										<button className="flex items-center gap-2 hover:text-grey-300">
											<Heart />
											<span>{post?.likes.length}</span>
										</button>
										<button className="flex items-center gap-2 hover:text-grey-300">
											<MessageCircle />
											<span>{post?.comments.length}</span>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
