import { Eye, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { cn } from "@/lib/utils";

/**
 * Persistent strip that surfaces an active impersonation across every
 * authenticated route. Renders nothing for non-admins or when the
 * admin isn't currently impersonating. Hides itself on the impersonate
 * picker — that page already owns the action.
 */
export function ImpersonationBanner() {
  const { isAdmin, customUser, setCustomUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!isAdmin || !customUser) return null;
  if (pathname === ROUTES.INVENTORY.ADMIN.IMPERSONATE) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "-mx-4 mb-4 flex items-center gap-3 border-y bg-muted/60 px-4 py-2.5 sm:-mx-6 sm:px-6",
        "text-xs sm:text-sm"
      )}
    >
      <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 truncate">
        Estás viendo el cubo de{" "}
        <span className="font-medium text-foreground">
          {customUser.name ?? customUser.email}
        </span>
        . Las acciones aplican sobre su cuenta.
      </div>
      <button
        type="button"
        onClick={() => navigate(ROUTES.INVENTORY.ADMIN.IMPERSONATE)}
        className="hidden rounded-md border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent sm:inline-flex"
      >
        Cambiar
      </button>
      <button
        type="button"
        onClick={() => setCustomUser(null)}
        className="inline-flex items-center gap-1 rounded-md border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
      >
        <X className="h-3 w-3" />
        Salir
      </button>
    </div>
  );
}
