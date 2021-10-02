import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VoteState {
  post: { [key: PostId]: boolean };
  reply: { [key: ReplyId]: boolean };
}

const initialState: VoteState = {
  post: {},
  reply: {},
};

export const voteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    setVote: (
      state,
      action: PayloadAction<{ type: ContentType; id: number; vote: boolean }>,
    ) => {
      const p = action.payload;
      state[p.type][p.id] = p.vote;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setVote } = voteSlice.actions;

export default voteSlice.reducer;
