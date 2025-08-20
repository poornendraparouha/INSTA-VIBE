import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
	name: "post",
	initialState: {
		posts: [],
		selectedPost: null,
		bookmarks: [],
	},
	reducers: {
		// Action to set posts
		setPosts: (state, action) => {
			state.posts = action.payload;
		},
		setSelectedPost: (state, action) => {
			state.selectedPost = action.payload;
		},
		addBookmark: (state, action) => {
			if (!state.bookmarks.includes(action.payload)) {
				state.bookmarks.push(action.payload);
			}
		},
		removeBookmark: (state, action) => {
			state.bookmarks = state.bookmarks.filter((id) => id !== action.payload);
		},
	},
});

export const { setPosts, setSelectedPost, addBookmark, removeBookmark } = postSlice.actions;
export default postSlice.reducer;
