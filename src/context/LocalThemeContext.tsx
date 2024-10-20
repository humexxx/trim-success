import { createContext, ReactNode, useMemo } from "react";

import { createTheme, ThemeProvider } from "@mui/material";
import { LOCAL_STORAGE_KEYS } from "src/consts";
import { EThemeType } from "src/enums";
import { useLocalStorage } from "src/hooks";
import { getDesignTokens } from "src/themes";

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
