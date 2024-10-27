"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button

const SettingsSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleThemeToggle = () => setIsDarkMode((prev) => !prev);
  const handleNotificationsToggle = () =>
    setNotificationsEnabled((prev) => !prev);

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Dark Mode</h3>
          <div
            onClick={handleThemeToggle}
            className={`cursor-pointer w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
              isDarkMode ? "bg-violet-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div
            onClick={handleNotificationsToggle}
            className={`cursor-pointer w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
              notificationsEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                notificationsEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Save Settings Button */}
        <Button className="w-full mt-4" variant="default">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsSection;
