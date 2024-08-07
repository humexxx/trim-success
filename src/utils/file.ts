import { GridColDef } from "@mui/x-data-grid";
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
