import { JSON_FILE_NAME, STORAGE_PATH } from "@shared/consts";
import * as admin from "firebase-admin";

const storage = admin.storage();

export async function getJsonData(uid: string): Promise<any> {
  const folderRef = `${STORAGE_PATH}/${uid}/`;

  const [files] = await storage.bucket().getFiles({ prefix: folderRef });
  if (!files || files.length === 0) {
    throw new Error("No files found.");
  }
  const jsonFile = files.find((file) => file.name.includes(JSON_FILE_NAME));
  if (!jsonFile) throw new Error("JSON file not found.");

  const [fileContent] = await jsonFile.download();
  return JSON.parse(fileContent.toString());
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
