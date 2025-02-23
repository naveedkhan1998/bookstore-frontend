import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

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
      const {
        _id,
        email,
        given_name,
        family_name,
        isVerified,
        isAdmin,
        avatarUrl,
      } = action.payload;
      state._id = _id;
      state.email = email;
      state.given_name = given_name;
      state.family_name = family_name;
      state.isVerified = isVerified;
      state.isAdmin = isAdmin;
      state.avatarUrl = avatarUrl;
    },
    unSetUserInfo: (state) => {
      state._id = "";
      state.email = "";
      state.given_name = "";
      state.family_name = "";
      state.isVerified = undefined;
      state.isAdmin = undefined;
    },
  },
});

export const { setUserInfo, unSetUserInfo } = userSlice.actions;

export default userSlice.reducer;

export const getCurrentUserDetails = (state: RootState) => state.user;
