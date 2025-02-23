import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { Elixirs } from "../comman-types";

const initialState: Elixirs[] = [];

export const elixirsSlice = createSlice({
  name: "elixirs",
  initialState,
  reducers: {
    setElixirs: (_state, action: PayloadAction<Elixirs[]>) => {
      return action.payload;
    },
  },
});

export const { setElixirs } = elixirsSlice.actions;

export default elixirsSlice.reducer;

export const getElixirs = (state: RootState) => state.elixirs;
