import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { UserCart } from "../comman-types";

const initialState: UserCart = {
  books: {},
};

export const cartSlice = createSlice({
  name: "usercart",
  initialState,
  reducers: {
    setUserCart: (state, action: PayloadAction<UserCart>) => {
      return action.payload;
    },
    unSetUserCart: (state) => {
      return initialState;
    },
  },
});

export const { setUserCart, unSetUserCart } = cartSlice.actions;

export default cartSlice.reducer;

export const getUserCart = (state: RootState) => state.usercart;
