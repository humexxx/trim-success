import { ReactNode } from "react";

import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

interface SidenavLinkProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Sidebar nav row: tightly-spaced, active state driven by NavLink,
 * disabled state still rendered visually (matches former MUI behavior).
 */
export function SidenavLink({
  to,
  icon,
  children,
  disabled,
}: SidenavLinkProps) {
  if (disabled) {
    return (
      <div
        aria-disabled="true"
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-50"
      >
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
        {children}
      </div>
    );
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent font-medium text-accent-foreground"
        )
      }
    >
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      {children}
    </NavLink>
  );
}

interface SidenavSectionProps {
  label?: string;
  children: ReactNode;
}

export function SidenavSection({ label, children }: SidenavSectionProps) {
  return (
    <div className="px-3 py-1.5">
      {label && (
        <div className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
