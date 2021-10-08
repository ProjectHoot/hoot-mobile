import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../slices/postSlice";
import lotideReducer from "../slices/lotideSlice";
import replyReducer from "../slices/replySlice";

const store = configureStore({
  reducer: {
    lotide: lotideReducer,
    posts: postReducer,
    replies: replyReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
