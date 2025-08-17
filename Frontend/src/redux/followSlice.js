import { createSlice } from "@reduxjs/toolkit";

const followSlice = createSlice({
	name: "followUnfollow",
	initialState: {
		following: [],
	},
	reducers: {
		setFollowing: (state, action) => {
			state.following = action.payload;
		},
		followUser: (state, action) => {
			const userId = action.payload;
			if (!state.following.includes(userId)) {
				state.following.push(userId);
			}
		},
		unfollowUser: (state, action) => {
			const userId = action.payload;
			state.following = state.following.filter((id) => id !== userId);
		},
	},
});

export const { setFollowing, followUser, unfollowUser } = followSlice.actions;
export default followSlice.reducer;
