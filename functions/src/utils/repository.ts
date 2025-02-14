import { FIRESTORE_PATHS, JSON_FILE_NAME, STORAGE_PATH } from "@shared/consts";
import { EColumnType } from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import { ESystemColumnType } from "@shared/enums/ESystemColumnType";
import {
  IBaseData,
  ICubeParameters,
  IDataModel,
  IDataModelCubeRow,
  IInventoryPerformanceData,
  IScorecardData,
} from "@shared/models";
import { getColumn, getRowValue } from "@shared/utils";
import { firestore, storage } from "firebase-admin";
import { logger } from "firebase-functions";

import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateInventoryPerformance,
  calculateScorecardData,
} from "./cube";
import { uploadJsonFile } from "./file";

export async function getCubeParamteres(uid: string): Promise<ICubeParameters> {
  const paramsData = await firestore()
    .doc(FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
    .get();
  if (!paramsData.exists) throw new Error("Cube parameters data not found.");

  return paramsData.data() as ICubeParameters;
}

export async function getDataMining(uid: string): Promise<IBaseData> {
  const baseData = await firestore()
    .doc(FIRESTORE_PATHS.SETTINGS.BASE(uid))
    .get();
  if (!baseData.exists) throw new Error("Data mining data not found.");

  return baseData.data() as IBaseData;
}

export async function getScorecardData(uid: string): Promise<IScorecardData> {
  const scorecardData = await firestore()
    .doc(FIRESTORE_PATHS.SETTINGS.SCORECARD(uid))
    .get();
  if (!scorecardData.exists) throw new Error("Scorecard data not found.");

  return scorecardData.data() as IScorecardData;
}

export async function getInventoryPerformanceData(
  uid: string
): Promise<IInventoryPerformanceData> {
  const inventoryPerformanceData = await firestore()
    .doc(FIRESTORE_PATHS.SETTINGS.INVENTORY_PERFORMANCE(uid))
    .get();
  if (!inventoryPerformanceData.exists)
    throw new Error("Inventory performance data not found.");

  return inventoryPerformanceData.data() as IInventoryPerformanceData;
}

export async function generateDataMining(
  uid: string,
  rows: IDataModel<IDataModelCubeRow>["rows"],
  cubeParameters: ICubeParameters
): Promise<IBaseData> {
  logger.info("Generating data mining...");

  const categoriesDataRows = calculateCategoriesDataRows(
    rows,
    cubeParameters.drivers
  );

  const categoriesDataTotals = calculateCategoriesTotalsData(
    categoriesDataRows,
    cubeParameters.drivers
  );

  const driversDataRows = calculateDriversDataRows(
    categoriesDataRows,
    categoriesDataTotals,
    cubeParameters.drivers
  );

  const dataMininng: IBaseData = {
    categoriesData: {
      rows: categoriesDataRows,
      totals: categoriesDataTotals,
    },
    driversData: {
      rows: driversDataRows,
    },
  };

  await firestore().doc(FIRESTORE_PATHS.SETTINGS.BASE(uid)).set(dataMininng);

  logger.info("Data mining generated and saved.");
  return dataMininng;
}

export async function generateScorecard(
  uid: string,
  cubeParameters: ICubeParameters,
  dataMining: IBaseData
): Promise<IScorecardData> {
  logger.info("Generating scorecard...");

  const scorecardData = calculateScorecardData(cubeParameters, dataMining);
  await firestore()
    .doc(FIRESTORE_PATHS.SETTINGS.SCORECARD(uid))
    .set(scorecardData);

  logger.info("Scorecard generated and saved.");
  return scorecardData;
}

export async function generateInventoryPerformance(
  uid: string,
  categories: string[],
  dataMining: IBaseData,
  scorecardData: IScorecardData
): Promise<IInventoryPerformanceData> {
  logger.info("Generating inventory performance...");

  const inventoryPerformance = calculateInventoryPerformance(
    categories,
    dataMining,
    scorecardData
  );

  await firestore()
    .doc(FIRESTORE_PATHS.SETTINGS.INVENTORY_PERFORMANCE(uid))
    .set(inventoryPerformance);

  logger.info("Inventory performance generated and saved.");
  return inventoryPerformance;
}

export async function generateDataModelInventoryPerformance(
  uid: string,
  fileUid: string,
  dataModel: IDataModel<IDataModelCubeRow>,
  inventoryPerformance: IInventoryPerformanceData
): Promise<IDataModel<IDataModelCubeRow>> {
  logger.info("Generating data model inventory performance...");

  const icrRow = inventoryPerformance.rows.find(
    (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
  )!;

  dataModel.columns.push(ESystemColumnType.ICR_PERCENTAGE);
  for (const row of dataModel.rows) {
    const category = getRowValue(row, getColumn(EColumnType.CATEGORY).index!);

    const inventoryValue = getRowValue(
      row,
      getColumn(EColumnType.INVENTORY_VALUE).index!
    );

    const grossMargin = getRowValue(
      row,
      getColumn(EColumnType.GROSS_MARGIN).index!
    );

    const icrPercentage = Number(icrRow[category]);
    const icc = icrPercentage * Number(inventoryValue);

    row[ESystemColumnType.ICR_PERCENTAGE] = icrPercentage;
    row[ESystemColumnType.ICC] = icc;
    row[ESystemColumnType.EV] = Number(grossMargin) - icc;
  }

  await uploadJsonFile(uid, fileUid, dataModel);

  logger.info("Data model inventory performance generated and saved.");
  return dataModel;
}

// TODO: make it dynamic (multiple files)
export async function getCubeDataModel(
  uid: string
): Promise<{ dataModel: IDataModel<IDataModelCubeRow>; fileUid: string }> {
  const files = await getBucketFiles(uid);

  const jsonFile = files.find((file) => file.name.includes(JSON_FILE_NAME));
  if (!jsonFile) throw new Error("JSON file not found.");

  const [fileContent] = await jsonFile.download();
  return {
    dataModel: JSON.parse(
      fileContent.toString()
    ) as IDataModel<IDataModelCubeRow>,
    fileUid: jsonFile.name.split("-")[0].split("/")[2],
  };
}

export async function getBucketFiles(uid: string) {
  const folderRef = `${STORAGE_PATH}/${uid}/`;

  const [files] = await storage().bucket().getFiles({ prefix: folderRef });
  if (!files || files.length === 0) {
    throw new Error("No files found.");
  }

  return files;
}
