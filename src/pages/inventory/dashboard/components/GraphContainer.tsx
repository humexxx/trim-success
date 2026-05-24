import { ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  children: ReactNode;
}

// Single spring used for both grid-cell resize and chart body crossfade
// — keeps the two coordinated. Stiffness/damping picked to feel snappy
// without overshoot on resize.
const SPRING = { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.6 };

const GraphContainer = ({
  title,
  description,
  badge,
  isExpanded,
  setIsExpanded,
  children,
}: Props) => {
  return (
    // `layout` makes Framer animate the grid cell as it shrinks/grows
    // between half-row and full-row — plus the row reorder that
    // happens when the parent sorts the expanded chart to the top.
    <motion.div
      layout
      transition={SPRING}
      className={cn("relative", isExpanded && "col-span-full")}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {badge}
            </div>
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="-mt-1 -mr-1 h-9 w-9"
            aria-label={isExpanded ? "Reducir gráfico" : "Expandir gráfico"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Icon crossfade + small rotation so the toggle reads as
                a single motion rather than an instant swap. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isExpanded ? "min" : "max"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="inline-flex"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </CardHeader>
        {/* Crossfade the body when expand state flips — the chart
            re-mounts at a different size, the fade hides the snap. */}
        <CardContent className="px-2 pb-4 pt-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isExpanded ? "expanded" : "compact"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GraphContainer;
