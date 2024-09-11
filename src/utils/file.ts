import { GridColDef } from "@mui/x-data-grid";
import { COLUMNS, DRIVERS } from "src/consts";
import { EColumnType, EDriverType } from "src/enums";
import { ICATGenRow } from "src/pages/client/CAT/components/CATTableGen";

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

export function getAgetCATGenDataAsync(rows: any[]): Promise<ICATGenRow[]> {
  return new Promise((resolve, reject) => {
    try {
      const categoryIndex = getColumnIndex(EColumnType.CATEGORY)!;
      const sumOfInvAvgQtyIndex = getColumnIndex(EColumnType.AVG_INV_QTY)!;
      const sumOfInvAvgValueIndex = getColumnIndex(EColumnType.AVG_INV_VALUE)!;
      const sumOfQtySentIndex = getColumnIndex(EColumnType.PCK_SENT)!;
      const sumOfCubageInvAvgIndex = getColumnIndex(EColumnType.CIP)!;
      const sumOfTotalSalesIndex = getColumnIndex(EColumnType.TOTAL_SALES)!;
      const sumOfGrossMarginIndex = getColumnIndex(EColumnType.GROSS_MARGIN)!;

      const response: { [category: string]: ICATGenRow } = {};

      for (let i = 0; i < rows.length; i++) {
        const category = getRowValue(rows[i], categoryIndex) as string;
        if (!response[category]) {
          response[category] = {
            id: i,
            category,
            skusCount: 0,
            sumInvAvgQty: 0,
            sumInvAvgValue: 0,
            sumQtySent: 0,
            sumCubageInvAvg: 0,
            sumTotalSales: 0,
            sumGrossMargin: 0,
          };
        }
        response[category].skusCount++;
        response[category].sumInvAvgQty += getRowValue(
          rows[i],
          sumOfInvAvgQtyIndex
        ) as number;
        response[category].sumInvAvgValue += getRowValue(
          rows[i],
          sumOfInvAvgValueIndex
        ) as number;
        response[category].sumQtySent += getRowValue(
          rows[i],
          sumOfQtySentIndex
        ) as number;
        response[category].sumCubageInvAvg += getRowValue(
          rows[i],
          sumOfCubageInvAvgIndex
        ) as number;
        response[category].sumTotalSales += getRowValue(
          rows[i],
          sumOfTotalSalesIndex
        ) as number;
        response[category].sumGrossMargin += getRowValue(
          rows[i],
          sumOfGrossMarginIndex
        ) as number;
      }

      resolve(Object.values(response));
    } catch (error) {
      reject(error);
    }
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
              index = getColumnIndex(EColumnType.TOTAL_SALES)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.INVENTORY_VALUE:
              index = getColumnIndex(EColumnType.AVG_INV_VALUE)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.AVERAGE_INVENTORY:
              index = getColumnIndex(EColumnType.AVG_INV_QTY)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.SHIPPED_CASES:
              index = getColumnIndex(EColumnType.PCK_SENT)!;
              obj[driver.name] = {
                ...obj[driver.name],
                [category]:
                  (obj[driver.name]?.[category] || 0) +
                  (getRowValue(rows[i], index) as number),
              };
              break;
            case EDriverType.INVENTORY_CUBE:
              index = getColumnIndex(EColumnType.CIP)!;
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
      salesIndex: getColumnIndex(EColumnType.TOTAL_SALES),
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
