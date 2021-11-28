import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentState {
  comments: { [key: CommentId]: Comment };
  selectedComment?: CommentId;
}

const initialState: CommentState = { comments: {} };

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComment: (state, action: PayloadAction<Comment>) => {
      const p = action.payload;
      state.comments[p.id] = p;
    },
    setCommentMulti: (state, action: PayloadAction<Comment[]>) => {
      action.payload.forEach(comment => {
        state.comments[comment.id] = comment;
      });
    },
    editComment: (
      state,
      action: PayloadAction<{
        id: CommentId;
        comment: Partial<Comment>;
      }>,
    ) => {
      const p = action.payload;
      const comment = state.comments[p.id];
      state.comments[p.id] = {
        ...comment,
        ...p.comment,
      };
    },
    clearComments: state => {
      state.comments = {};
    },
    setCommentVote: (
      state,
      action: PayloadAction<{ id: PostId; vote: boolean }>,
    ) => {
      const p = action.payload;
      const post = state.comments[p.id];
      if (post.your_vote !== p.vote) {
        post.your_vote = p.vote;
        if (p.vote) {
          post.score += 1;
        } else {
          post.score -= 1;
        }
      }
    },
    setSelectedComment: (
      state,
      action: PayloadAction<CommentId | undefined>,
    ) => {
      state.selectedComment = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setComment,
  setCommentMulti,
  editComment,
  clearComments,
  setCommentVote,
  setSelectedComment,
} = commentSlice.actions;

export default commentSlice.reducer;
