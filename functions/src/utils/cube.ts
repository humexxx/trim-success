import { COLUMNS } from "../consts";
import { EColumnType } from "../consts/enums";
import { IBaseData, IDriver, IParamsData } from "../models";
import { IScorecardData } from "../models/scorecardData";

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
        ...drivers.reduce((acc, driver) => {
          acc[driver.key] = 0;
          return acc;
        }, {} as any),
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
      const driver = paramsData.drivers[0]; // try to infer with ai
      const _row = {
        cost: cost.label,
        total: cost.value,
        driver: driver.key,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            cost.value *
            Number(
              baseData.driversData.rows.find(
                (row) => row.driver === driver.label
              )![category]
            );
          return acc;
        }, {} as any),
      };
      return _row;
    }),
    ...paramsData.storingParams.investments.map((investment) => {
      const driver = paramsData.drivers[0];
      const investmentsTypes = paramsData.generalParams.financial.slice(2);
      const investType = investmentsTypes[0]; // try to infer with ai
      const _row = {
        invest: investType.key,
        cost: investment.label,
        total: investment.value * (investType.value / 100),
        driver: driver.key,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            investment.value *
            (investType.value / 100) *
            Number(
              baseData.driversData.rows.find(
                (row) => row.driver === driver.label
              )![category]
            );
          return acc;
        }, {} as any),
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
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            cost.value *
            Number(
              baseData.driversData.rows.find(
                (row) => row.driver === driver.label
              )![category]
            );
          return acc;
        }, {} as any),
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
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            investment.value *
            (investType.value / 100) *
            Number(
              baseData.driversData.rows.find(
                (row) => row.driver === driver.label
              )![category]
            );
          return acc;
        }, {} as any),
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
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] = storingCosts.reduce(
            (acc, row) => acc + Number(row[category]),
            0
          );
          return acc;
        }, {} as any),
      },
    },
    inventoryCosts: {
      rows: inventoryCosts,
      totals: {
        total: inventoryCosts.reduce((acc, row) => acc + Number(row.total), 0),
        totalPercentage: 1,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] = inventoryCosts.reduce(
            (acc, row) => acc + Number(row[category]),
            0
          );
          return acc;
        }, {} as any),
      },
    },
  };
}
