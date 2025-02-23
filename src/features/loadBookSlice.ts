import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { BookVolume } from "../comman-types";

const initialState: BookVolume[] = [];

export const loadBookSlice = createSlice({
  name: "loadbook",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<BookVolume>) => {
      const existingBook = state.find((book) => book.id === action.payload.id);
      if (!existingBook) {
        state.push(action.payload);
      }
      return state;
    },
    unsetLoadedBook: (state) => {
      return initialState;
    },
  },
});

export const { addBook, unsetLoadedBook } = loadBookSlice.actions;

export default loadBookSlice.reducer;

export const getLoadedBooks = (state: RootState) => state.loadbook;
