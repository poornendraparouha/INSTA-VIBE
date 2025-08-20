import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { followUser, unfollowUser } from "@/redux/followSlice";

export default function useFollowUnfollow() {
	const dispatch = useDispatch();
	const { following } = useSelector((store) => store.followUnfollow);

	const followUnfollowHandler = async (userId) => {
		try {
			const res = await axios.post(
				`insta-vibe-production.up.railway.app/api/v1/user/followorunfollow/${userId}`,
				{},
				{ withCredentials: true }
			);

			if (res.data.success) {
				if (following.includes(userId)) {
					dispatch(unfollowUser(userId));
				} else {
					dispatch(followUser(userId));
				}
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	};

	return { followUnfollowHandler, following };
}
