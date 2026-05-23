import { Eye, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useLocalTheme } from "src/context/hooks";
import { EThemeType } from "src/enums";
import { ROUTES } from "src/lib/consts";
import { logout } from "src/utils";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <header
      className={cn(
        "fixed top-0 right-0 z-20 flex h-16 items-center gap-2 border-b bg-background/60 px-4 backdrop-blur",
        hasDrawer ? "left-0 lg:left-[240px]" : "left-0"
      )}
    >
      {hasDrawer && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menú"
          onClick={handleDrawerToggle}
          className="lg:hidden"
        >
          <Menu />
        </Button>
      )}

      <div className="flex flex-1 items-center text-sm text-muted-foreground">
        {isAdmin && customUser ? (
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            (as {customUser.name})
          </span>
        ) : null}
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Cambiar tema"
        onClick={themeContext.toggleColorMode}
      >
        {themeContext.theme === EThemeType.DARK ? <Moon /> : <Sun />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cerrar sesión"
        onClick={handleLogout}
      >
        <LogOut />
      </Button>
    </header>
  );
};

export default Header;
