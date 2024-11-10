import { DEFAULT_INVETORY_PERFORMANCE_METRICS } from "@shared/consts";
import {
  ECalculatedParamameterType,
  EColumnType,
  EDataModelParameterSubType,
  EDataModelParameterType,
  EDriverType,
  EValueType,
} from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import {
  IDriver,
  IBaseData,
  IScorecardData,
  IInventoryPerformanceData,
  IDataModel,
  IInitialCubeData,
  IDataModelCubeRow,
  IDataModelParametersRow,
  ICubeParameters,
} from "@shared/models";
import { getColumn, getColumnIndex, getRowValue } from "@shared/utils";

export function calculateInitialData(
  rows: IDataModel<IDataModelCubeRow>["rows"]
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
  return drivers
    .filter((x) => !x.xdriverHidden)
    .map((driver) => {
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
  cubeParameters: ICubeParameters,
  baseData: IBaseData
): IScorecardData {
  const investmentsTypes = cubeParameters.parameters.filter(
    (x) =>
      x.type === EDataModelParameterType.GENERAL &&
      x.subType === EDataModelParameterSubType.FINACIAL &&
      !x.autoCalculated
  );

  const storingCosts: IScorecardData["storingCosts"]["rows"] = [
    ...cubeParameters.parameters
      .filter(
        (x) =>
          x.type === EDataModelParameterType.STORING &&
          x.subType === EDataModelParameterSubType.COSTS
      )
      .map((cost) => {
        const driver = cubeParameters.drivers[0];
        const _row = {
          cost: cost.name,
          total: cost.value,
          driver: driver.key,
          totalPercentage: 0,
          invest: "",
          ...cubeParameters.categories.reduce(
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
    ...cubeParameters.parameters
      .filter(
        (x) =>
          x.type === EDataModelParameterType.STORING &&
          x.subType === EDataModelParameterSubType.INVESTMENTS
      )
      .map((investment) => {
        const driver = cubeParameters.drivers[0];
        const investType = investmentsTypes[0];
        const _row = {
          invest: investType.name,
          cost: investment.name,
          total: investment.value * (investType.value / 100),
          driver: driver.key,
          totalPercentage: 0,
          ...cubeParameters.categories.reduce(
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
    ...cubeParameters.parameters
      .filter(
        (x) =>
          x.type === EDataModelParameterType.INVENTORY &&
          x.subType === EDataModelParameterSubType.COSTS
      )
      .map((cost) => {
        const driver = cubeParameters.drivers[0];
        const _row = {
          cost: cost.name,
          total: cost.value,
          driver: driver.key,
          invest: "",
          totalPercentage: 0,
          ...cubeParameters.categories.reduce(
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
    ...cubeParameters.parameters
      .filter(
        (x) =>
          x.type === EDataModelParameterType.INVENTORY &&
          x.subType === EDataModelParameterSubType.INVESTMENTS
      )
      .map((investment) => {
        const driver = cubeParameters.drivers[0];
        const investType = investmentsTypes[0];
        const _row = {
          invest: investType.name,
          cost: investment.name,
          total: investment.value * (investType.value / 100),
          driver: driver.key,
          totalPercentage: 0,
          ...cubeParameters.categories.reduce(
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
        ...cubeParameters.categories.reduce(
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
        ...cubeParameters.categories.reduce(
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
    rows: DEFAULT_INVETORY_PERFORMANCE_METRICS.reduce(
      (acc, value, index) => {
        const previousElements = acc.slice(0, index);

        const row = {
          ...value,
          ...categories.reduce(
            (acc, category) => {
              acc[category] = calculateInventoryPerformanceByKey(
                value.key,
                category,
                scorecard,
                baseData,
                previousElements
              );
              return acc;
            },
            {} as Record<string, number>
          ),
          total: calculateInventoryPerformanceTotalByKey(
            value.key,
            scorecard,
            baseData,
            previousElements
          ),
        };

        acc.push(row);
        return acc;
      },
      [] as IInventoryPerformanceData["rows"]
    ),
  };

  return response;
}

function calculateInventoryPerformanceByKey(
  key: EInventoryPerformaceMetricType,
  category: string,
  scorecard: IScorecardData,
  baseData: IBaseData,
  data: IInventoryPerformanceData["rows"]
): number {
  switch (key) {
    case EInventoryPerformaceMetricType.ICR_PERCENTAGE:
      return (
        (Number(scorecard.inventoryCosts.totals[category]) +
          Number(scorecard.storingCosts.totals[category])) /
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.INVENTORY_VALUE]
        )
      );
    case EInventoryPerformaceMetricType.ROTACION:
      return (
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.COST_SALES]
        ) /
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.INVENTORY_VALUE]
        )
      );
    case EInventoryPerformaceMetricType.INVENTORY_360: {
      const rotacion = Number(
        data.find((x) => x.key === EInventoryPerformaceMetricType.ROTACION)![
          category
        ]
      );
      return 360 / rotacion;
    }
    case EInventoryPerformaceMetricType.INVENTORY_MONTHLY: {
      const rotacion = Number(
        data.find((x) => x.key === EInventoryPerformaceMetricType.ROTACION)![
          category
        ]
      );
      return 12 / rotacion;
    }
    case EInventoryPerformaceMetricType.ICC_OVER_SALES:
      return (
        (Number(scorecard.inventoryCosts.totals[category]) +
          Number(scorecard.storingCosts.totals[category])) /
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.SALES]
        )
      );
    case EInventoryPerformaceMetricType.INVENTORY_COST_OVER_AVG_SALES:
      return (
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.AVERAGE_INVENTORY]
        ) /
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.SALES]
        )
      );
    case EInventoryPerformaceMetricType.INVENTORY_MARGIN_OVER_AVG_SALES:
      return (
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.GROSS_MARGIN]
        ) /
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.INVENTORY_VALUE]
        )
      );
    case EInventoryPerformaceMetricType.INVENTORY_EXPECTED_VALUE:
      return (
        Number(
          baseData.categoriesData.rows.find(
            (row) => row.category === category
          )![EDriverType.GROSS_MARGIN]
        ) -
        (Number(scorecard.inventoryCosts.totals[category]) +
          Number(scorecard.storingCosts.totals[category]))
      );

    default:
      return 0;
  }
}

function calculateInventoryPerformanceTotalByKey(
  key: EInventoryPerformaceMetricType,
  scorecard: IScorecardData,
  baseData: IBaseData,
  data: IInventoryPerformanceData["rows"]
): number {
  switch (key) {
    case EInventoryPerformaceMetricType.ICR_PERCENTAGE:
      return (
        (Number(scorecard.inventoryCosts.totals.total) +
          Number(scorecard.storingCosts.totals.total)) /
        Number(baseData.categoriesData.totals[EDriverType.INVENTORY_VALUE])
      );
    case EInventoryPerformaceMetricType.ROTACION:
      return (
        Number(baseData.categoriesData.totals[EDriverType.COST_SALES]) /
        Number(baseData.categoriesData.totals[EDriverType.INVENTORY_VALUE])
      );
    case EInventoryPerformaceMetricType.INVENTORY_360: {
      const rotacionTotal = Number(
        data.find((x) => x.key === EInventoryPerformaceMetricType.ROTACION)!
          .total
      );
      return 360 / rotacionTotal;
    }
    case EInventoryPerformaceMetricType.INVENTORY_MONTHLY: {
      const rotacionTotal = Number(
        data.find((x) => x.key === EInventoryPerformaceMetricType.ROTACION)!
          .total
      );
      return 12 / rotacionTotal;
    }
    case EInventoryPerformaceMetricType.ICC_OVER_SALES:
      return (
        (Number(scorecard.inventoryCosts.totals.total) +
          Number(scorecard.storingCosts.totals.total)) /
        Number(baseData.categoriesData.totals[EDriverType.SALES])
      );
    case EInventoryPerformaceMetricType.INVENTORY_COST_OVER_AVG_SALES:
      return (
        Number(baseData.categoriesData.totals[EDriverType.AVERAGE_INVENTORY]) /
        Number(baseData.categoriesData.totals[EDriverType.SALES])
      );
    case EInventoryPerformaceMetricType.INVENTORY_MARGIN_OVER_AVG_SALES:
      return (
        Number(baseData.categoriesData.totals[EDriverType.GROSS_MARGIN]) /
        Number(baseData.categoriesData.totals[EDriverType.INVENTORY_VALUE])
      );
    case EInventoryPerformaceMetricType.INVENTORY_EXPECTED_VALUE:
      return (
        Number(baseData.categoriesData.totals[EDriverType.GROSS_MARGIN]) -
        (Number(scorecard.inventoryCosts.totals.total) +
          Number(scorecard.storingCosts.totals.total))
      );

    default:
      return 0;
  }
}

export function generateCubeParameters(
  parametersDataModel: IDataModel<IDataModelParametersRow>,
  initialData: IInitialCubeData,
  drivers: IDriver[]
): ICubeParameters {
  const cubeParameters: ICubeParameters = {
    categories: initialData.categories,
    drivers,
    parameters: [
      ...parametersDataModel.rows.map((row) => ({
        ...row,
        value: row.value as number,
        autoCalculated: false,
      })),
      {
        type: EDataModelParameterType.GENERAL,
        subType: EDataModelParameterSubType.FINACIAL,
        name: ECalculatedParamameterType.SALES,
        value: initialData.sumSales,
        valueType: EValueType.AMOUNT,
        autoCalculated: true,
      },
      {
        type: EDataModelParameterType.GENERAL,
        subType: EDataModelParameterSubType.FINACIAL,
        name: ECalculatedParamameterType.SALES_COST,
        value: initialData.sumCostSales,
        valueType: EValueType.AMOUNT,
        autoCalculated: true,
      },
      {
        type: EDataModelParameterType.INVENTORY,
        subType: EDataModelParameterSubType.INVESTMENTS,
        name: ECalculatedParamameterType.INVENTORY_INVESTMENT,
        value: initialData.sumCostInventory,
        valueType: EValueType.AMOUNT,
        autoCalculated: true,
      },
    ],
  };

  return cubeParameters;
}
