import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentSettingDetails, Language } from "../features/settingSlice";
import { Tab } from "@headlessui/react";
import { toast } from "react-toastify";
import {
  HiOutlineMail,
  HiOutlineGlobe,
  HiSave,
  HiOutlineBell,
  HiOutlineColorSwatch,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const UserSettings = () => {
  const setting = useSelector(getCurrentSettingDetails);
  const [isSaving, setIsSaving] = useState(false);

  if (!setting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  const tabs = [
    { name: "General", icon: HiOutlineColorSwatch },
    { name: "Notifications", icon: HiOutlineBell },
    { name: "Privacy", icon: HiOutlineShieldCheck },
  ];

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container p-6 mx-auto mt-10 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h2>

        <Tab.Group>
          <Tab.List className="flex p-1 mb-8 space-x-2 rounded-xl bg-main-primary dark:bg-dark-primary">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full py-3 text-sm leading-5 font-medium rounded-lg transition-all
                  ${
                    selected
                      ? "bg-white dark:bg-gray-800 text-indigo-600 shadow"
                      : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 hover:bg-white/[0.12]"
                  }`
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-2 space-y-8">
            {/* General Settings Panel */}
            <Tab.Panel className="space-y-6">
              <SettingCard
                title="Language"
                icon={HiOutlineGlobe}
                description="Choose your preferred language"
              >
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                  value={setting.language}
                >
                  <option value={Language.English}>English</option>
                  <option value={Language.French}>French</option>
                </select>
              </SettingCard>

              {/* Add more general settings here */}
            </Tab.Panel>

            {/* Notifications Panel */}
            <Tab.Panel className="space-y-6">
              <SettingCard
                title="Email Notifications"
                icon={HiOutlineMail}
                description="Manage your email preferences"
              >
                <div className="space-y-4">
                  <ToggleOption
                    label="New book recommendations"
                    checked={setting.email_notification}
                  />
                  <ToggleOption
                    label="Reading list updates"
                    checked={setting.email_notification}
                  />
                </div>
              </SettingCard>
            </Tab.Panel>

            {/* Privacy Panel */}
            <Tab.Panel className="space-y-6">
              {/* Add privacy settings here */}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="sticky bottom-0 flex justify-end px-6 py-4 mt-8 -mx-6 bg-white border-t dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex items-center px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-5 h-5 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
            ) : (
              <HiSave className="w-5 h-5 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  children: React.ReactNode;
}

const SettingCard = ({
  title,
  icon: Icon,
  description,
  children,
}: SettingCardProps) => (
  <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
    <div className="flex items-center gap-4 mb-4">
      <Icon className="w-6 h-6 text-indigo-500" />
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
    {children}
  </div>
);

interface ToggleOptionProps {
  label: string;
  checked: boolean;
}

const ToggleOption = ({ label, checked }: ToggleOptionProps) => (
  <label className="flex items-center justify-between">
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  </label>
);

export default UserSettings;
