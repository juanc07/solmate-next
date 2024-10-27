"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import useLocalStorage from "@/lib/useLocalStorage"; // Custom hook
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast"; // ShadCN Toast components

const SettingsSection = () => {
  // LocalStorage hooks for retrieving and saving values
  const [getDarkMode, setDarkModeStorage] = useLocalStorage<boolean>(
    "dark",
    false
  );
  const [getNotificationsEnabled, setNotificationsStorage] =
    useLocalStorage<boolean>("notifications-enabled", true);

  // Initialize state from localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getDarkMode() ?? false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    () => getNotificationsEnabled() ?? true
  );

  // State for toast visibility
  const [showToast, setShowToast] = useState(false);

  // Save settings to localStorage on button click
  const handleSaveSettings = () => {
    setDarkModeStorage(isDarkMode);
    setNotificationsStorage(notificationsEnabled);
    console.log("Settings saved. isDarkMode:", isDarkMode);

    // Trigger the toast notification
    setShowToast(true);

    // Automatically hide the toast after 2.5 seconds
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleThemeToggle = () => setIsDarkMode((prev) => !prev);
  const handleNotificationsToggle = () =>
    setNotificationsEnabled((prev) => !prev);

  return (
    <ToastProvider>
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
          <Button
            className="w-full mt-4"
            variant="default"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        open={showToast}
        onOpenChange={setShowToast}
        className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg"
      >
        <ToastTitle className="font-bold">Settings Saved!</ToastTitle>
        <ToastDescription>
          Your settings have been successfully saved.
        </ToastDescription>
      </Toast>

      {/* Toast Viewport */}
      <ToastViewport className="fixed bottom-0 right-0 p-4" />
    </ToastProvider>
  );
};

export default SettingsSection;
