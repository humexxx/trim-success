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
import { useCube } from "src/context/cube";
import { useAuth } from "src/context/auth";
import { useMemo } from "react";

function getRoutes(isAdmin: boolean, hasCube: boolean) {
  return [
    {
      text: "Importar",
      caption: isAdmin ? "Administrador" : "",
      icon: isAdmin ? <SystemUpdateAltIcon /> : <DownloadIcon />,
      path: "/client/import",
      isCubeLoader: true,
    },
    {
      text: "Panel",
      icon: <DashboardIcon />,
      path: "/client/dashboard",
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
    <Box>
      <Toolbar />
      <Divider />
      <List>
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
    </Box>
  );
};

export const DRAWER_WIDTH = 240;

export default Drawer;
