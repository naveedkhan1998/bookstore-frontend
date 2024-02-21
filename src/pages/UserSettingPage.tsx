// UserSettings.tsx

import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import {
  SettingType,
  setSettingInfo,
  getCurrentSettingDetails,
  Language,
} from "../features/settingSlice";
import { DarkThemeToggle } from "flowbite-react";

// element to display user settings
const UserSettings = () => {
  const dispatch = useDispatch();
  // get setting from Redux Storage
  const setting = useSelector(getCurrentSettingDetails);

  // display "Loading..." when data is still retriving
  if (!setting) {
    return <div>Loading...</div>;
  }

  // Handle change event
  const handleSettingChange = (settingName: string) => {
    console.log("handle change setting!");
    switch (settingName) {
      case "emailNotifications":
        // toggle emailNotifications option
        dispatch(
          setSettingInfo({
            ...setting,
            email_notification: !setting.email_notification,
          })
        );
        break;
      case "darkMode":
        dispatch(setSettingInfo({ ...setting, dark_mode: !setting.dark_mode }));
        break;
      default:
        break;
    }
  };

  const handleSaveClick = () => {
    console.log("handle save setting event!");
  };

  const handleLanguageChange = (newLanguage: Language) => {
    const newSetting = { ...setting, language: newLanguage };
    dispatch(setSettingInfo(newSetting));
  };

  // render the User Setting page
  return (
    <div className="container mx-auto p-8 mt-10 rounded-md bg-main-secondary dark:bg-dark-secondary border">
      <h2 className="text-3xl font-semibold mb-4">User Settings</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email Notifications
        </label>
        <input
          type="checkbox"
          className="mr-2 leading-tight"
          checked={setting.email_notification}
          onChange={() => handleSettingChange("emailNotifications")}
        />
        <span className="text-sm">Receive email notifications</span>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Language
        </label>
        <select
          className="w-fit bg-white border border-gray-300 rounded-md py-2 px-4"
          value={setting.language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
        >
          <option value={Language.English}>English</option>
          <option value={Language.French}>French</option>
          {/* other languages... */}
        </select>
      </div>

      {/* other settings... */}

      <div className="mt-6">
        <Button variant={"default"} size={"default"} onClick={handleSaveClick}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;
