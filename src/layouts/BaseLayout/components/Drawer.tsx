import { NavLink, useLocation } from "react-router-dom";
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DownloadIcon from "@mui/icons-material/Download";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { useCube } from "src/context/cube";
import { useAuth } from "src/context/auth";
import { useMemo } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";

function getRoutes(isAdmin: boolean) {
  return [
    {
      admin: true,
      text: "Impersonar",
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
      text: "IA",
      icon: <SmartToyIcon />,
      path: "/client/ai",
      requireInitialData: true,
    },
  ].filter((route) => (route.admin ? isAdmin : true));
}

const Drawer = () => {
  const { hasInitialData, isCubeLoading } = useCube();
  const { isAdmin, currentUser, customUser } = useAuth();
  const location = useLocation();

  const routes = useMemo(() => getRoutes(isAdmin), [isAdmin]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {routes.map(
          ({ text, icon, path, requireInitialData, requireContextUid }) => (
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
                <ListItemText primary={text} />
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