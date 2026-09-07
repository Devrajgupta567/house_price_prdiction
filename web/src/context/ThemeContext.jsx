import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  isDark: true,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("valu_theme");
    if (saved === "light" || saved === "dark") return saved;
    // Default to dark for sleek high-tech look, but user can easily switch to light
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("valu_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
