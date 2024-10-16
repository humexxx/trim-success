import { FIRESTORE_PATHS } from "@shared/consts";
import { IBaseData, IParamsData, IScorecardData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateScorecardData as _calculateScorecardData,
  calculateInventoryPerformance as _calculateInventoryPerformance,
} from "./utils/cube";
import { getJsonData, processJsonData } from "./utils/file";

export const getCubeData = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
      .get();
    if (!paramsData.exists)
      return { success: false, error: "Params data not found." };

    const baseData = await admin
      .firestore()
      .doc(FIRESTORE_PATHS.SETTINGS.BASE(uid))
      .get();
    if (!baseData.exists)
      return {
        success: false,
        error: "Base data not found.",
      };

    const scorecardData = await admin
      .firestore()
      .doc(FIRESTORE_PATHS.SETTINGS.SCORECARD(uid))
      .get();
    if (!scorecardData.exists)
      return {
        success: false,
        error: "Scorecard data not found.",
      };

    return {
      success: true,
      baseData: baseData.data() as IBaseData,
      scorecardData: scorecardData.data() as IScorecardData,
      paramsData: paramsData.data() as IParamsData,
    } as any;
  }
);

export const calculateDataMining = functions.https.onCall<ICallableRequest>(
  {
    memory: "1GiB",
  },
  async (req): Promise<ICallableResponse> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
      .get();
    if (!paramsData.exists)
      return { success: false, error: "Params data not found." };

    try {
      const jsonData = await getJsonData(uid);
      const { rows } = processJsonData(jsonData);

      const _paramsData = paramsData.data() as IParamsData;

      const categoriesDataRows = calculateCategoriesDataRows(
        rows,
        _paramsData.drivers
      );

      const categoriesDataTotals = calculateCategoriesTotalsData(
        categoriesDataRows,
        _paramsData.drivers
      );

      const driversDataRows = calculateDriversDataRows(
        categoriesDataRows,
        categoriesDataTotals,
        _paramsData.drivers
      );

      await admin
        .firestore()
        .doc(FIRESTORE_PATHS.SETTINGS.BASE(uid))
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
      return { success: false, error: e.message ?? e };
    }
    return { success: true };
  }
);

export const calculateScorecardData = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
      .get();
    if (!paramsData.exists)
      return { success: false, error: "Params data not found." };

    const baseData = await admin
      .firestore()
      .doc(FIRESTORE_PATHS.SETTINGS.BASE(uid))
      .get();
    if (!baseData.exists)
      return { success: false, error: "Base data not found." };

    try {
      const data = _calculateScorecardData(
        paramsData.data() as IParamsData,
        baseData.data() as IBaseData
      );

      await admin
        .firestore()
        .doc(FIRESTORE_PATHS.SETTINGS.SCORECARD(uid))
        .set({
          ...data,
        });
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
    return { success: true };
  }
);

export const calculateInventoryPerformance =
  functions.https.onCall<ICallableRequest>(
    async (req): Promise<ICallableResponse> => {
      if (!req.auth) return { success: false, error: "Not authenticated." };
      const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

      const paramsData = await admin
        .firestore()
        .doc(FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
        .get();
      if (!paramsData.exists)
        return { success: false, error: "Params data not found." };

      const baseData = await admin
        .firestore()
        .doc(FIRESTORE_PATHS.SETTINGS.BASE(uid))
        .get();
      if (!baseData.exists)
        return { success: false, error: "Base data not found." };

      const scorecardData = await admin
        .firestore()
        .doc(FIRESTORE_PATHS.SETTINGS.SCORECARD(uid))
        .get();
      if (!scorecardData.exists)
        return { success: false, error: "Scorecard data not found." };

      try {
        const data = _calculateInventoryPerformance(
          (paramsData.data() as IParamsData).categories,
          baseData.data() as IBaseData,
          scorecardData.data() as IScorecardData
        );

        await admin
          .firestore()
          .doc(FIRESTORE_PATHS.SETTINGS.INVENTORY_PERFORMANCE(uid))
          .set({
            ...data,
          });
      } catch (e: any) {
        return { success: false, error: e.message ?? e };
      }
      return { success: true };
    }
  );
