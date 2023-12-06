import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export enum Language {
    English = "en",
    French = "fr",
}

export interface SettingType {
  email_notification: boolean;
  dark_mode: boolean;
  language: Language;
}

const initialState: SettingType = {
  email_notification: true,
  dark_mode: false,
  language: Language.English,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSettingInfo: (state, action: PayloadAction<SettingType>) => {
      const { email_notification, dark_mode, language } = action.payload;
      state.email_notification = email_notification;
      state.dark_mode = dark_mode;
      state.language = language;
    },
    unSetSettingInfo: (state) => {
      state.email_notification = true;
      state.dark_mode = false;
      state.language = Language.English;
    },
  },
});

export const { setSettingInfo, unSetSettingInfo} = settingSlice.actions;

export default settingSlice.reducer;

export const getCurrentSettingDetails = (state: RootState) => state.setting;