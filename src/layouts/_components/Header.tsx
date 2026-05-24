import {
  ArrowLeft,
  ChevronRight,
  Eye,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

/** Resolve the human-friendly label for the current module from the URL. */
function useModuleLabel(): string | null {
  const { pathname } = useLocation();
  if (pathname.startsWith("/inventory")) return "Inventario";
  if (pathname.startsWith("/sales")) return "Ventas";
  return null;
}

const Header = ({ handleDrawerToggle, hasDrawer = true }: Props) => {
  const themeContext = useLocalTheme();
  const navigate = useNavigate();
  const { isAdmin, customUser, setCustomUser } = useAuth();
  const moduleLabel = useModuleLabel();

  function handleLogout() {
    logout(() => {
      setCustomUser(null);
      navigate("/");
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

      {/* Breadcrumb-style back-nav: Modulos / <current module> */}
      {moduleLabel && (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm">
          <Link
            to={ROUTES.MODULE_SELECTOR}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Módulos
          </Link>
          <ChevronRight
            className="h-3.5 w-3.5 text-muted-foreground/60"
            aria-hidden="true"
          />
          <span className="px-2 py-1 font-medium">{moduleLabel}</span>
        </nav>
      )}

      <div className="flex flex-1 items-center text-sm text-muted-foreground">
        {isAdmin && customUser ? (
          <span className="ml-2 inline-flex items-center gap-1">
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
