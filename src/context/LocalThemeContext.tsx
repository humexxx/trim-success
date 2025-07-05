import { createContext, ReactNode, useMemo } from "react";

import { ThemeProvider } from "@mui/material";
// import theme from "humexxx-theme";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { EThemeType } from "src/enums";
import { useLocalStorage } from "src/hooks";
import { LOCAL_STORAGE_KEYS } from "src/lib/consts";

// const theme = responsiveFontSizes(
//   createTheme({
//     palette: {
//       mode: "light",
//       primary: {
//         main: "#1A1A1A",
//         contrastText: "#FFFFFF",
//       },
//       secondary: {
//         main: "#424242",
//         contrastText: "#FFFFFF",
//       },
//       background: {
//         default: "#F1F1F1",
//         paper: "#FFFFFF",
//       },
//       text: {
//         primary: "#1A1A1A",
//         secondary: "#4F4F4F",
//         disabled: "#9E9E9E",
//       },
//       divider: "#D6D6D6",
//     },
//     typography: {
//       h1: { fontWeight: 400, fontSize: "3rem" },
//       h2: { fontWeight: 400, fontSize: "2.25rem" },
//       h3: { fontWeight: 500, fontSize: "1.75rem" },
//       h4: { fontWeight: 500, fontSize: "1.5rem" },
//       h5: { fontWeight: 500, fontSize: "1.25rem" },
//       h6: { fontWeight: 500, fontSize: "1rem" },
//       body1: { fontSize: "1rem" },
//       body2: { fontSize: "0.875rem" },
//       button: {
//         textTransform: "none",
//         fontWeight: 500,
//       },
//     },
//     shape: {
//       borderRadius: 12,
//     },
//     components: {
//       MuiCard: {
//         defaultProps: {
//           elevation: 1,
//         },
//         styleOverrides: {
//           root: {
//             borderRadius: 12,
//             boxShadow: "0px 1px 3px rgba(60, 64, 67, 0.3)",
//             transition: "box-shadow 0.3s",
//             "&:hover": {
//               boxShadow: "0px 4px 6px rgba(60, 64, 67, 0.3)",
//             },
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: 24,
//             paddingInline: 20,
//             fontWeight: 500,
//             "&:hover": {
//               backgroundColor: "#424242",
//             },
//           },
//         },
//       },
//       MuiTextField: {
//         defaultProps: {
//           variant: "outlined",
//         },
//       },
//       MuiOutlinedInput: {
//         styleOverrides: {
//           root: {
//             borderRadius: 12,
//           },
//         },
//       },
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             borderRadius: 0,
//           },
//         },
//       },
//       MuiDialog: {
//         styleOverrides: {
//           paper: {
//             borderRadius: 16,
//           },
//         },
//       },
//       MuiPaper: {
//         styleOverrides: {
//           root: {
//             borderRadius: 12,
//           },
//         },
//       },
//       MuiTooltip: {
//         styleOverrides: {
//           tooltip: {
//             fontSize: "0.875rem",
//             borderRadius: 8,
//           },
//         },
//       },
//     },
//   })
// );

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      text: {
        primary: "#1A1A1A",
        secondary: "#4F4F4F",
        disabled: "#9E9E9E",
      },
      divider: "#D6D6D6",
    },
    typography: {
      h1: { fontWeight: 400, fontSize: "3rem" },
      h2: { fontWeight: 400, fontSize: "2.25rem" },
      h3: { fontWeight: 500, fontSize: "1.75rem" },
      h4: { fontWeight: 500, fontSize: "1.5rem" },
      h5: { fontWeight: 500, fontSize: "1.25rem" },
      h6: { fontWeight: 500, fontSize: "1rem" },
      body1: { fontSize: "1rem" },
      body2: { fontSize: "0.875rem" },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        defaultProps: {
          elevation: 1,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0px 1px 3px rgba(60, 64, 67, 0.3)",
            transition: "box-shadow 0.3s",
            // "&:hover": {
            //   boxShadow: "0px 4px 6px rgba(60, 64, 67, 0.3)",
            // },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            paddingInline: 20,
            fontWeight: 500,
            // "&:hover": {
            //   backgroundColor: "#424242",
            // },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: 0,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "0.875rem",
            borderRadius: 8,
          },
        },
      },
    },
  })
);
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
