import { useDeferredValue, useMemo, useState } from "react";

import { IUser } from "@shared/models";
import { Check, Eye, Loader2, Search, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { useUsers } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function fmtDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function matches(user: IUser, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    user.name?.toLowerCase().includes(q) ||
    user.email?.toLowerCase().includes(q) ||
    user.description?.toLowerCase().includes(q) ||
    user.uid.toLowerCase().includes(q)
  );
}

/**
 * Card-based impersonation picker. Replaces the previous
 * select-then-click flow: one click on a card commits the
 * impersonation (via `setCustomUser`, which now persists in
 * AuthContext) and navigates to the dashboard.
 */
const AdminClientSelector = () => {
  const { users, loading } = useUsers();
  const { setCustomUser, customUser, currentUser } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  // Defer the query so typing doesn't re-filter on every keystroke
  // when the user list is large.
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () =>
      [...users]
        // Hide the admin's own account: impersonating yourself is a
        // no-op and only clutters the list.
        .filter((u) => u.email !== currentUser?.email)
        .sort((a, b) =>
          (a.name ?? a.email ?? "").localeCompare(b.name ?? b.email ?? "")
        )
        .filter((u) => matches(u, deferredQuery)),
    [users, currentUser?.email, deferredQuery]
  );

  function impersonate(user: IUser) {
    setCustomUser(user);
    navigate(ROUTES.INVENTORY.DASHBOARD);
  }

  function stopImpersonating() {
    setCustomUser(null);
  }

  return (
    <div className="space-y-4">
      {customUser ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground">
            <Eye className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-medium">
              Viendo como {customUser.name ?? customUser.email}
            </div>
            {customUser.email && customUser.name && (
              <div className="truncate text-xs text-muted-foreground">
                {customUser.email}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={stopImpersonating}
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Salir
          </Button>
        </div>
      ) : null}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nombre, email o descripción"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Buscar usuario"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          <Search className="h-5 w-5" />
          <span>
            {query
              ? "Ningún usuario coincide con la búsqueda."
              : "No hay usuarios disponibles."}
          </span>
        </div>
      ) : (
        <ul
          aria-label="Usuarios disponibles"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((user) => {
            const active = customUser?.uid === user.uid;
            const created = fmtDate(user.createdAt);
            return (
              <li key={user.uid} className="flex">
                <button
                  type="button"
                  onClick={() => impersonate(user)}
                  className={cn(
                    // h-full + items stretched gives every card the same
                    // height regardless of description length; the date
                    // pin uses mt-auto so it always sits at the bottom.
                    "group flex h-full w-full flex-col gap-2 rounded-lg border bg-card p-4 text-left transition",
                    "hover:border-foreground/40 hover:shadow-sm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    active && "border-foreground/60 ring-1 ring-foreground/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserRound className="h-4 w-4" />
                    </span>
                    {active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground">
                        <Check className="h-3 w-3" />
                        Activo
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="truncate text-sm font-semibold">
                      {user.name ?? user.email}
                    </div>
                    {user.email && user.name && (
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-2 min-h-[2.5rem] text-xs text-muted-foreground">
                    {user.description ?? "Sin descripción."}
                  </p>
                  <div className="mt-auto text-[11px] text-muted-foreground">
                    {created ? `Creado ${created}` : " "}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Cargando usuarios...
        </div>
      )}
    </div>
  );
};

export default AdminClientSelector;
