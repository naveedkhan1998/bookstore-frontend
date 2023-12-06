import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { PublicBooklist } from "../comman-types";

const initialState: PublicBooklist = [];

export const publicBooklistSlice = createSlice({
  name: "publicbooklists",
  initialState,
  reducers: {
    setPublicBookslist: (state, action: PayloadAction<PublicBooklist>) => {
      return action.payload;
    },
    unSetPublicBooklist: (state) => {
      return initialState;
    },
  },
});

export const { setPublicBookslist, unSetPublicBooklist } =
  publicBooklistSlice.actions;

export default publicBooklistSlice.reducer;

export const getPublicBooklists = (state: RootState) => state.publicbooklists;
