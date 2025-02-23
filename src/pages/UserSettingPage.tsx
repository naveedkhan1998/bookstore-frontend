import { useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentSettingDetails, Language } from "../features/settingSlice";
import { Tab } from "@headlessui/react";
import { toast } from "react-toastify";
import {
  HiOutlineMail,
  HiSave,
  HiOutlineBell,
  HiOutlineColorSwatch,
  HiOutlineShieldCheck,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineDesktopComputer,
  HiOutlineCheck,
} from "react-icons/hi";
import Button from "../components/ui/button/Button";
import Input from "../components/ui/input/input.component";

const UserSettings = () => {
  const setting = useSelector(getCurrentSettingDetails);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("system");

  if (!setting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  const ThemeButton = ({ value, icon: Icon, label }: any) => (
    <button
      onClick={() => setSelectedTheme(value)}
      className={`flex items-center p-4 rounded-lg border-2 transition-all ${
        selectedTheme === value
          ? "border-accent-DEFAULT bg-accent-DEFAULT/10"
          : "border-gray-200 dark:border-gray-700 hover:border-accent-DEFAULT"
      }`}
    >
      <Icon
        className={`w-5 h-5 mr-3 ${selectedTheme === value ? "text-accent-DEFAULT" : ""}`}
      />
      <span className="flex-1 text-left">{label}</span>
      {selectedTheme === value && (
        <HiOutlineCheck className="w-5 h-5 text-accent-DEFAULT" />
      )}
    </button>
  );

  const tabs = [
    {
      name: "Appearance",
      icon: HiOutlineColorSwatch,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Theme Preferences</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <ThemeButton
                value="light"
                icon={HiOutlineSun}
                label="Light Mode"
              />
              <ThemeButton
                value="dark"
                icon={HiOutlineMoon}
                label="Dark Mode"
              />
              <ThemeButton
                value="system"
                icon={HiOutlineDesktopComputer}
                label="System"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Language</h3>
            <select
              className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary"
              value={setting.language}
            >
              <option value={Language.English}>English</option>
              <option value={Language.French}>Français</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      name: "Notifications",
      icon: HiOutlineBell,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
            <div className="space-y-4">
              {[
                "New book recommendations",
                "Reading list updates",
                "Price drop alerts",
                "Order status updates",
                "Newsletter",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between p-4 bg-white dark:bg-dark-secondary rounded-lg"
                >
                  <span>{item}</span>
                  <Switch enabled={setting.email_notification} />
                </label>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Privacy",
      icon: HiOutlineShieldCheck,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                startIcon={<HiOutlineMail />}
                helperText="Your email is private and won't be shared"
              />
              <div className="space-y-4">
                {[
                  "Make my reading list public",
                  "Show my reviews publicly",
                  "Allow friend requests",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center justify-between p-4 bg-white dark:bg-dark-secondary rounded-lg"
                  >
                    <span>{item}</span>
                    <Switch enabled={false} />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
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
    <div className="container max-w-4xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Settings</h2>
        <Button
          variant="default"
          onClick={handleSaveClick}
          disabled={isSaving}
          className="flex items-center"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-current rounded-full animate-spin border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <HiSave className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tab.Group>
        <Tab.List className="flex p-1 mb-8 space-x-2 rounded-xl bg-gray-100 dark:bg-gray-800">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `flex items-center justify-center w-full py-3 text-sm font-medium rounded-lg transition-all
                ${
                  selected
                    ? "bg-white dark:bg-gray-700 text-accent-DEFAULT shadow"
                    : "hover:text-accent-DEFAULT"
                }`
              }
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className="p-6 bg-main-secondary dark:bg-dark-secondary rounded-xl"
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

const Switch = ({ enabled }: { enabled: boolean }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${enabled ? "bg-accent-DEFAULT" : "bg-gray-200 dark:bg-gray-700"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${enabled ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

export default UserSettings;
