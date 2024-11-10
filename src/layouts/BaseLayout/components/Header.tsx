import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { useLocalTheme } from "src/context/hooks";
import { EThemeType } from "src/enums";
import { logout } from "src/utils";

import { SIDENAV_WIDTH } from "./Sidenav";

interface Props {
  handleDrawerToggle: () => void;
}

const Header = ({ handleDrawerToggle }: Props) => {
  const theme = useTheme();
  const themeContext = useLocalTheme();
  const navigate = useNavigate();

  const { isAdmin, customUser, setCustomUser } = useAuth();

  function handleLogout() {
    logout(() => {
      setCustomUser(null);
      navigate("/login");
    });
  }

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        width: { lg: `calc(100% - ${SIDENAV_WIDTH}px)` },
        ml: { lg: `${SIDENAV_WIDTH}px` },
        display: "flex",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderBottomColor: "divider",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { lg: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="body2"
          component="div"
          flexGrow="1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {isAdmin && customUser ? (
            <>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              (as {customUser.name})
            </>
          ) : null}
        </Typography>
        <IconButton
          sx={{ ml: 2 }}
          onClick={themeContext.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === EThemeType.DARK ? (
            <Brightness4Icon />
          ) : (
            <Brightness7Icon />
          )}
        </IconButton>
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
