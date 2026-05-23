import { createContext, ReactNode, useEffect, useMemo } from "react";

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

/**
 * Persists light/dark mode in localStorage and mirrors it into
 * <html class="dark"> so Tailwind/shadcn variants pick it up. The MUI
 * ThemeProvider it used to host was removed when the project finished
 * its shadcn migration.
 */
export function LocalThemeProvider({ children }: Props) {
  const [mode, setMode] = useLocalStorage<EThemeType>(
    LOCAL_STORAGE_KEYS.THEME,
    EThemeType.LIGHT
  );

  useEffect(() => {
    const root = document.documentElement;
    if (mode === EThemeType.DARK) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  const value = useMemo<LocalThemeContextType>(
    () => ({
      toggleColorMode: () =>
        setMode((prev) =>
          prev === EThemeType.LIGHT ? EThemeType.DARK : EThemeType.LIGHT
        ),
      theme: mode,
    }),
    [mode, setMode]
  );

  return (
    <LocalThemeContext.Provider value={value}>
      {children}
    </LocalThemeContext.Provider>
  );
}
