import { DEFAULT_INVETORY_PERFORMANCE_METRICS } from "@shared/consts";
import { EColumnType, EDriverType } from "@shared/enums";
import { EAutoCompleteParamameterType } from "@shared/enums/EAutoCompleteParamameterType";
import {
  IDriver,
  IBaseData,
  IParamsData,
  IScorecardData,
  IInventoryPerformanceData,
  IDataModel,
  IInitialCubeData,
} from "@shared/models";
import { getColumn, getColumnIndex, getRowValue } from "@shared/utils";

export function calculateInitialData(
  rows: IDataModel["rows"]
): IInitialCubeData {
  const categoriesSet = new Set();
  let sumSales = 0;
  let sumCostSales = 0;
  let sumCostInventory = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const category = getRowValue(
      row,
      getColumn(EColumnType.CATEGORY).index!
    ) as string;
    categoriesSet.add(category);

    sumSales += getRowValue(row, getColumn(EColumnType.SALES).index!) as number;
    sumCostSales += getRowValue(
      row,
      getColumn(EColumnType.COST_SALES).index!
    ) as number;
    sumCostInventory += getRowValue(
      row,
      getColumn(EColumnType.INVENTORY_VALUE).index!
    ) as number;
  }

  return {
    categories: Array.from(categoriesSet) as string[],
    sumSales,
    sumCostSales,
    sumCostInventory,
  };
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
  const response: IInventoryPerformanceData = {
    rows: DEFAULT_INVETORY_PERFORMANCE_METRICS.map((value) => {
      return {
        ...value,
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

export function getCubeParametersWithAutoGeneratedValues(
  cubeParameters: IParamsData,
  initialData: IInitialCubeData
): IParamsData {
  const _cubeParameters = structuredClone(cubeParameters);
  _cubeParameters.generalParams.financial.map((financial, i) => {
    if (financial.key === EAutoCompleteParamameterType.SALES) {
      _cubeParameters.generalParams.financial[i].value = initialData.sumSales;
    }
    if (financial.key === EAutoCompleteParamameterType.SALES_COST) {
      _cubeParameters.generalParams.financial[i].value =
        initialData.sumCostSales;
    }
  });
  _cubeParameters.inventoryParams.investments.map((investment, i) => {
    if (investment.key === EAutoCompleteParamameterType.INVENTORY_INVESTMENT) {
      _cubeParameters.inventoryParams.investments[i].value =
        initialData.sumCostInventory;
    }
  });

  _cubeParameters.categories = initialData.categories;

  return _cubeParameters;
}
