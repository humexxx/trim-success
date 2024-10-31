import { JSON_FILE_NAME, STORAGE_PATH } from "@shared/consts";
import {
  IDataModel,
  IDataModelCubeRow,
  IDataModelParametersRow,
} from "@shared/models";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import * as XLSX from "xlsx";

const storage = admin.storage();

function parseJsonData<T>(jsonData: any): IDataModel<T> {
  const header = jsonData[0];
  const rowsData: Array<T> = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowObj = row.reduce(
      (acc: { [x: string]: any }, cell: any, index: string | number) => {
        acc[header[index]] = cell;
        return acc;
      },
      {} as T
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
  dataModel: IDataModel<IDataModelCubeRow>
): Promise<void> {
  const folderRef = `${STORAGE_PATH}/${uid}/`;

  return storage
    .bucket()
    .file(`${folderRef}${fileUid}-${JSON_FILE_NAME}.json`)
    .save(JSON.stringify(dataModel), {
      contentType: "application/json",
    });
}

function getDataFromXLSX(data: Uint8Array): {
  cubeRaw: unknown[];
  parametersRaw: unknown[];
} {
  const workbook = XLSX.read(data, { type: "array" });

  const cubeSheet = workbook.SheetNames[0];
  const parametersSheet = workbook.SheetNames[1];

  const cubeData = XLSX.utils.sheet_to_json(workbook.Sheets[cubeSheet], {
    header: 1,
    raw: true,
  });

  const parametersData = XLSX.utils.sheet_to_json(
    workbook.Sheets[parametersSheet],
    {
      header: 1,
      raw: true,
    }
  );

  return {
    cubeRaw: cubeData,
    parametersRaw: parametersData,
  };
}

export async function generateDataModels(
  uid: string,
  fileUid: string
): Promise<{
  cubeDataModel: IDataModel<IDataModelCubeRow>;
  parametersDataModel: IDataModel<IDataModelParametersRow>;
}> {
  logger.info(`Generating data models for file: ${fileUid}`);

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

  const { cubeRaw, parametersRaw } = getDataFromXLSX(data);
  const cubeDataModel = parseJsonData<IDataModelCubeRow>(cubeRaw);
  const parametersDataModel =
    parseJsonData<IDataModelParametersRow>(parametersRaw);

  await uploadJsonFile(uid, fileUid, cubeDataModel);

  logger.info("Data models generated and saved.");
  return { cubeDataModel, parametersDataModel };
}
