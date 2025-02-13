import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { useLocalTheme } from "src/context/hooks";
import { EThemeType } from "src/enums";
import { ROUTES } from "src/lib/consts";
import { logout } from "src/utils";

import { SIDENAV_WIDTH } from "./Sidenav";

interface Props {
  handleDrawerToggle?: () => void;
  hasDrawer?: boolean;
}

const Header = ({ handleDrawerToggle, hasDrawer = true }: Props) => {
  const themeContext = useLocalTheme();
  const navigate = useNavigate();

  const { isAdmin, customUser, setCustomUser } = useAuth();

  function handleLogout() {
    logout(() => {
      setCustomUser(null);
      navigate(ROUTES.SIGN_IN);
    });
  }

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        width: { lg: `calc(100% - ${hasDrawer ? SIDENAV_WIDTH : 0}px)` },
        ml: { lg: `${hasDrawer ? SIDENAV_WIDTH : 0}px` },
        display: "flex",
        justifyContent: "space-between",
        bgcolor:
          themeContext.theme === EThemeType.LIGHT ? "#fafafa" : "grey.900",

        // bgcolor: "hsla(0, 0%, 100%, 0.6)",
        // backdropFilter: "blur(50px)",
      }}
    >
      <Toolbar>
        {hasDrawer && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        )}
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
          {themeContext.theme === EThemeType.DARK ? (
            <Brightness4Icon sx={{ color: "white" }} />
          ) : (
            <Brightness7Icon />
          )}
        </IconButton>
        <IconButton
          edge="end"
          onClick={handleLogout}
          sx={{
            ml: 2,
            color: themeContext.theme === EThemeType.DARK ? "white" : "black",
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
