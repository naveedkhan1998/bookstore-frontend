import type { FC } from "react";

interface UserTabsProps {
  activeTab: "active" | "inactive";
  onTabChange: (tab: "active" | "inactive") => void;
}

const UserTabs: FC<UserTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex space-x-4 border-b mt-8">
    <button
      className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
        activeTab === "active"
          ? "border-b-2 border-accent-DEFAULT text-accent-DEFAULT"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => onTabChange("active")}
    >
      Active Users
    </button>
    <button
      className={`px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200 ${
        activeTab === "inactive"
          ? "border-b-2 border-accent-DEFAULT text-accent-DEFAULT"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => onTabChange("inactive")}
    >
      Deactivated Users
    </button>
  </div>
);

export default UserTabs;
