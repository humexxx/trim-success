import { PropsWithChildren } from "react";

import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export const SIDENAV_WIDTH = 240;

interface SidenavContentProps {
  title: string;
  version: string;
}

const SidenavBody = ({
  title,
  version,
  children,
}: PropsWithChildren<SidenavContentProps>) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center px-6">
      <div className="relative font-semibold tracking-tight">
        {title}
        <span className="absolute -top-0.5 left-full ml-2 text-[10px] font-normal text-muted-foreground">
          ({version})
        </span>
      </div>
    </div>
    <Separator />
    <div className="flex flex-1 flex-col overflow-y-auto py-2">{children}</div>
  </div>
);

interface Props {
  title: string;
  version: string;
  setIsMobileOpen: (open: boolean) => void;
  isMobileOpen: boolean;
  setIsClosing: (closing: boolean) => void;
}

function Sidenav({
  title,
  version,
  isMobileOpen,
  setIsMobileOpen,
  setIsClosing,
  children,
}: PropsWithChildren<Props>) {
  return (
    <nav
      aria-label="Navegación principal"
      className="lg:w-[240px] lg:flex-shrink-0"
      style={{ ["--sidenav-width" as string]: `${SIDENAV_WIDTH}px` }}
    >
      {/* Mobile drawer */}
      <Sheet
        open={isMobileOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsClosing(true);
            setIsMobileOpen(false);
            // mirror the previous behavior of clearing the closing flag
            // once the transition would have ended
            setTimeout(() => setIsClosing(false), 300);
          } else {
            setIsMobileOpen(true);
          }
        }}
      >
        <SheetContent side="left" className="w-[240px] p-0">
          <SheetTitle className="sr-only">{title}</SheetTitle>
          <SidenavBody title={title} version={version}>
            {children}
          </SidenavBody>
        </SheetContent>
      </Sheet>

      {/* Desktop permanent sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-[240px] border-r bg-background lg:block"
        aria-label="Navegación lateral"
      >
        <SidenavBody title="Trim Success" version={version}>
          {children}
        </SidenavBody>
      </aside>
    </nav>
  );
}

export default Sidenav;
