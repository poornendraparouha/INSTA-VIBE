import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { markNotificationsAsSeen } from "@/redux/rtnSlice";

export default function NotificationMenu() {
	const dispatch = useDispatch();
	const { likeNotification } = useSelector((store) => store.realTimeNotification);
	const unseenCount = likeNotification.filter((n) => !n.seen).length;
	return (
		<Popover
			onOpenChange={(open) => {
				if (open) dispatch(markNotificationsAsSeen());
			}}
		>
			<PopoverTrigger asChild>
				<div className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
					<Heart />
					<span className="hidden lg:inline">Notifications</span>

					{unseenCount > 0 && (
						<Button size="icon" className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
							{unseenCount}
						</Button>
					)}
				</div>
			</PopoverTrigger>

			<PopoverContent>
				<div>
					{likeNotification.length === 0 ? (
						<p>No notifications</p>
					) : (
						likeNotification.map((notification, i) => (
							<div key={i} className="flex items-center gap-2 my-2">
								<Avatar>
									<AvatarImage src={notification.userDetails?.profilePicture} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<p className="text-sm">
									<span className="font-bold">{notification.userDetails?.username}</span> liked your post
								</p>
							</div>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

{
	/* {item.text === "Notifications" && likeNotification.length > 0 && (
									<Popover>
										<PopoverTrigger asChild>
											<Button
												size="icon"
												className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
											>
												{likeNotification.length}
											</Button>
										</PopoverTrigger>
										<PopoverContent>
											<div>
												{likeNotification.length === 0 ? (
													<p>No new notification</p>
												) : (
													likeNotification.map((notification) => {
														return (
															<div key={notification.userId} className="flex items-center gap-2 my-2">
																<Avatar>
																	<AvatarImage src={notification.userDetails?.profilePicture} />
																	<AvatarFallback>CN</AvatarFallback>
																</Avatar>
																<p className="text-sm">
																	<span className="font-bold">{notification.userDetails?.username}</span> liked your
																	post
																</p>
															</div>
														);
													})
												)}
											</div>
										</PopoverContent>
									</Popover>
								)} */
}
