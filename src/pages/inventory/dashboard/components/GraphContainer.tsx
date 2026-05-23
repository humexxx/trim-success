import { ReactNode } from "react";

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

const GraphContainer = ({
  title,
  description,
  badge,
  isExpanded,
  setIsExpanded,
  children,
}: Props) => {
  return (
    <div className={cn("relative", isExpanded && "col-span-full")}>
      <Card className="overflow-hidden transition-all">
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
            className="-mt-1 -mr-1 h-7 w-7"
            aria-label={isExpanded ? "Reducir gráfico" : "Expandir gráfico"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </CardHeader>
        <CardContent className="px-2 pb-4 pt-0">{children}</CardContent>
      </Card>
    </div>
  );
};

export default GraphContainer;
