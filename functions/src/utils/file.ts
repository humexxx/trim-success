import * as admin from "firebase-admin";
import * as XLSX from "xlsx";

const storage = admin.storage();
const STORAGE_PATH = "cubes";

export async function getUserCubeFile(uid: string): Promise<Buffer> {
  const folderRef = `${STORAGE_PATH}/${uid}/`;

  const [files] = await storage.bucket().getFiles({ prefix: folderRef });
  if (!files || files.length === 0) {
    throw new Error("No files found.");
  }
  const firstFile = files[0];
  const [fileBuffer] = await firstFile.download();

  return fileBuffer;
}

export function processExcelFile(buffer: Buffer): any[][] {
  const dataArray = new Uint8Array(buffer);
  const workbook = XLSX.read(dataArray, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet data to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: true,
  });

  if (jsonData.length > 0) {
    return jsonData as any[][];
  } else {
    throw new Error("No data found in the file.");
  }
}

export function processJsonData(jsonData: any[][]): {
  rows: any[];
  columns: any[];
} {
  const header = jsonData[0];
  const rowsData = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowObj = row.reduce((acc, cell, index) => {
      acc[header[index]] = cell;
      return acc;
    }, {});

    rowsData.push(rowObj);
  }

  const columns = header.map((col) => ({
    field: col,
    headerName: col,
  }));

  return { rows: rowsData, columns };
}
