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
import { useCube } from "src/context/cube";

const routes = [
  {
    text: "Importar",
    icon: <DownloadIcon />,
    path: "/client/import",
    isFirstStep: true,
  },
  {
    text: "Panel",
    icon: <DashboardIcon />,
    path: "/client/dashboard",
  },
];

const Drawer = () => {
  const { fileResolution, loading } = useCube();
  const location = useLocation();

  return (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {routes
          .filter(
            ({ isFirstStep }) => !(isFirstStep && Boolean(fileResolution))
          )
          .map(({ text, icon, path, isFirstStep }) => (
            <ListItem key={text}>
              <ListItemButton
                sx={{ borderRadius: 2 }}
                selected={location.pathname.includes(path)}
                component={NavLink}
                to={path}
                unstable_viewTransition
                disabled={(!isFirstStep && !fileResolution) || loading}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export const DRAWER_WIDTH = 240;

export default Drawer;
