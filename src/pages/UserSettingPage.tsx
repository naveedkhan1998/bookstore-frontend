import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSettingInfo, getCurrentSettingDetails, Language } from "../features/settingSlice";
import { DarkThemeToggle } from "flowbite-react";
import { HiOutlineMail, HiOutlineGlobe, HiSave } from "react-icons/hi";

const UserSettings = () => {
  const dispatch = useDispatch();
  const setting = useSelector(getCurrentSettingDetails);

  if (!setting) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleSettingChange = (settingName: string) => {
    switch (settingName) {
      case "emailNotifications":
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
    console.log("Settings saved!");
  };

  const handleLanguageChange = (newLanguage: Language) => {
    const newSetting = { ...setting, language: newLanguage };
    dispatch(setSettingInfo(newSetting));
  };

  return (
    <div className="container p-6 mx-auto mt-10 rounded-lg shadow-lg bg-main-secondary dark:bg-dark-secondary">
      <h2 className="mb-6 text-4xl font-bold text-center ">User Settings</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="p-5 rounded-lg shadow-md bg-main-primary dark:bg-dark-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold ">Email Notifications</h3>
            <HiOutlineMail className="text-2xl text-indigo-500 dark:text-indigo-300" />
          </div>
          <label className="inline-flex items-center">
            <input type="checkbox" className="w-5 h-5 text-indigo-600 form-checkbox " checked={setting.email_notification} onChange={() => handleSettingChange("emailNotifications")} />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Receive email notifications</span>
          </label>
        </div>

        <div className="p-5 rounded-lg shadow-md bg-main-primary dark:bg-dark-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold ">Language</h3>
            <HiOutlineGlobe className="text-2xl text-indigo-500 dark:text-indigo-300" />
          </div>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md dark:bg-dark-primary dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-300"
            value={setting.language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
          >
            <option value={Language.English}>English</option>
            <option value={Language.French}>French</option>
            {/* Add more language options here */}
          </select>
        </div>

        {/* Add more settings sections here in a similar card style */}
      </div>

      <div className="flex justify-center mt-8">
        <button className="flex items-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500" onClick={handleSaveClick}>
          <HiSave className="mr-2 text-xl" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
