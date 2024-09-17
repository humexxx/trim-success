import { COLUMNS, DRIVERS } from "../consts";
import { EColumnType, EDriverType } from "../consts/enums";
import { IBaseData, IParamsData } from "../models";
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

export function calculateCategoriesDataRows(rows: any[]): any[] {
  if (!rows || rows.length === 0) {
    throw new Error("No rows provided");
  }

  const category = { index: getColumnIndex(EColumnType.CATEGORY)! };
  const sku = { label: "Sku's" };
  const sumOfInvAvgQty = {
    index: getColumnIndex(EColumnType.AVERAGE_INVENTORY)!,
    label: "Sum of Inventario Prom. Bultos",
  };
  const sumOfInvAvgValue = {
    index: getColumnIndex(EColumnType.INVENTORY_VALUE)!,
    label: "Sum of Inventario Promedio $",
  };
  const sumOfQtySent = {
    index: getColumnIndex(EColumnType.SHIPPED_CASES)!,
    label: "Sum of Bultos Despachados",
  };
  const sumOfCubageInvAvg = {
    index: getColumnIndex(EColumnType.INVENTORY_CUBE)!,
    label: "Sum of Cubicaje Inv Promedio",
  };
  const sumOfTotalSales = {
    index: getColumnIndex(EColumnType.SALES)!,
    label: "Sum of Ventas Totales",
  };
  const sumOfGrossMargin = {
    index: getColumnIndex(EColumnType.GROSS_MARGIN)!,
    label: "sumOfGrossMargin",
  };

  const response: any = {};

  for (let i = 0; i < rows.length; i++) {
    const categoryValue = getRowValue(rows[i], category.index) as string;
    if (!response[categoryValue]) {
      response[categoryValue] = {
        category: categoryValue,
        [sku.label]: 0,
        [sumOfInvAvgQty.label]: 0,
        [sumOfInvAvgValue.label]: 0,
        [sumOfQtySent.label]: 0,
        [sumOfCubageInvAvg.label]: 0,
        [sumOfTotalSales.label]: 0,
        [sumOfGrossMargin.label]: 0,
      };
    }

    response[categoryValue][sku.label]++;
    response[categoryValue][sumOfInvAvgQty.label] += getRowValue(
      rows[i],
      sumOfInvAvgQty.index
    );
    response[categoryValue][sumOfInvAvgValue.label] += getRowValue(
      rows[i],
      sumOfInvAvgValue.index
    );
    response[categoryValue][sumOfQtySent.label] += getRowValue(
      rows[i],
      sumOfQtySent.index
    );
    response[categoryValue][sumOfCubageInvAvg.label] += getRowValue(
      rows[i],
      sumOfCubageInvAvg.index
    );
    response[categoryValue][sumOfTotalSales.label] += getRowValue(
      rows[i],
      sumOfTotalSales.index
    );
    response[categoryValue][sumOfGrossMargin.label] += getRowValue(
      rows[i],
      sumOfGrossMargin.index
    );
  }

  return Object.values(response);
}

export function calculateCategoriesTotalsData(
  categoriesDataRows: IBaseData["categoriesData"]["rows"]
): IBaseData["categoriesData"]["totals"] {
  return {
    category: "Total",
    ...DRIVERS.filter((x) => !x.catHiddenByDefault).reduce((acc, driver) => {
      acc[driver.name] = categoriesDataRows.reduce(
        (acc, row) => acc + (row[driver.name] as number),
        0
      );
      return acc;
    }, {} as any),
    sumOfGrossMargin: categoriesDataRows.reduce(
      (acc, row) => acc + Number(row.sumOfGrossMargin),
      0
    ),
  } as IBaseData["categoriesData"]["totals"];
}

export function calculateDriversDataRows(
  categoriesDataRows: IBaseData["categoriesData"]["rows"],
  totals: IBaseData["categoriesData"]["totals"]
): IBaseData["driversData"]["rows"] {
  return DRIVERS.map((driver) => {
    const _row = {
      driver: driver.name,
    } as IBaseData["driversData"]["rows"][number];

    categoriesDataRows.forEach((row) => {
      _row[row.category] = Number(totals[driver.name])
        ? Number(row[driver.name]) / Number(totals[driver.name])
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
    ...Object.keys(paramsData.storingParams.costs).map((cost) => {
      const driver = EDriverType.AVERAGE_INVENTORY;
      const _row = {
        cost,
        total: paramsData.storingParams.costs[cost],
        driver,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            paramsData.storingParams.costs[cost] *
            Number(
              baseData.categoriesData.rows.find(
                (row) => row.driver === driver
              )![category]
            );
          return acc;
        }, {} as any),
      };
      return _row;
    }),
    ...Object.keys(paramsData.storingParams.investments).map((investment) => {
      const driver = EDriverType.AVERAGE_INVENTORY;
      const invest = "technologyCapitalCost";
      const investmentPercentage = paramsData.generalParams.financial[invest];
      const _row = {
        invest,
        cost: investment,
        total:
          paramsData.storingParams.investments[investment] *
          (investmentPercentage / 100),
        driver,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            paramsData.storingParams.investments[investment] *
            (investmentPercentage / 100) *
            Number(
              baseData.categoriesData.rows.find(
                (row) => row.driver === driver
              )![category]
            );
          return acc;
        }, {} as any),
      };
      return _row;
    }),
  ];

  const inventoryCosts: IScorecardData["inventoryCosts"]["rows"] = [
    ...Object.keys(paramsData.inventoryParams.costs).map((cost) => {
      const driver = EDriverType.AVERAGE_INVENTORY;
      const _row = {
        cost,
        total: paramsData.inventoryParams.costs[cost],
        driver,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            paramsData.inventoryParams.costs[cost] *
            Number(
              baseData.categoriesData.rows.find(
                (row) => row.driver === driver
              )![category]
            );
          return acc;
        }, {} as any),
      };
      return _row;
    }),
    ...Object.keys(paramsData.inventoryParams.investments).map((investment) => {
      const driver = EDriverType.AVERAGE_INVENTORY;
      const invest = "technologyCapitalCost";
      const investmentPercentage = paramsData.generalParams.financial[invest];
      const _row = {
        invest,
        cost: investment,
        total:
          paramsData.inventoryParams.investments[investment] *
          (investmentPercentage / 100),
        driver,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            paramsData.inventoryParams.investments[investment] *
            (investmentPercentage / 100) *
            Number(
              baseData.categoriesData.rows.find(
                (row) => row.driver === driver
              )![category]
            );
          return acc;
        }, {} as any),
      };
      return _row;
    }),
  ];

  const totalStoringCost = storingCosts.reduce((acc, row) => {
    return acc + row.total;
  }, 0);
  storingCosts.forEach((row) => {
    row.totalPercentage = row.total / totalStoringCost;
  });

  const totalInventoryCost = inventoryCosts.reduce((acc, row) => {
    return acc + row.total;
  }, 0);
  inventoryCosts.forEach((row) => {
    row.totalPercentage = row.total / totalInventoryCost;
  });

  return {
    storingCosts: {
      rows: storingCosts,
      totals: {
        total: storingCosts.reduce((acc, row) => acc + row.total, 0),
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
        total: inventoryCosts.reduce((acc, row) => acc + row.total, 0),
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
