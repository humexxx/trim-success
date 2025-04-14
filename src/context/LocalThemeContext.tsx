import { createContext, ReactNode, useMemo } from "react";

import { ThemeProvider } from "@mui/material";
import theme from "humexxx-theme";
import { EThemeType } from "src/enums";
import { useLocalStorage } from "src/hooks";
import { LOCAL_STORAGE_KEYS } from "src/lib/consts";

export interface LocalThemeContextType {
  toggleColorMode: () => void;
  theme: EThemeType;
}

const LocalThemeContext = createContext<LocalThemeContextType | undefined>(
  undefined
);
export default LocalThemeContext;

interface Props {
  children: ReactNode;
}

export function LocalThemeProvider({ children }: Props) {
  const [mode, setMode] = useLocalStorage<EThemeType>(
    LOCAL_STORAGE_KEYS.THEME,
    EThemeType.LIGHT
  );

  const value: LocalThemeContextType = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) =>
          prev === EThemeType.LIGHT ? EThemeType.DARK : EThemeType.LIGHT
        );
      },
      theme: mode,
    }),
    [mode, setMode]
  );

  return (
    <LocalThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </LocalThemeContext.Provider>
  );
}
