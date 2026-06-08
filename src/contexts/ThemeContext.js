import React, { createContext, useMemo, useState } from 'react';
import { darkColors, lightColors } from '../styles/colors';

export const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors = useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode]);

  function toggleTheme() {
    setIsDarkMode((current) => !current);
  }

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}