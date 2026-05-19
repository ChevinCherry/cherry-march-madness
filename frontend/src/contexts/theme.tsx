import React, { createContext, useContext, useState } from "react";
import { Theme } from "../types/theme";
import { LightTheme } from "../themes/light";

interface ThemeContext {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContext>({
  theme: LightTheme,
});

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(LightTheme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
