import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { UserCart } from "@/shared/types/api";

const initialState: UserCart = {
  books: {},
};

export const cartSlice = createSlice({
  name: "usercart",
  initialState,
  reducers: {
    setUserCart: (_state, action: PayloadAction<UserCart>) => {
      return action.payload;
    },
    unSetUserCart: (_state) => {
      return initialState;
    },
  },
});

export const { setUserCart, unSetUserCart } = cartSlice.actions;

export default cartSlice.reducer;
