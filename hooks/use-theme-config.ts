"use client";

import { useCustomTheme } from "@/components/providers/theme-provider";
import { useTheme } from "next-themes";
import { themes } from "@/lib/themes";

/**
 * Unified hook for accessing all theme-related functionality
 * Combines custom theme selection and dark/light mode management
 */
export function useThemeConfig() {
  const { customTheme, setCustomTheme } = useCustomTheme();
  const { theme: mode, setTheme: setMode, systemTheme } = useTheme();

  // Get current theme object
  const currentTheme = themes.find((t) => t.value === customTheme);

  // Get effective mode (resolves 'system' to actual theme)
  const effectiveMode = mode === "system" ? systemTheme : mode;

  // Check if dark mode is active
  const isDark = effectiveMode === "dark";

  // Toggle between light and dark
  const toggleMode = () => {
    setMode(isDark ? "light" : "dark");
  };

  // Set specific mode
  const setLightMode = () => setMode("light");
  const setDarkMode = () => setMode("dark");
  const setSystemMode = () => setMode("system");

  // Get theme by value
  const getTheme = (value: string) => {
    return themes.find((t) => t.value === value);
  };

  return {
    // Custom theme
    customTheme,
    setCustomTheme,
    currentTheme,
    themes,
    getTheme,

    // Dark/Light mode
    mode,
    setMode,
    effectiveMode,
    isDark,
    isLight: !isDark,
    isSystem: mode === "system",
    toggleMode,
    setLightMode,
    setDarkMode,
    setSystemMode,
  };
}

