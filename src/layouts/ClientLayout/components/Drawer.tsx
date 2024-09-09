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
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { useCube } from "src/context/cube";
import { useAuth } from "src/context/auth";
import { useMemo } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";

function getRoutes(isAdmin: boolean, hasCube: boolean) {
  return [
    {
      text: "Importar",
      caption: isAdmin ? "Administrador" : "",
      icon: isAdmin ? <SystemUpdateAltIcon /> : <DownloadIcon />,
      path: isAdmin ? "/client/import-admin" : "/client/import",
      isCubeLoader: true,
    },
    {
      text: "Panel",
      icon: <DashboardIcon />,
      path: "/client/dashboard",
    },
    {
      text: "Generales",
      icon: <DescriptionOutlinedIcon />,
      path: "/client/general-data",
    },
    {
      text: "CAT",
      icon: <Filter1OutlinedIcon />,
      path: "/client/cat",
    },
    {
      text: "Scorecard",
      icon: <Filter2OutlinedIcon />,
      path: "/client/scorecard",
    },
    {
      text: "IA",
      icon: <SmartToyIcon />,
      path: "/client/ai",
    },
  ].filter(({ isCubeLoader }) => isAdmin || !(isCubeLoader && hasCube));
}

const Drawer = () => {
  const { fileResolution, loading } = useCube();
  const user = useAuth();
  const location = useLocation();

  const routes = useMemo(
    () =>
      getRoutes(Boolean(user.currentUser!.isAdmin), Boolean(fileResolution)),
    [fileResolution, user.currentUser]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {routes.map(({ text, caption, icon, path, isCubeLoader }) => (
          <ListItem key={text}>
            <ListItemButton
              sx={{ borderRadius: 2 }}
              selected={location.pathname.includes(path)}
              component={NavLink}
              to={path}
              unstable_viewTransition
              disabled={(!isCubeLoader && !fileResolution) || loading}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} secondary={caption} />
            </ListItemButton>
          </ListItem>
        ))}
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
            disabled={loading}
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
