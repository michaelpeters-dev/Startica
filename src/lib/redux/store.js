import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./features/modalSlice";
import postReducer from "./features/postSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    post: postReducer,
  },
});
