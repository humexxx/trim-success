import { useMemo } from "react";

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
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { VERSION } from "src/consts";
import { useAuth } from "src/context/hooks";
import { useCube } from "src/context/cube";

function getRoutes(isAdmin: boolean) {
  return [
    {
      admin: true,
      text: "Impersonar",
      hint: "Administrador",
      icon: <PeopleAltIcon />,
      path: "/client/impersonate",
    },
    {
      text: "Importar",
      icon: <DownloadIcon />,
      path: "/client/import",
      requireContextUid: true,
    },
    {
      text: "Panel",
      icon: <DashboardIcon />,
      path: "/client/dashboard",
      requireInitialData: true,
    },
    {
      text: "Generales",
      icon: <DescriptionOutlinedIcon />,
      path: "/client/general-data",
      requireInitialData: true,
    },
    {
      text: "Data Mining",
      icon: <Filter1OutlinedIcon />,
      path: "/client/data-mining",
      requireInitialData: true,
    },
    {
      text: "Scorecard",
      icon: <Filter2OutlinedIcon />,
      path: "/client/scorecard",
      requireInitialData: true,
    },
    {
      text: "Rendimiento de Inventario",
      icon: <Filter3OutlinedIcon />,
      path: "/client/inventory-performance",
      requireInitialData: true,
    },
  ].filter((route) => (route.admin ? isAdmin : true));
}

function getSecondaryRoutes(isAdmin: boolean) {
  return [
    {
      text: "IA",
      icon: <SmartToyIcon />,
      path: "/client/ai",
      requireInitialData: true,
    },
    {
      admin: true,
      text: "Testing",
      hint: "Administrador",
      icon: <SpeedIcon />,
      requireInitialData: true,
      path: "/client/testing",
    },
  ].filter((route) => (route.admin ? isAdmin : true));
}

const Drawer = () => {
  const { hasInitialData, isCubeLoading } = useCube();
  const { isAdmin, customUser } = useAuth();
  const location = useLocation();

  const routes = useMemo(() => getRoutes(isAdmin), [isAdmin]);
  const secondaryRoutes = useMemo(() => getSecondaryRoutes(isAdmin), [isAdmin]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Typography variant="caption">{VERSION}</Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {routes.map(
          ({
            text,
            hint,
            icon,
            path,
            requireInitialData,
            requireContextUid,
          }) => (
            <ListItem key={text}>
              <ListItemButton
                sx={{ borderRadius: 2 }}
                selected={location.pathname.includes(path)}
                component={NavLink}
                to={path}
                unstable_viewTransition
                disabled={
                  (requireInitialData && !hasInitialData) ||
                  (requireContextUid && isAdmin && !customUser?.uid)
                }
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} secondary={hint} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <List>
        {secondaryRoutes.map(
          ({ text, hint, icon, path, requireInitialData }) => (
            <ListItem key={text}>
              <ListItemButton
                sx={{ borderRadius: 2 }}
                selected={location.pathname.includes(path)}
                component={NavLink}
                to={path}
                unstable_viewTransition
                disabled={requireInitialData && !hasInitialData}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} secondary={hint} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton
            sx={{ borderRadius: 2 }}
            selected={location.pathname.includes("/client/settings")}
            component={NavLink}
            to="/client/settings"
            unstable_viewTransition
            disabled={isCubeLoading}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export const DRAWER_WIDTH = 240;

export default Drawer;
