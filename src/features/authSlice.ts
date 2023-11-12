import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface TokenState {
  access?: string | null;
  refresh?: string | null;
}

const initialState: TokenState = {
  access: 'abcdefgh',
  refresh: 'abcdefgh',
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TokenState>) => {
      const { access, refresh } = action.payload;
      state.access = access;
      state.refresh = refresh;
    },
    logOut: (state) => {
      state.access = null;
      state.refresh = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const getCurrentToken = (state: RootState) => state.auth.access;
export const getCurrentRefreshToken = (state: RootState) => state.auth.refresh;
