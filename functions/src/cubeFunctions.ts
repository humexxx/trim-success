import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getJsonData, processJsonData } from "./utils/file";
import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateScorecardData as _calculateScorecardData,
  calculateInventoryPerformance as _calculateInventoryPerformance,
} from "./utils/cube";
import {
  IBaseData,
  ICubeData,
  IParamsData,
  IScorecardData,
} from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";

export const getCubeData = functions.https.onCall(
  async (
    data: ICallableRequest,
    context
  ): Promise<(ICubeData & { error?: string }) | { error?: string }> => {
    if (!context.auth) return { error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(`settings/${uid}/data/params`)
      .get();
    if (!paramsData.exists) return { error: "Params data not found." };

    const baseData = await admin
      .firestore()
      .doc(`settings/${uid}/data/base`)
      .get();
    if (!baseData.exists)
      return {
        error: "Base data not found.",
        paramsData: paramsData.data() as IParamsData,
      };

    const scorecardData = await admin
      .firestore()
      .doc(`settings/${uid}/data/scorecard`)
      .get();
    if (!scorecardData.exists)
      return {
        error: "Scorecard data not found.",
        baseData: baseData.data() as IBaseData,
        paramsData: paramsData.data() as IParamsData,
      };

    return {
      baseData: baseData.data() as IBaseData,
      scorecardData: scorecardData.data() as IScorecardData,
      paramsData: paramsData.data() as IParamsData,
    };
  }
);

export const calculateDataMining = functions.https.onCall(
  async (data: ICallableRequest, context): Promise<ICallableResponse> => {
    if (!context.auth) return { success: false, error: "Not authenticated." };

    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(`settings/${uid}/data/params`)
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
      return { success: false, error: e.message ?? e };
    }
    return { success: true };
  }
);

export const calculateScorecardData = functions.https.onCall(
  async (data: ICallableRequest, context): Promise<ICallableResponse> => {
    if (!context.auth) return { success: false, error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(`settings/${uid}/data/params`)
      .get();
    if (!paramsData.exists)
      return { success: false, error: "Params data not found." };

    const baseData = await admin
      .firestore()
      .doc(`settings/${uid}/data/base`)
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
        .doc(`settings/${uid}/data/scorecard`)
        .set({
          ...data,
        });
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
    return { success: true };
  }
);

export const calculateInventoryPerformance = functions.https.onCall(
  async (data: ICallableRequest, context): Promise<ICallableResponse> => {
    if (!context.auth) return { success: false, error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    const paramsData = await admin
      .firestore()
      .doc(`settings/${uid}/data/params`)
      .get();
    if (!paramsData.exists)
      return { success: false, error: "Params data not found." };

    const baseData = await admin
      .firestore()
      .doc(`settings/${uid}/data/base`)
      .get();
    if (!baseData.exists)
      return { success: false, error: "Base data not found." };

    const scorecardData = await admin
      .firestore()
      .doc(`settings/${uid}/data/scorecard`)
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
        .doc(`settings/${uid}/data/inventoryPerformance`)
        .set({
          ...data,
        });
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
    return { success: true };
  }
);
