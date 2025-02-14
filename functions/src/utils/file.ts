import { JSON_FILE_NAME, STORAGE_PATH } from "@shared/consts";
import {
  IDataModel,
  IDataModelCubeRow,
  IDataModelParametersRow,
} from "@shared/models";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import * as XLSX from "xlsx";

import { getBucketFiles } from "./repository";

const storage = admin.storage();

function parseJsonData<T>(
  jsonData: [string[], ...(string | number)[][]],
  options: { applyId: boolean } = { applyId: false }
): IDataModel<T> {
  const header = jsonData[0];
  const rowsData: Array<T> = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowObj = row.reduce(
      (
        acc: { [x: string]: string | number },
        cell: string | number,
        index: number
      ) => {
        if (header[index] || cell) acc[header[index]] = cell;
        return acc;
      },
      {}
    );

    if (options.applyId) rowObj.id = i - 1;

    rowsData.push(rowObj as T);
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
  const folderPath = `${STORAGE_PATH}/${uid}/`;

  return storage
    .bucket()
    .file(`${folderPath}${fileUid}-${JSON_FILE_NAME}.json`)
    .save(JSON.stringify(dataModel), {
      contentType: "application/json",
    });
}

function getDataFromXLSX(data: Uint8Array): {
  cubeRaw: [string[], ...(string | number)[][]];
  parametersRaw: [string[], ...(string | number)[][]];
} {
  const workbook = XLSX.read(data, { type: "array" });

  const cubeSheet = workbook.SheetNames[0];
  const parametersSheet = workbook.SheetNames[1];

  const cubeData = XLSX.utils.sheet_to_json(workbook.Sheets[cubeSheet], {
    header: 1,
    raw: true,
  }) as [string[], ...(string | number)[][]];

  const parametersData = XLSX.utils.sheet_to_json(
    workbook.Sheets[parametersSheet],
    {
      header: 1,
      raw: true,
    }
  ) as [string[], ...(string | number)[][]];

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

  const files = await getBucketFiles(uid);

  const file = files.find((file) => file.name.includes(fileUid));
  if (!file) {
    throw new Error(`File not found: ${fileUid}`);
  }

  const [fileContent] = await file.download();
  const data = new Uint8Array(fileContent);

  const { cubeRaw, parametersRaw } = getDataFromXLSX(data);
  const cubeDataModel = parseJsonData<IDataModelCubeRow>(cubeRaw, {
    applyId: true,
  });
  const parametersDataModel =
    parseJsonData<IDataModelParametersRow>(parametersRaw);

  await uploadJsonFile(uid, fileUid, cubeDataModel);

  logger.info(`Data models generated and saved for file: ${fileUid}`);
  return { cubeDataModel, parametersDataModel };
}
