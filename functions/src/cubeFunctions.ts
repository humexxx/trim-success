import { FIRESTORE_PATHS } from "@shared/consts";
import { ICubeData, IInitCube } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { calculateInitialData, generateCubeParameters } from "./utils/cube";
import { generateDataModels } from "./utils/file";
import {
  generateDataMining,
  generateDataModelInventoryPerformance,
  generateInventoryPerformance,
  generateScorecard,
  getCubeDataModel,
  getCubeParamteres,
  getDataMining,
  getInventoryPerformanceData,
  getScorecardData,
} from "./utils/repository";

export const getCubeData = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse<ICubeData>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    try {
      const cubeParameters = await getCubeParamteres(uid);
      const dataMining = await getDataMining(uid);
      const scorecard = await getScorecardData(uid);
      const inventoryPerformance = await getInventoryPerformanceData(uid);

      return {
        success: true,
        data: {
          baseData: dataMining,
          scorecardData: scorecard,
          cubeParameters,
          inventoryPerformanceData: inventoryPerformance,
        },
      };
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
  }
);

export const initCube = functions.https.onCall<ICallableRequest<IInitCube>>(
  {
    memory: "2GiB",
    timeoutSeconds: 540,
  },
  async (req): Promise<ICallableResponse<ICubeData>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    const { fileUid, drivers } = req.data.data;

    try {
      const { cubeDataModel, parametersDataModel } = await generateDataModels(
        uid,
        fileUid
      );
      const initialData = calculateInitialData(cubeDataModel.rows);

      const cubeParameters = generateCubeParameters(
        parametersDataModel,
        initialData,
        drivers
      );

      await admin
        .firestore()
        .doc(FIRESTORE_PATHS.SETTINGS.PARAMS(uid))
        .set(cubeParameters);

      const dataMining = await generateDataMining(
        uid,
        cubeDataModel.rows,
        cubeParameters
      );

      const scorecard = await generateScorecard(
        uid,
        cubeParameters,
        dataMining
      );

      const inventoryPerformance = await generateInventoryPerformance(
        uid,
        cubeParameters.categories,
        dataMining,
        scorecard
      );

      await generateDataModelInventoryPerformance(
        uid,
        fileUid,
        cubeDataModel,
        inventoryPerformance
      );

      return {
        success: true,
        data: {
          baseData: dataMining,
          scorecardData: scorecard,
          cubeParameters: cubeParameters,
          inventoryPerformanceData: inventoryPerformance,
        },
      };
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
  }
);

export const calculateDataMining = functions.https.onCall<ICallableRequest>(
  {
    memory: "1GiB",
  },
  async (req): Promise<ICallableResponse> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    try {
      const { dataModel } = await getCubeDataModel(uid);
      const cubeParameters = await getCubeParamteres(uid);

      generateDataMining(uid, dataModel.rows, cubeParameters);
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

    try {
      const cubeParameters = await getCubeParamteres(uid);
      const dadtaMining = await getDataMining(uid);

      await generateScorecard(uid, cubeParameters, dadtaMining);
    } catch (e: any) {
      return { success: false, error: e };
    }
    return { success: true };
  }
);

export const calculateInventoryPerformance =
  functions.https.onCall<ICallableRequest>(
    async (req): Promise<ICallableResponse> => {
      if (!req.auth) return { success: false, error: "Not authenticated." };
      const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

      try {
        const cubeParameters = await getCubeParamteres(uid);
        const dataMining = await getDataMining(uid);
        const scorecardData = await getScorecardData(uid);

        await generateInventoryPerformance(
          uid,
          cubeParameters.categories,
          dataMining,
          scorecardData
        );
      } catch (e: any) {
        return { success: false, error: e };
      }
      return { success: true };
    }
  );

export const calculateDataModelInventoryPerformance =
  functions.https.onCall<ICallableRequest>(
    {
      memory: "1GiB",
    },
    async (req): Promise<ICallableResponse> => {
      if (!req.auth) return { success: false, error: "Not authenticated." };
      const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

      try {
        const { dataModel, fileUid } = await getCubeDataModel(uid);
        const inventoryPerformance = await getInventoryPerformanceData(uid);

        await generateDataModelInventoryPerformance(
          uid,
          fileUid,
          dataModel,
          inventoryPerformance
        );
      } catch (e: any) {
        return { success: false, error: e };
      }
      return { success: true };
    }
  );
