import { ReactNode } from "react";

import { Maximize2, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  children: ReactNode;
}

const GraphContainer = ({ isExpanded, setIsExpanded, children }: Props) => {
  return (
    <div
      className={cn(
        "relative",
        // Mirrors the previous responsive grid: 1 col on xs, 2 cols on md
        // (or 1 col when expanded), 3 cols on xl (or 1 col when expanded).
        isExpanded
          ? "col-span-full mb-4"
          : "col-span-full md:col-span-6 xl:col-span-4"
      )}
    >
      <Card className="shadow-md">
        <CardContent className="p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10"
            aria-label={isExpanded ? "Reducir gráfico" : "Expandir gráfico"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export default GraphContainer;
