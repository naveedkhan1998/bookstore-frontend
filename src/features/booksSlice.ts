import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { BookVolume } from "../comman-types";

const initialState: BookVolume[] = [];

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<BookVolume[]>) => {
      return action.payload;
    },
  },
});

export const { setBooks } = bookSlice.actions;

export default bookSlice.reducer;

export const getBooks = (state: RootState) => state.books;
