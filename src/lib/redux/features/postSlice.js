// lib/redux/features/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    postId: null,
  },
  reducers: {
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
  },
});

export const { setPostId } = postSlice.actions;

export const selectPostId = (state) => state.post.postId;

export default postSlice.reducer;
