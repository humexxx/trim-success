import { GridColDef } from "@mui/x-data-grid";
import { COLUMNS, DRIVERS } from "src/consts";
import { EColumnType, EDriverType } from "src/enums";
import { ICatData, IDataParams, IScorecardData } from "src/models/user";

export async function getJsonDataFromFileAsync(file: Blob): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/fileReaderWorker.js", import.meta.url)
    );

    worker.postMessage(file);

    worker.onmessage = (event) => {
      const { status, data, message } = event.data;
      if (status === "success") {
        resolve(data);
      } else {
        reject(new Error(message));
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(new Error("Error in worker: " + error.message));
      worker.terminate();
    };
  });
}

export function getColsAndRowsAsync(jsonData?: any[][]): Promise<{
  rows: any[];
  columns: GridColDef[];
}> {
  if (!jsonData) throw new Error("No data found in the file.");

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/getColsAndRowsWorker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      const { rows, columns, progress } = event.data;

      if (progress || progress == 0) {
        console.log(`Progress: ${progress}%`);
      } else {
        resolve({ rows, columns });
      }
    };

    worker.onerror = (error) => {
      reject(new Error("Error in worker: " + error.message));
    };

    worker.postMessage(jsonData);
  });
}

export function getColumnIndex(column: EColumnType): number | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.index;
}

export function getColumnIndexRange(column: EColumnType): number[] | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.indexRange;
}

export function getCatDataCategoryFirstAsync(
  rows: any[]
): Promise<ICatData["catCategoriesFirst"]["rows"]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/calculateCatDataCategoryFirst.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      const { data, progress, error } = event.data;

      if (error) {
        reject(new Error(error));
      } else if (progress || progress == 0) {
        console.log(`Progress: ${progress}%`);
      } else {
        resolve(data as ICatData["catCategoriesFirst"]["rows"]);
      }
    };

    worker.onerror = (error) => {
      reject(new Error("Error in worker: " + error.message));
    };

    worker.postMessage({
      rows,
      category: {
        index: getColumnIndex(EColumnType.CATEGORY)!,
      },
      sku: {
        label: EDriverType.SKUS,
      },
      sumOfInvAvgQty: {
        index: getColumnIndex(EColumnType.AVERAGE_INVENTORY)!,
        label: EDriverType.AVERAGE_INVENTORY,
      },
      sumOfInvAvgValue: {
        index: getColumnIndex(EColumnType.INVENTORY_VALUE)!,
        label: EDriverType.INVENTORY_VALUE,
      },
      sumOfQtySent: {
        index: getColumnIndex(EColumnType.SHIPPED_CASES)!,
        label: EDriverType.SHIPPED_CASES,
      },
      sumOfCubageInvAvg: {
        index: getColumnIndex(EColumnType.INVENTORY_CUBE)!,
        label: EDriverType.INVENTORY_CUBE,
      },
      sumOfTotalSales: {
        index: getColumnIndex(EColumnType.SALES)!,
        label: EDriverType.SALES,
      },
      sumOfGrossMargin: {
        index: getColumnIndex(EColumnType.GROSS_MARGIN)!,
        label: "sumOfGrossMargin",
      },
    });
  });
}

export function getCatDataDriversFirst(
  rows: ICatData["catCategoriesFirst"]["rows"],
  totals: ICatData["catCategoriesFirst"]["totals"]
): ICatData["catDriversFirst"]["rows"] {
  return DRIVERS.map((driver) => {
    const _row = {
      driver: driver.name,
    } as ICatData["catDriversFirst"]["rows"][number];

    rows.forEach((row) => {
      _row[row.category] = Number(totals[driver.name])
        ? Number(row[driver.name]) / Number(totals[driver.name])
        : 0;
    });

    return _row;
  });
}

export function calculateScorecardData(
  paramsData: IDataParams,
  catData: ICatData
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
              catData.catDriversFirst.rows.find(
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
              catData.catDriversFirst.rows.find(
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
              catData.catDriversFirst.rows.find(
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
              catData.catDriversFirst.rows.find(
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

export function getGeneralDataAsync(rows?: any[]): Promise<{
  categories: string[];
  sumSales: number;
  sumCostSales: number;
}> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/getGeneralDataWorker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      const { categories, sumSales, sumCostSales, progress, error } =
        event.data;

      if (error) {
        reject(new Error(error));
      } else if (progress || progress == 0) {
        console.log(`Progress: ${progress}%`);
      } else {
        resolve({ categories, sumSales, sumCostSales });
      }
    };

    worker.onerror = (error) => {
      reject(new Error("Error in worker: " + error.message));
    };

    worker.postMessage({
      rows,
      categoryIndex: getColumnIndex(EColumnType.CATEGORY),
      salesIndex: getColumnIndex(EColumnType.SALES),
      salesCostIndex: getColumnIndex(EColumnType.COST_SALES),
    });
  });
}

export function getRowValue(
  row: any[],
  index: number | number[]
): string | number | string[] | number[] {
  const values = Object.values(row);
  if (Array.isArray(index)) {
    return index.map((i) => values[i + 1]);
  }
  return values[index + 1];
}
