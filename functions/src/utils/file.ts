import { JSON_FILE_NAME, STORAGE_PATH } from "@shared/consts";
import { IDataModel } from "@shared/models";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import * as XLSX from "xlsx";

const storage = admin.storage();

function generateDataModelFromJson(jsonData: any): IDataModel {
  const header = jsonData[0];
  const rowsData = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowObj = row.reduce(
      (acc: { [x: string]: any }, cell: any, index: string | number) => {
        acc[header[index]] = cell;
        return acc;
      },
      {} as any
    );

    if (rowObj[header[0]]) rowsData.push(rowObj);
  }

  return {
    columns: header,
    rows: rowsData,
  };
}

export function uploadJsonFile(
  uid: string,
  fileUid: string,
  dataModel: IDataModel
): Promise<void> {
  const folderRef = `${STORAGE_PATH}/${uid}/`;

  return storage
    .bucket()
    .file(`${folderRef}${fileUid}-${JSON_FILE_NAME}.json`)
    .save(JSON.stringify(dataModel), {
      contentType: "application/json",
    });
}

export async function generateDataModel(
  uid: string,
  fileUid: string
): Promise<IDataModel> {
  logger.info(`Generating data model for file: ${fileUid}`);

  const folderRef = `${STORAGE_PATH}/${uid}/`;
  const response = await storage.bucket().getFiles({ prefix: folderRef });

  const files = response[0];
  if (!files || files.length === 0) {
    throw new Error("No files found.");
  }

  const file = files.find((file) => file.name.includes(fileUid));
  if (!file) {
    throw new Error(`File not found: ${fileUid}`);
  }

  const [fileContent] = await file.download();
  const data = new Uint8Array(fileContent);
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
    header: 1,
    raw: true,
  });
  const dataModel = generateDataModelFromJson(jsonData);
  await uploadJsonFile(uid, fileUid, dataModel);

  logger.info("Data model generated and saved.");
  return dataModel;
}

// TODO: make it dynamic (multiple files)
export async function getDataModel(
  uid: string
): Promise<{ dataModel: IDataModel; fileUid: string }> {
  const folderRef = `${STORAGE_PATH}/${uid}/`;

  const [files] = await storage.bucket().getFiles({ prefix: folderRef });
  if (!files || files.length === 0) {
    throw new Error("No files found.");
  }
  const jsonFile = files.find((file) => file.name.includes(JSON_FILE_NAME));
  if (!jsonFile) throw new Error("JSON file not found.");

  const [fileContent] = await jsonFile.download();
  return {
    dataModel: JSON.parse(fileContent.toString()) as IDataModel,
    fileUid: jsonFile.name.split("-")[0].split("/")[2],
  };
}
