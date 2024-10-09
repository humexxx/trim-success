import { COLUMNS } from "@shared/consts";
import { EColumnType, EDriverType } from "@shared/enums";
import {
  IDriver,
  IBaseData,
  IParamsData,
  IScorecardData,
  IInventoryPerformanceData,
} from "@shared/models";

function getColumnIndex(column: EColumnType): number | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.index;
}

function getRowValue(
  row: any[],
  index: number | number[]
): string | number | string[] | number[] {
  const values = Object.values(row);
  if (Array.isArray(index)) {
    return index.map((i) => values[i + 1]);
  }
  return values[index + 1];
}

export function calculateCategoriesDataRows(
  rows: any[],
  drivers: IDriver[]
): IBaseData["categoriesData"]["rows"] {
  if (!rows || rows.length === 0) {
    throw new Error("No rows provided");
  }

  const category = { index: getColumnIndex(EColumnType.CATEGORY)! };
  const response: any = {};

  for (let i = 0; i < rows.length; i++) {
    const categoryValue = getRowValue(rows[i], category.index) as string;
    if (!response[categoryValue]) {
      response[categoryValue] = {
        category: categoryValue,
        ...drivers.reduce(
          (acc, driver) => {
            acc[driver.key] = 0;
            return acc;
          },
          {} as Record<string, number>
        ),
      };
    }

    for (let j = 0; j < drivers.length; j++) {
      if (drivers[j].key === "SKUS") {
        response[categoryValue][drivers[j].key]++;
      } else {
        response[categoryValue][drivers[j].key] += getRowValue(
          rows[i],
          drivers[j].columnIndexReference
        );
      }
    }
  }

  return Object.values(response);
}

export function calculateCategoriesTotalsData(
  categoriesDataRows: IBaseData["categoriesData"]["rows"],
  drivers: IDriver[]
): IBaseData["categoriesData"]["totals"] {
  return {
    category: "Total",
    ...drivers
      .filter((x) => -1 !== x.columnIndexReference)
      .reduce(
        (acc, driver) => {
          acc[driver.key] = categoriesDataRows.reduce(
            (acc, row) => acc + (row[driver.key] as number),
            0
          );
          return acc;
        },
        {} as Omit<IBaseData["categoriesData"]["totals"], "category">
      ),
  } as IBaseData["categoriesData"]["totals"];
}

export function calculateDriversDataRows(
  categoriesDataRows: IBaseData["categoriesData"]["rows"],
  totals: IBaseData["categoriesData"]["totals"],
  drivers: IDriver[]
): IBaseData["driversData"]["rows"] {
  return drivers.map((driver) => {
    const _row = {
      driver: driver.label,
    } as IBaseData["driversData"]["rows"][number];

    categoriesDataRows.forEach((row) => {
      _row[row.category] = Number(totals[driver.key])
        ? Number(row[driver.key]) / Number(totals[driver.key])
        : 0;
    });

    return _row;
  });
}

export function calculateScorecardData(
  paramsData: IParamsData,
  baseData: IBaseData
): IScorecardData {
  const storingCosts: IScorecardData["storingCosts"]["rows"] = [
    ...paramsData.storingParams.costs.map((cost) => {
      const driver = paramsData.drivers[0];
      const _row = {
        cost: cost.label,
        total: cost.value,
        driver: driver.key,
        totalPercentage: 0,
        invest: "",
        ...paramsData.categories.reduce(
          (acc, category) => {
            acc[category] =
              cost.value *
              Number(
                baseData.driversData.rows.find(
                  (row) => row.driver === driver.label
                )![category]
              );
            return acc;
          },
          {} as Record<string, number>
        ),
      };
      return _row;
    }),
    ...paramsData.storingParams.investments.map((investment) => {
      const driver = paramsData.drivers[0];
      const investmentsTypes = paramsData.generalParams.financial.slice(2);
      const investType = investmentsTypes[0];
      const _row = {
        invest: investType.key,
        cost: investment.label,
        total: investment.value * (investType.value / 100),
        driver: driver.key,
        totalPercentage: 0,
        ...paramsData.categories.reduce(
          (acc, category) => {
            acc[category] =
              investment.value *
              (investType.value / 100) *
              Number(
                baseData.driversData.rows.find(
                  (row) => row.driver === driver.label
                )![category]
              );
            return acc;
          },
          {} as Record<string, number>
        ),
      };
      return _row;
    }),
  ];

  const inventoryCosts: IScorecardData["inventoryCosts"]["rows"] = [
    ...paramsData.inventoryParams.costs.map((cost) => {
      const driver = paramsData.drivers[0];
      const _row = {
        cost: cost.label,
        total: cost.value,
        driver: driver.key,
        invest: "",
        totalPercentage: 0,
        ...paramsData.categories.reduce(
          (acc, category) => {
            acc[category] =
              cost.value *
              Number(
                baseData.driversData.rows.find(
                  (row) => row.driver === driver.label
                )![category]
              );
            return acc;
          },
          {} as Record<string, number>
        ),
      };
      return _row;
    }),
    ...paramsData.inventoryParams.investments.map((investment) => {
      const driver = paramsData.drivers[0];
      const investmentsTypes = paramsData.generalParams.financial.slice(2);
      const investType = investmentsTypes[0];
      const _row = {
        invest: investType.key,
        cost: investment.label,
        total: investment.value * (investType.value / 100),
        driver: driver.key,
        totalPercentage: 0,
        ...paramsData.categories.reduce(
          (acc, category) => {
            acc[category] =
              investment.value *
              (investType.value / 100) *
              Number(
                baseData.driversData.rows.find(
                  (row) => row.driver === driver.label
                )![category]
              );
            return acc;
          },
          {} as Record<string, number>
        ),
      };
      return _row;
    }),
  ];

  const totalStoringCost = storingCosts.reduce((acc, row) => {
    return acc + Number(row.total);
  }, 0);
  storingCosts.forEach((row) => {
    row.totalPercentage = totalStoringCost
      ? Number(row.total) / totalStoringCost
      : 0;
  });

  const totalInventoryCost = inventoryCosts.reduce((acc, row) => {
    return acc + Number(row.total);
  }, 0);
  inventoryCosts.forEach((row) => {
    row.totalPercentage = totalInventoryCost
      ? Number(row.total) / totalInventoryCost
      : 0;
  });

  return {
    storingCosts: {
      rows: storingCosts,
      totals: {
        total: storingCosts.reduce((acc, row) => acc + Number(row.total), 0),
        totalPercentage: 1,
        ...paramsData.categories.reduce(
          (acc, category) => {
            acc[category] = storingCosts.reduce(
              (acc, row) => acc + Number(row[category]),
              0
            );
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    },
    inventoryCosts: {
      rows: inventoryCosts,
      totals: {
        total: inventoryCosts.reduce((acc, row) => acc + Number(row.total), 0),
        totalPercentage: 1,
        ...paramsData.categories.reduce(
          (acc, category) => {
            acc[category] = inventoryCosts.reduce(
              (acc, row) => acc + Number(row[category]),
              0
            );
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    },
  };
}

export function calculateInventoryPerformance(
  categories: string[],
  baseData: IBaseData,
  scorecard: IScorecardData
): IInventoryPerformanceData {
  const DEFAULT_VALUES: { label: string; description: string }[] = [
    {
      label: "Tasa de Mantener el Inventario (ICR)",
      description: "ICC / Inv Promedio",
    },
  ];

  const response: IInventoryPerformanceData = {
    rows: DEFAULT_VALUES.map((value) => {
      return {
        label: value.label,
        description: value.description,
        ...categories.reduce(
          (acc, category) => {
            acc[category] =
              (Number(scorecard.inventoryCosts.totals[category]) +
                Number(scorecard.storingCosts.totals[category])) /
              Number(
                baseData.categoriesData.rows.find(
                  (row) => row.category === category
                )![EDriverType.INVENTORY_VALUE]
              );
            return acc;
          },
          {} as Record<string, number>
        ),
        total:
          (Number(scorecard.inventoryCosts.totals.total) +
            Number(scorecard.storingCosts.totals.total)) /
          Number(baseData.categoriesData.totals[EDriverType.INVENTORY_VALUE]),
      };
    }),
  };

  return response;
}
