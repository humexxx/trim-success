import {
  ArrowLeft,
  ChevronRight,
  Eye,
  LogOut,
  Menu,
  Moon,
  Repeat2,
  Sun,
  X,
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

      {/* Breadcrumb-style back-nav: Modulos / <current module>.
          The "Módulos" link is disabled for admins who haven't picked
          a user yet, since the module selector itself would just
          bounce them back to the impersonation picker. */}
      {moduleLabel && (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm">
          {isAdmin && !customUser?.uid ? (
            <span
              aria-disabled="true"
              title="Selecciona un usuario primero"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Módulos
            </span>
          ) : (
            <Link
              to={ROUTES.MODULE_SELECTOR}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Módulos
            </Link>
          )}
          <ChevronRight
            className="h-3.5 w-3.5 text-muted-foreground/60"
            aria-hidden="true"
          />
          <span className="px-2 py-1 font-medium">{moduleLabel}</span>
        </nav>
      )}

      <div className="flex flex-1 items-center justify-end text-sm text-muted-foreground sm:justify-start">
        {isAdmin && customUser ? (
          <div
            className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-50 pl-2 pr-1 py-0.5 text-xs text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200"
            role="status"
            aria-label={`Impersonando a ${customUser.name ?? customUser.email}`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="max-w-[160px] truncate font-medium">
              {customUser.name ?? customUser.email}
            </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.INVENTORY.ADMIN.IMPERSONATE)}
              className="rounded-full p-1 transition-colors hover:bg-amber-500/20 dark:hover:bg-amber-400/20"
              aria-label="Cambiar de usuario"
              title="Cambiar de usuario"
            >
              <Repeat2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCustomUser(null)}
              className="rounded-full p-1 transition-colors hover:bg-amber-500/20 dark:hover:bg-amber-400/20"
              aria-label="Salir de impersonación"
              title="Salir de impersonación"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
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
