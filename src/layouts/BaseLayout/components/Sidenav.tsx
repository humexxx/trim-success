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
import { useAuth } from "src/context/hooks";
import { useCube } from "src/context/hooks";

const dataImportRoutes = (isAdmin: boolean) =>
  [
    {
      admin: true,
      text: "Impersonar",
      icon: <PeopleAltIcon fontSize="small" />,
      path: "/client/impersonate",
    },
    {
      text: "Importar",
      icon: <DownloadIcon fontSize="small" />,
      path: "/client/import",
      requireContextUid: true,
    },
  ].filter((route) => (route.admin ? isAdmin : true));

const dataVisualizationsRoutes = [
  {
    text: "Panel",
    icon: <DashboardIcon fontSize="small" />,
    path: "/client/dashboard",
    requireInitialData: true,
  },
  {
    text: "Generales",
    icon: <DescriptionOutlinedIcon fontSize="small" />,
    path: "/client/general-data",
    requireInitialData: true,
  },
];

const dataAnalyticsRoutes = [
  {
    text: "Data Mining",
    icon: <Filter1OutlinedIcon fontSize="small" />,
    path: "/client/data-mining",
    requireInitialData: true,
  },
  {
    text: "Scorecard",
    icon: <Filter2OutlinedIcon fontSize="small" />,
    path: "/client/scorecard",
    requireInitialData: true,
  },
  {
    text: "Inventario",
    icon: <Filter3OutlinedIcon fontSize="small" />,
    path: "/client/inventory-performance",
    requireInitialData: true,
  },
];

const secondaryRoutes = (isAdmin: boolean) => {
  return [
    {
      text: "IA",
      icon: <SmartToyIcon fontSize="small" />,
      path: "/client/ai",
      requireInitialData: true,
    },
    {
      admin: true,
      text: "Testing",
      icon: <SpeedIcon fontSize="small" />,
      requireInitialData: true,
      path: "/client/testing",
    },
  ].filter((route) => (route.admin ? isAdmin : true));
};

const Sidenav = ({ title, version }: { title: string; version: string }) => {
  const { hasInitialData, isCubeLoading } = useCube();
  const { isAdmin, customUser } = useAuth();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ position: "relative" }}>
          {title}{" "}
          <Typography
            mb={2}
            variant="caption"
            sx={{ position: "absolute", top: 2, ml: 1 }}
          >
            ({version})
          </Typography>
        </Typography>
      </Toolbar>
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
        {dataAnalyticsRoutes.map(({ text, icon, path, requireInitialData }) => (
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
        ))}
      </List>

      <List dense>
        {secondaryRoutes(isAdmin).map(
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

      <Divider />
      <List dense>
        <ListItem>
          <ListItemButton
            sx={{ borderRadius: 2 }}
            selected={location.pathname.includes("/client/settings")}
            component={NavLink}
            to="/client/settings"
            disabled={isCubeLoading}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export const SIDENAV_WIDTH = 240;

export default Sidenav;
