import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { IBaseData, ICubeData, IParamsData } from "./models";
import {
  getUserCubeFile,
  processExcelFile,
  processJsonData,
} from "./utils/file";
import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateScorecardData,
} from "./utils/cube";
import { IScorecardData } from "./models/scorecardData";

export const getCubeData = functions.https.onCall(
  async (
    data,
    context
  ): Promise<ICubeData | { error: string; noParams?: boolean }> => {
    if (!context.auth) return { error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(`settings/${uid}/data/params`)
      .get();
    if (!paramsData.exists)
      return { error: "Params data not found.", noParams: true };

    const baseData = await admin
      .firestore()
      .doc(`settings/${uid}/data/base`)
      .get();
    if (!baseData.exists) return { error: "Base data not found." };

    const scorecardData = await admin
      .firestore()
      .doc(`settings/${uid}/data/scorecard`)
      .get();
    if (!scorecardData.exists) return { error: "Scorecard data not found." };

    return {
      baseData: baseData.data() as IBaseData,
      scorecardData: scorecardData.data() as IScorecardData,
      paramsData: paramsData.data() as IParamsData,
    };
  }
);

export const createBaseData = functions.https.onCall(
  async (data, context): Promise<{ success: boolean } | { error: string }> => {
    if (!context.auth) return { error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const baseData = await admin
      .firestore()
      .doc(`settings/${uid}/data/base`)
      .get();
    if (baseData.exists) return { success: true };

    try {
      const fileBuffer = await getUserCubeFile(uid);
      const jsonData = processExcelFile(fileBuffer);
      const { rows } = processJsonData(jsonData);

      const categoriesDataRows = calculateCategoriesDataRows(rows);
      const categoriesDataTotals =
        calculateCategoriesTotalsData(categoriesDataRows);
      const driversDataRows = calculateDriversDataRows(
        categoriesDataRows,
        categoriesDataTotals
      );

      await admin
        .firestore()
        .doc(`settings/${uid}/data/base`)
        .set({
          categoriesData: {
            rows: categoriesDataRows,
            totals: categoriesDataTotals,
          },
          driversData: {
            rows: driversDataRows,
          },
        });
    } catch (e: any) {
      return { error: e.message ?? e };
    }
    return { success: true };
  }
);

export const createScorecardData = functions.https.onCall(
  async (data, context): Promise<{ success: boolean } | { error: string }> => {
    if (!context.auth) return { error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const scorecardData = await admin
      .firestore()
      .doc(`settings/${uid}/data/scorecard`)
      .get();
    if (scorecardData.exists) return { success: true };

    const paramsData = await admin
      .firestore()
      .doc(`settings/${uid}/data/params`)
      .get();
    if (!paramsData.exists) return { error: "Params data not found." };

    const baseData = await admin
      .firestore()
      .doc(`settings/${uid}/data/base`)
      .get();
    if (!baseData.exists) return { error: "Base data not found." };

    try {
      const scorecardData = calculateScorecardData(
        paramsData.data() as IParamsData,
        baseData.data() as IBaseData
      );

      await admin.firestore().doc(`settings/${uid}/data/scorecard`).set({
        scorecardData,
      });
    } catch (e: any) {
      return { error: e.message ?? e };
    }
    return { success: true };
  }
);
