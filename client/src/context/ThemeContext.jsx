import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const applyThemeToDOM = (theme) => {
  const html = document.documentElement;

  // ALWAYS remove dark first
  html.classList.remove("dark");

  if (theme === "dark") {
    html.classList.add("dark");
  }

  if (theme === "system") {
    const isDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isDark) {
      html.classList.add("dark");
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }

    return "light";
  });

  useEffect(() => {
    console.log("THEME CHANGED:", theme);

    applyThemeToDOM(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    console.log("CHANGING THEME TO:", newTheme);

    setTheme(newTheme);

    // Apply immediately too
    applyThemeToDOM(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};