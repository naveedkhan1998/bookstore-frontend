import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface UserType {
  email: string;
  name: string;
  avatarUrl?: string;
}

const initialState: UserType = {
  email: "",
  name: "",
  avatarUrl: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserType>) => {
      const { email, name, avatarUrl } = action.payload;
      state.email = email;
      state.name = name;
      state.avatarUrl = avatarUrl;
    },
    unSetUserInfo: (state) => {
      state.email = "";
      state.name = "";
      state.avatarUrl = "";
    },
  },
});

export const { setUserInfo, unSetUserInfo } = userSlice.actions;

export default userSlice.reducer;

export const getCurrentUserDetails = (state: RootState) => state.user;
