import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LotideState = {
  ctx: LotideContext | null;
};

const initialState: LotideState = {
  ctx: null,
};

export const voteSlice = createSlice({
  name: "lotide",
  initialState,
  reducers: {
    setCtx: (state, action: PayloadAction<LotideContext>) => {
      state.ctx = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCtx } = voteSlice.actions;

export default voteSlice.reducer;
