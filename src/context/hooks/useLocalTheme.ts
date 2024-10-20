import { useContext } from "react";

import ThemeContext from "../LocalThemeContext";

export default function useLocalTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useLocalTheme must be used within an LocalThemeProvider");
  }
  return context;
}
