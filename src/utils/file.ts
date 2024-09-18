import { GridColDef } from "@mui/x-data-grid";
import { COLUMNS, DRIVERS } from "src/consts";
import { EColumnType, EDriverType } from "src/enums";
import { IBaseData, IParamsData, IScorecardData } from "src/models";

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

export function getGeneralDataAsync(rows?: any[]): Promise<{
  categories: string[];
  sumSales: number;
  sumCostSales: number;
}> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/calculateGeneralDataWorker.js", import.meta.url)
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

export function getCategoriesDataAsync(
  rows: any[]
): Promise<IBaseData["categoriesData"]["rows"]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/calculateCategoriesDataWorker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      const { data, progress, error } = event.data;

      if (error) {
        reject(new Error(error));
      } else if (progress || progress == 0) {
        console.log(`Progress: ${progress}%`);
      } else {
        resolve(data as IBaseData["categoriesData"]["rows"]);
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
        label: "grossMargin",
      },
    });
  });
}

export function getDriversData(
  rows: IBaseData["categoriesData"]["rows"],
  totals: IBaseData["categoriesData"]["totals"]
): IBaseData["driversData"]["rows"] {
  return DRIVERS.map((driver) => {
    const _row = {
      driver: driver.name,
    } as IBaseData["driversData"]["rows"][number];

    rows.forEach((row) => {
      _row[row.category] = Number(totals[driver.name])
        ? Number(row[driver.name]) / Number(totals[driver.name])
        : 0;
    });

    return _row;
  });
}

export function updateStoringScorecardDataRow(
  newRow: IScorecardData["storingCosts"]["rows"][number],
  rows: IScorecardData["storingCosts"]["rows"],
  paramsData: IParamsData,
  catData: IBaseData
): IScorecardData["storingCosts"] {
  const storingCosts = rows.map((r) => {
    if (r.cost === newRow.cost) {
      return {
        ...newRow,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            newRow.total *
            Number(
              catData.driversData.rows.find(
                (row) => row.driver === newRow.driver
              )![category]
            );
          return acc;
        }, {} as any),
      };
    }
    return r;
  });

  const totalStoringCost = storingCosts.reduce((acc, row) => {
    return acc + Number(row.total);
  }, 0);
  storingCosts.forEach((row) => {
    row.totalPercentage = Number(row.total) / totalStoringCost;
  });

  return {
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
  };
}

export function updateInventoryScorecardDataRow(
  newRow: IScorecardData["inventoryCosts"]["rows"][number],
  rows: IScorecardData["inventoryCosts"]["rows"],
  paramsData: IParamsData,
  catData: IBaseData
): IScorecardData["inventoryCosts"] {
  const inventoryCosts = rows.map((r) => {
    if (r.cost === newRow.cost) {
      return {
        ...newRow,
        ...paramsData.categories.reduce((acc, category) => {
          acc[category] =
            newRow.total *
            Number(
              catData.driversData.rows.find(
                (row) => row.driver === newRow.driver
              )![category]
            );
          return acc;
        }, {} as any),
      };
    }
    return r;
  });

  const totalStoringCost = inventoryCosts.reduce((acc, row) => {
    return acc + Number(row.total);
  }, 0);
  inventoryCosts.forEach((row) => {
    row.totalPercentage = row.total / totalStoringCost;
  });

  return {
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
  };
}

export function getColumnIndex(column: EColumnType): number | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.index;
}

export function getColumnIndexRange(column: EColumnType): number[] | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.indexRange;
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
