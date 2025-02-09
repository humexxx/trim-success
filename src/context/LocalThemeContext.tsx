import { createContext, ReactNode, useMemo } from "react";

import { createTheme, ThemeProvider } from "@mui/material";
import { EThemeType } from "src/enums";
import { useLocalStorage } from "src/hooks";
import { LOCAL_STORAGE_KEYS } from "src/lib/consts";
import { getDesignTokens } from "src/lib/themes";

import { useAuth } from "./hooks";

export interface LocalThemeContextType {
  toggleColorMode: () => void;
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
  const { currentUser } = useAuth();

  const theme = useMemo(
    () =>
      createTheme({
        ...((currentUser as any)
          .hasCustomTheme /* || true when we want to add a custom theme */
          ? getDesignTokens(mode)
          : {
              palette: {
                mode,
              },
            }),
        components: {
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none",
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              size: "small",
            },
          },
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 500 },
          body1: { fontSize: "1rem", lineHeight: 1.6 },
          body2: { fontSize: "0.875rem", lineHeight: 1.6 },
        },
      }),
    [currentUser, mode]
  );

  const value: LocalThemeContextType = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) =>
          prev === EThemeType.LIGHT ? EThemeType.DARK : EThemeType.LIGHT
        );
      },
    }),
    [setMode]
  );

  return (
    <LocalThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </LocalThemeContext.Provider>
  );
}
