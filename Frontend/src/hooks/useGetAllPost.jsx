import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { setPosts } from "@/redux/postSlice";

const useGetAllPost = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				const response = await axios.get("http://localhost:8000/api/v1/post/allposts", { withCredentials: true });
				if (response.data.success) {
					dispatch(setPosts(response.data.posts));
				}
			} catch (error) {
				console.log("Error fetching posts:", error);
			}
		};
		fetchAllPosts();
	}, []);
};

export default useGetAllPost;
