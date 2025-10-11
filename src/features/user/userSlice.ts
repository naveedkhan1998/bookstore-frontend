import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface UserType {
  _id: string;
  access?: string;
  email: string;
  family_name: string;
  given_name: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  avatarUrl?: string;
}

const initialState = null as UserType | null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (_state, action: PayloadAction<UserType | null>) => {
      return action.payload;
    },
    unSetUserInfo: () => {
      return null;
    },
  },
});

export const { setUserInfo, unSetUserInfo } = userSlice.actions;

export default userSlice.reducer;

export const getCurrentUserDetails = (state: RootState) => state.user;
