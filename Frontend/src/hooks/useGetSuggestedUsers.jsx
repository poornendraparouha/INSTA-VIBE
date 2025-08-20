import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSuggestedUsers = async () => {
			try {
				const response = await axios.get("insta-vibe-production.up.railway.app/api/v1/user/suggested", { withCredentials: true });
				if (response.data.success) {
					dispatch(setSuggestedUsers(response.data.users));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchSuggestedUsers();
	}, []);
};

export default useGetSuggestedUsers;
