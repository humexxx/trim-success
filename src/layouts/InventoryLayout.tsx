import { useCallback, useState } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";
import Filter3OutlinedIcon from "@mui/icons-material/Filter3Outlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SpeedIcon from "@mui/icons-material/Speed";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Box,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PrivateRoute } from "src/components";
import { LocalThemeProvider, CubeProvider } from "src/context";
import { useAuth, useCube, useLocalTheme } from "src/context/hooks";
import { EThemeType } from "src/enums";
import { ROUTES, VERSION } from "src/lib/consts";

import { Header, Sidenav } from "./_components";
import { SIDENAV_WIDTH } from "./_components/Sidenav";

const dataImportRoutes = (isAdmin: boolean) =>
  [
    {
      admin: true,
      text: "Impersonar",
      icon: <PeopleAltIcon fontSize="small" />,
      path: "/inventory/admin/impersonate",
    },
    {
      text: "Importar",
      icon: <DownloadIcon fontSize="small" />,
      path: "/inventory/import",
      requireContextUid: true,
    },
  ].filter((route) => (route.admin ? isAdmin : true));

const dataVisualizationsRoutes = [
  {
    text: "Panel",
    icon: <DashboardIcon fontSize="small" />,
    path: "/inventory/dashboard",
    requireInitialData: true,
  },
  {
    text: "Generales",
    icon: <DescriptionOutlinedIcon fontSize="small" />,
    path: "/inventory/general-data",
    requireInitialData: true,
  },
];

const dataAnalyticsRoutes = [
  {
    text: "Data Mining",
    icon: <Filter1OutlinedIcon fontSize="small" />,
    path: ROUTES.INVENTORY.DATA_MINING,
    requireInitialData: true,
  },
  {
    text: "Scorecard",
    icon: <Filter2OutlinedIcon fontSize="small" />,
    path: "/inventory/scorecard",
    requireInitialData: true,
  },
  {
    text: "Inventario",
    icon: <Filter3OutlinedIcon fontSize="small" />,
    path: "/inventory/inventory-performance",
    requireInitialData: true,
  },
];

const secondaryRoutes = (isAdmin: boolean) => {
  return [
    {
      text: "IA",
      icon: <SmartToyIcon fontSize="small" />,
      path: "/inventory/ai",
      requireInitialData: true,
      disabled: true,
    },
    {
      admin: true,
      text: "Testing",
      icon: <SpeedIcon fontSize="small" />,
      requireInitialData: true,
      path: "/inventory/admin/testing",
    },
  ].filter((route) => (route.admin ? isAdmin : true));
};

function InventoryLayout() {
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const cube = useCube();

  const themeContext = useLocalTheme();
  const { hasInitialData, isCubeLoading } = useCube();
  const { isAdmin, customUser } = useAuth();
  const location = useLocation();

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor:
          themeContext.theme === EThemeType.LIGHT
            ? "#fafafa"
            : "background.default",
      }}
    >
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidenav
        title="Inventory"
        version={VERSION}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        setIsClosing={setIsClosing}
      >
        <List dense>
          <ListItem>
            <ListItemButton
              sx={{
                borderRadius: 2,
              }}
              selected={location.pathname.includes(ROUTES.MODULE_SELECTOR)}
              component={NavLink}
              to={ROUTES.MODULE_SELECTOR}
            >
              <ListItemIcon>
                <ViewModuleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={"Modulos"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />

        <List dense>
          <ListItem>
            <Typography variant="caption" ml={2}>
              Data Import
            </Typography>
          </ListItem>
          {dataImportRoutes(isAdmin).map(
            ({ text, icon, path, requireContextUid }) => (
              <ListItem key={text}>
                <ListItemButton
                  sx={{ borderRadius: 2 }}
                  selected={location.pathname.includes(path)}
                  component={NavLink}
                  to={path}
                  disabled={requireContextUid && isAdmin && !customUser?.uid}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>

        <List dense>
          <ListItem>
            <Typography variant="caption" ml={2}>
              Resumen
            </Typography>
          </ListItem>
          {dataVisualizationsRoutes.map(
            ({ text, icon, path, requireInitialData }) => (
              <ListItem key={text}>
                <ListItemButton
                  sx={{ borderRadius: 2 }}
                  selected={location.pathname.includes(path)}
                  component={NavLink}
                  to={path}
                  disabled={requireInitialData && !hasInitialData}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>

        <List sx={{ flexGrow: 1 }} dense>
          <ListItem>
            <Typography variant="caption" ml={2}>
              Data Analytics
            </Typography>
          </ListItem>
          {dataAnalyticsRoutes.map(
            ({ text, icon, path, requireInitialData }) => (
              <ListItem key={text}>
                <ListItemButton
                  sx={{ borderRadius: 2 }}
                  selected={location.pathname.includes(path)}
                  component={NavLink}
                  to={path}
                  disabled={requireInitialData && !hasInitialData}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>

        <List dense>
          {secondaryRoutes(isAdmin).map(
            ({ text, icon, path, requireInitialData, disabled }) => (
              <ListItem key={text}>
                <ListItemButton
                  sx={{ borderRadius: 2 }}
                  selected={location.pathname.includes(path)}
                  component={NavLink}
                  to={path}
                  disabled={(requireInitialData && !hasInitialData) || disabled}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>

        <Divider />

        <List dense>
          <ListItem>
            <ListItemButton
              sx={{ borderRadius: 2 }}
              selected={location.pathname.includes("/inventory/settings")}
              component={NavLink}
              to="/inventory/settings"
              disabled={isCubeLoading}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Sidenav>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 0,
          width: { lg: `calc(100% - ${SIDENAV_WIDTH}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {cube.isCubeLoading ? (
          <Box mt={4}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="h5" component={"span"} align="center">
              Cargando...
            </Typography>
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
}

export default function InventoryLayoutWrapper() {
  const navigate = useNavigate();
  const { isAdmin, customUser } = useAuth();

  const onCubeLoadError = useCallback(() => {
    if (isAdmin && !customUser?.uid)
      navigate(ROUTES.INVENTORY.ADMIN.IMPERSONATE, { replace: true });
    else navigate(ROUTES.INVENTORY.IMPORT, { replace: true });
  }, [customUser?.uid, isAdmin, navigate]);

  return (
    <PrivateRoute>
      <LocalThemeProvider>
        <CubeProvider onCubeLoadError={onCubeLoadError}>
          <InventoryLayout />
        </CubeProvider>
      </LocalThemeProvider>
    </PrivateRoute>
  );
}
