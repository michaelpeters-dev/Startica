import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  postId: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.postId = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.postId = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
