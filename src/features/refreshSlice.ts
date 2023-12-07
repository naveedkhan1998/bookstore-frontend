import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

const initialState = false;

export const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    setRefresh: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;

export const getRefresh = (state: RootState) => state.refresh;
