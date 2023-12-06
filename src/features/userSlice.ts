import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UserType {
  _id: string;
  access?: string;
  email: string;
  family_name: string;
  given_name: string;
  is_verified?: boolean;
  is_admin?: boolean;
  avatarUrl?: string;
}

const initialState: UserType = {
  _id: "",
  email: "",
  given_name: "",
  family_name: "",
  avatarUrl: "https://ui-avatars.com/api/?name=John+Boe",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserType>) => {
      const { _id, email, given_name, family_name, is_verified, is_admin,avatarUrl } =
        action.payload;
      state._id = _id;
      state.email = email;
      state.given_name = given_name;
      state.family_name = family_name;
      state.is_verified = is_verified;
      state.is_admin = is_admin;
      state.avatarUrl = avatarUrl;
    },
    unSetUserInfo: (state) => {
      state._id = "";
      state.email = "";
      state.given_name = "";
      state.family_name = "";
      state.is_verified = undefined;
      state.is_admin = undefined;
    },
  },
});

export const { setUserInfo, unSetUserInfo } = userSlice.actions;

export default userSlice.reducer;

export const getCurrentUserDetails = (state: RootState) => state.user;
