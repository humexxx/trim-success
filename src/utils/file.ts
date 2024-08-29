import { GridColDef } from "@mui/x-data-grid";
import { COLUMNS, DRIVERS } from "src/consts";
import { EColumnType, EDriverType } from "src/enums";
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

export function getDriversPercentagesAsync(rows: any[]): Promise<
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
          switch (driver.name as EDriverType) {
            case EDriverType.SKUS:
              obj[driver.name] = {
                ...obj[driver.name],
                [category]: (obj[driver.name]?.[category] || 0) + 1,
              };
              break;
            // Puedes agregar más casos si es necesario
          }
        });
      }

      for (const driver of DRIVERS) {
        if (!obj[driver.name]) continue;
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
              [category]: parseFloat(
                ((obj[driver.name][category] / total) * 100).toFixed(2)
              ),
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

export function getSumSales(rows?: any[]): number {
  if (!rows) return 0;

  return rows.reduce(
    (acc, row) =>
      acc + getRowValue(row, getColumnIndex(EColumnType.TOTAL_SALES)!),
    0
  );
}

export function getSumCostSales(rows?: any[]): number {
  if (!rows) return 0;

  return rows.reduce(
    (acc, row) =>
      acc + getRowValue(row, getColumnIndex(EColumnType.COST_SALES)!),
    0
  );
}
