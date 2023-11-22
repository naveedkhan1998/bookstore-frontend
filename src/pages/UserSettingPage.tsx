// UserSettings.tsx

import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/Button';

// element to display user settings
const UserSettings = () => {
    // TODO: get userId from Redux storage
    const userId = '1';

    // use state to save user state
    const [settings, setSettings] = useState<{
        id: string,
        emailNotifications: boolean,
        darkMode: boolean,
        language: string,
        // ......
      } | null>(null);

    // onClick event
    const handleSaveClick = () => {
        // save setting to the server
        console.log('Settings saved:', settings);
    };

    // get user setting from the server or Redux
    useEffect(() => {
      // Request for user settingk data async
      setTimeout(() => {
        // mock data, assume the data will be retrived from other place
          const mockSettingData = {
              id: userId || '', // make sure the userId is not undefined
              emailNotifications: true,
              darkMode: false,
              language: 'en',
              // other data ....
          };

        // set state to triggle render
        setSettings(mockSettingData);
      }, 1000); // mock 1s delay
    }, [userId]); // when userId changed, re-render


  // display "Loading..." when data is still retriving
  if (!settings) {
    return <div>Loading...</div>;
  }

    // Handle change event
    const handleSettingChange = (settingName: string) => {
        setSettings((prevSettings) => {
            if (prevSettings === null) {
                return prevSettings; // Return null if prevSettings is null
            }

            // Use type assertion to inform TypeScript about the structure of prevSettings
            return {
                ...(prevSettings as {
                    id: string;
                    emailNotifications: boolean;
                    darkMode: boolean;
                    language: string;
                }),
                [settingName]: !prevSettings[settingName as keyof typeof prevSettings],
            };
        });
    };

  // render the User Profile page
  return (
    <div className="w-full h-fit mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
    <h2 className="text-3xl font-semibold mb-4">User Settings</h2>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Email Notifications
      </label>
      <input
        type="checkbox"
        className="mr-2 leading-tight"
        checked={settings.emailNotifications}
        onChange={() => handleSettingChange('emailNotifications')}
      />
      <span className="text-sm">Receive email notifications</span>
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Dark Mode
      </label>
      <input
        type="checkbox"
        className="mr-2 leading-tight"
        checked={settings.darkMode}
        onChange={() => handleSettingChange('darkMode')}
      />
      <span className="text-sm">Enable dark mode</span>
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Language
      </label>
      <select
        className="w-fit bg-white border border-gray-300 rounded-md py-2 px-4"
        value={settings.language}
        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        {/* other languages... */}
      </select>
    </div>

    {/* other settings... */}

    <div className="mt-6">
      <Button
        variant={'default'}
        size={'default'}
        onClick={handleSaveClick}
      >
        Save Settings
      </Button>
    </div>
  </div>
  );
};

export default UserSettings;
