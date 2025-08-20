import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
	const dispatch = useDispatch();
	// const [userProfile, setUserProfile] = useState(null);
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.get(`insta-vibe-production.up.railway.app/api/v1/user/${userId}/profile`, {
					withCredentials: true,
				});
				if (response.data.success) {
					dispatch(setUserProfile(response.data.user));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchUserProfile();
	}, [userId]);
};

export default useGetUserProfile;
