"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { themes, DEFAULT_THEME } from "@/lib/themes";

interface ThemeContextType {
  customTheme: string;
  setCustomTheme: (theme: string) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  customTheme: DEFAULT_THEME,
  setCustomTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [customTheme, setCustomThemeState] = React.useState(DEFAULT_THEME);
  const [mounted, setMounted] = React.useState(false);

  // Load theme from localStorage on mount and initialize
  React.useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("custom-theme");
    if (savedTheme && themes.find((t) => t.value === savedTheme)) {
      setCustomThemeState(savedTheme);
    } else {
      // Set default if no saved theme
      setCustomThemeState(DEFAULT_THEME);
    }
  }, []);

  // Update theme CSS link when theme changes
  React.useEffect(() => {
    if (!mounted) return;

    const themeConfig = themes.find((t) => t.value === customTheme);
    if (!themeConfig) return;

    // Remove existing theme link if any
    const existingLink = document.getElementById("theme-stylesheet");
    if (existingLink) {
      existingLink.remove();
    }

    // Add new theme link
    const link = document.createElement("link");
    link.id = "theme-stylesheet";
    link.rel = "stylesheet";
    link.href = `/themes/${themeConfig.cssFile}`;
    
    // Add onload handler to ensure CSS is loaded
    link.onload = () => {
      // Force a small repaint to ensure styles are applied
      document.body.style.display = 'none';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
    };
    
    document.head.appendChild(link);
  }, [customTheme, mounted]);

  const setCustomTheme = React.useCallback((theme: string) => {
    setCustomThemeState(theme);
    localStorage.setItem("custom-theme", theme);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeContext.Provider value={{ customTheme, setCustomTheme }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export function useCustomTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useCustomTheme must be used within ThemeProvider");
  }
  return context;
}

