import { GridColDef } from "@mui/x-data-grid";
import { COLUMNS, DRIVERS } from "src/consts";
import { EColumnType, EDriverType } from "src/enums";
import { ICATGenRow } from "src/pages/client/Scorecard/components/CATTableGen";
import * as XLSX from "xlsx";

export function getJsonDataFromFile(
  callback: (jsonData: any[][]) => void,
  file: Blob
) {
  const reader = new FileReader();

  reader.onload = (event) => {
    if (event.target?.result) {
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: true,
      });

      if (jsonData.length > 0) {
        callback(jsonData);
      } else {
        throw new Error("No data found in the file.");
      }
    }
  };

  reader.readAsArrayBuffer(file);
}

export function getColsAndRows(jsonData?: any[][]): {
  rows: any[];
  columns: GridColDef[];
} {
  if (!jsonData) throw new Error("No data found in the file.");

  const header = jsonData[0] as string[];
  const cols = header.map((col) => ({
    field: col,
    headerName: col,
  }));

  const rowsData = jsonData.slice(1).map((row, index) =>
    row.reduce((acc, cell, i) => ({ ...acc, [header[i]]: cell }), {
      id: index + 1,
    })
  );

  return {
    rows: rowsData,
    columns: cols,
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

export function getCategories(rows?: any[]): string[] {
  if (!rows) return [];

  return Array.from(
    new Set(
      rows.map((row) => getRowValue(row, getColumnIndex(EColumnType.CATEGORY)!))
    )
  ) as string[];
}

export function getSumSalesAsync(rows?: any[]): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const sumOfTotalSalesIndex = getColumnIndex(EColumnType.TOTAL_SALES)!;
      const sum = rows?.reduce(
        (acc, row) => (acc + getRowValue(row, sumOfTotalSalesIndex)) as number,
        0
      );
      resolve(parseFloat(sum.toFixed(2)));
    } catch (error) {
      reject(error);
    }
  });
}

export function getSumCostSalesAsync(rows?: any[]): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const sum = rows?.reduce(
        (acc, row) =>
          acc + getRowValue(row, getColumnIndex(EColumnType.COST_SALES)!),
        0
      );
      resolve(parseFloat(sum.toFixed(2)));
    } catch (error) {
      reject(error);
    }
  });
}
