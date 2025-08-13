import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
	const { selectedUser } = useSelector((store) => store.chat);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAllMessage = async () => {
			try {
				const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, {
					withCredentials: true,
				});
				if (res.data.success) {
					dispatch(setMessages(res.data.messages));
				}
			} catch (error) {
				console.log("Error fetching posts:", error);
			}
		};
		fetchAllMessage();
	}, [selectedUser]);
};

export default useGetAllMessage;
