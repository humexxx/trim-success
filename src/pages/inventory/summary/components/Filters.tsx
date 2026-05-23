import { useCube } from "src/context/hooks";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface IFilterCriteria {
  category: string;
  expetedValue?: "positive" | "negative";
}

interface Props {
  filters: IFilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<IFilterCriteria>>;
}

const ALL_CATEGORIES = "__all__";

const Filters = ({ filters, setFilters }: Props) => {
  const cube = useCube();

  if (!cube.data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="filter-category">Categoria</Label>
        <Select
          value={filters.category || ALL_CATEGORIES}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              category: value === ALL_CATEGORIES ? "" : value,
            }))
          }
        >
          <SelectTrigger id="filter-category">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Todas</SelectItem>
            {cube.data?.cubeParameters.categories.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label>Profit</Label>
        <div
          role="group"
          aria-label="Expected value filter"
          className="inline-flex overflow-hidden rounded-md border"
        >
          <Button
            type="button"
            variant={filters?.expetedValue === "positive" ? "default" : "ghost"}
            className={cn(
              "rounded-none border-r",
              filters?.expetedValue === "positive" &&
                "bg-emerald-600 hover:bg-emerald-600/90"
            )}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                expetedValue:
                  prev.expetedValue === "positive" ? undefined : "positive",
              }))
            }
          >
            Con Profit
          </Button>
          <Button
            type="button"
            variant={filters?.expetedValue === "negative" ? "default" : "ghost"}
            className={cn(
              "rounded-none",
              filters?.expetedValue === "negative" && "bg-destructive hover:bg-destructive/90"
            )}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                expetedValue:
                  prev.expetedValue === "negative" ? undefined : "negative",
              }))
            }
          >
            Sin Profit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
