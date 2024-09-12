import { GridColDef } from "@mui/x-data-grid";
import { COLUMNS, DRIVERS } from "src/consts";
import { EColumnType, EDriverType } from "src/enums";
import { ICatData } from "src/models/user";

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

export function getCATGenDataAsync(
  rows: any[]
): Promise<ICatData["catCategoriesFirst"]["rows"]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./workers/calculateCatDataCategoryFirst.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      const { data, progress, error } = event.data;
      console.log(data);

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

export function getCATDataAsync(rows: any[]): Promise<
  {
    id: string;
    driver: EDriverType;
    [category: string]: number | string;
  }[]
> {
  return new Promise((resolve, reject) => {
    try {
      const categoryIndex = getColumnIndex(EColumnType.CATEGORY)!;
      const obj: Record<string, Record<string, number>> = {};
      const response: {
        id: string;
        driver: EDriverType;
        [category: string]: number | string;
      }[] = [];

      for (let i = 0; i < rows.length; i++) {
        const category = getRowValue(rows[i], categoryIndex) as string;

        DRIVERS.forEach((driver) => {
          let index = -1;
          switch (driver.name as EDriverType) {
            case EDriverType.SKUS:
              obj[driver.name] = {
                ...obj[driver.name],
                [category]: (obj[driver.name]?.[category] || 0) + 1,
              };
              break;
            case EDriverType.SALES:
              index = getColumnIndex(EColumnType.SALES)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.INVENTORY_VALUE:
              index = getColumnIndex(EColumnType.INVENTORY_VALUE)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.AVERAGE_INVENTORY:
              index = getColumnIndex(EColumnType.AVERAGE_INVENTORY)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.SHIPPED_CASES:
              index = getColumnIndex(EColumnType.SHIPPED_CASES)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.INVENTORY_CUBE:
              index = getColumnIndex(EColumnType.INVENTORY_CUBE)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.PLANNERS:
              obj[driver.name] = {
                ...obj[driver.name],
                [category]: 0,
              };
              break;
            case EDriverType.ORDERS:
              obj[driver.name] = {
                ...obj[driver.name],
                [category]: 0,
              };
              break;
          }
        });
      }

      for (const driver of DRIVERS) {
        const categories = Object.keys(obj[driver.name]);
        const total = categories.reduce(
          (acc, category) => acc + obj[driver.name][category],
          0
        );
        response.push({
          id: driver.name,
          driver: driver.name as EDriverType,
          ...categories.reduce(
            (acc, category) => ({
              ...acc,
              [category]: obj[driver.name][category]
                ? parseFloat(
                    ((obj[driver.name][category] / total) * 100).toFixed(2)
                  )
                : 0,
            }),
            {}
          ),
        });
      }

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
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
        console.log(event.data);
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
