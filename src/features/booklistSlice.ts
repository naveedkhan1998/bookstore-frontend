import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { BookListContainer } from "../comman-types";

const initialState: BookListContainer = {};

export const booklistSlice = createSlice({
  name: "userbooklists",
  initialState,
  reducers: {
    setUserBookslist: (state, action: PayloadAction<BookListContainer>) => {
      return action.payload;
    },
    unSetUserBooklist: (state) => {
        return initialState;
      },
  },
});

export const { setUserBookslist,unSetUserBooklist } = booklistSlice.actions;

export default booklistSlice.reducer;

export const getUserBooklists = (state: RootState) => state.userbooklists;
