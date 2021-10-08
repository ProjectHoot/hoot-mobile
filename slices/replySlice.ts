import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReplyState {
  replies: { [key: ReplyId]: Reply };
  selectedReply?: ReplyId;
}

const initialState: ReplyState = { replies: {} };

export const replySlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    setReply: (state, action: PayloadAction<{ reply: Reply }>) => {
      const p = action.payload;
      state.replies[p.reply.id] = p.reply;
    },
    setReplyMulti: (state, action: PayloadAction<{ replies: Reply[] }>) => {
      action.payload.replies.forEach(reply => {
        state.replies[reply.id] = reply;
      });
    },
    editReply: (
      state,
      action: PayloadAction<{
        id: ReplyId;
        reply: Partial<Reply>;
      }>,
    ) => {
      const p = action.payload;
      const reply = state.replies[p.id];
      state.replies[p.id] = {
        ...reply,
        ...p.reply,
      };
    },
    clearReplies: state => {
      state.replies = {};
    },
    setReplyVote: (
      state,
      action: PayloadAction<{ id: PostId; vote: boolean }>,
    ) => {
      const p = action.payload;
      const post = state.replies[p.id];
      if (post.your_vote !== p.vote) {
        post.your_vote = p.vote;
        if (p.vote) {
          post.score += 1;
        } else {
          post.score -= 1;
        }
      }
    },
    setSelectedReply: (state, action: PayloadAction<ReplyId | undefined>) => {
      state.selectedReply = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setReply,
  setReplyMulti,
  editReply,
  clearReplies,
  setReplyVote,
  setSelectedReply,
} = replySlice.actions;

export default replySlice.reducer;
