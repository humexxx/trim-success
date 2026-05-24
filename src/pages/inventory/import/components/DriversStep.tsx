import { ReactNode, useEffect, useState } from "react";

import { DEFAULT_DRIVERS } from "@shared/consts";
import { ICubeData, ICubeParameters, IDriver } from "@shared/models";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCube } from "src/context/hooks";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

function not(a: readonly IDriver[], b: readonly IDriver[]) {
  return a.filter((value) => !b.includes(value));
}
function intersection(a: readonly IDriver[], b: readonly IDriver[]) {
  return a.filter((value) => b.includes(value));
}
function union(a: readonly IDriver[], b: readonly IDriver[]) {
  return [...a, ...not(b, a)];
}

export default function DriversStep() {
  const cube = useCube();

  const [checked, setChecked] = useState<readonly IDriver[]>([]);
  const [left, setLeft] = useState<readonly IDriver[]>([]);
  const right = cube.data?.cubeParameters?.drivers || [];
  const setRight = (value: readonly IDriver[]) =>
    cube.setData({
      cubeParameters: { drivers: value } as ICubeParameters,
    } as ICubeData);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: IDriver) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);
    setChecked(newChecked);
  };

  const driverOfChecked = (items: readonly IDriver[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly IDriver[]) => () => {
    if (driverOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  useEffect(() => {
    cube.setData({
      cubeParameters: {
        drivers: DEFAULT_DRIVERS.filter(
          (x) => x.key !== "PLANNERS" && x.key !== "ORDERS"
        ),
      } as ICubeParameters,
    } as ICubeData);
    setLeft(
      DEFAULT_DRIVERS.filter((x) => x.key === "PLANNERS" || x.key === "ORDERS")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customList = (title: ReactNode, items: readonly IDriver[]) => {
    const allChecked =
      driverOfChecked(items) === items.length && items.length !== 0;
    const someChecked =
      driverOfChecked(items) !== items.length && driverOfChecked(items) !== 0;

    return (
      <Card className="w-[250px]">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 px-3 py-2">
          <Checkbox
            checked={allChecked || (someChecked ? "indeterminate" : false)}
            onCheckedChange={handleToggleAll(items)}
            disabled={items.length === 0}
            aria-label="Seleccionar todos"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">
              {driverOfChecked(items)}/{items.length} seleccionados
            </span>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="h-[450px] overflow-auto p-0">
          <ul role="list">
            {items.map((value) => {
              const labelId = `transfer-list-${value.key}-label`;
              const isDisabled = value.required;
              const isChecked = checked.includes(value);
              return (
                <li key={value.key}>
                  <button
                    type="button"
                    onClick={!isDisabled ? handleToggle(value) : undefined}
                    disabled={isDisabled}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50"
                  >
                    <Checkbox
                      checked={isChecked}
                      tabIndex={-1}
                      aria-labelledby={labelId}
                      onCheckedChange={() => undefined}
                    />
                    <span id={labelId}>{value.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {customList("Opciones", left)}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="Mover seleccionados a la derecha"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="Mover seleccionados a la izquierda"
        >
          <ChevronLeft />
        </Button>
      </div>
      {customList("Drivers Incluidos", right)}
    </div>
  );
}
