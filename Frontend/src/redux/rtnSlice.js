import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
	name: "realTimeNotification",
	initialState: {
		likeNotification: [],
	},
	reducers: {
		setLikeNotification: (state, action) => {
			if (action.payload.type === "like") {
				const alreadyExists = state.likeNotification.some(
					(item) => item.userId === action.payload.userId && item.postId === action.payload.postId
				);

				if (!alreadyExists) {
					state.likeNotification.push({ ...action.payload, seen: false });
				}
			} else if (action.payload.type === "dislike") {
				state.likeNotification = state.likeNotification.filter(
					(item) => !(item.userId === action.payload.userId && item.postId === action.payload.postId)
				);
			}
		},
		markNotificationsAsSeen: (state) => {
			state.likeNotification = state.likeNotification.map((n) => ({
				...n,
				seen: true,
			}));
		},
	},
});

export const { setLikeNotification, markNotificationsAsSeen } = rtnSlice.actions;
export default rtnSlice.reducer;

// 	if (action.payload.type === "like") {
// 		state.likeNotification.push({ ...action.payload, seen: false });
// 	} else if (action.payload.type === "dislike") {
// 		state.likeNotification = state.likeNotification.filter(
// 			(item) => !(item.userId === action.payload.userId && item.postId === action.payload.postId)
// 		);
// 	}
// },
