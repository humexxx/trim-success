import { GridColDef } from "@mui/x-data-grid";
import { IColumn } from "src/models";
import * as XLSX from "xlsx";

const codes = [
  "sku",
  "category",
  "subCategory",
  "description",
  "provider",
  "country",
  "packing",
  "bpp",
  "forecast",
  "cpt",
  "cip",
  "table",
  "lt",
  "forecastError",
  "qtySold",
  "pSold",
  "price",
  "cost",
  "sFactor",
  "utilityMargin",
  "totalSales",
  "costSales",
  "grossMargin",
  "ipb",
  "avgInv",
  "transitInv",
  "currentInv",
  "rotacion",
  "mesesInv",
  "pckSent",
  "nivelServicioActual",
] as const;
type Code = (typeof codes)[number];

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

export function getColumnIndex(
  code: Code,
  columns?: IColumn[]
): number | number[] | undefined {
  if (!columns) return undefined;
  const column = columns.find((col) => col.code === code);
  return column ? column.index : undefined;
}

export function getRowValue(row: any, index: number | number[]): any {
  const values = Object.values(row);
  if (Array.isArray(index)) {
    return index.map((i) => values[i + 1]);
  }
  return values[index + 1];
}
