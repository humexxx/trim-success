import { FIRESTORE_PATHS } from "@shared/consts";
import { EFileType } from "@shared/enums";
import { ICubeData, IFileData, IInitCube } from "@shared/models";
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
  getBucketFiles,
  getCubeDataModel,
  getCubeParamteres,
  getDataMining,
  getInventoryPerformanceData,
  getScorecardData,
} from "./utils/repository";

export const getCubeData = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse<ICubeData>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
    if (!uid) return { success: false, error: "User ID is required." };

    try {
      // Four independent reads — `Promise.all` cuts the worst-case
      // latency from sum-of-four to the slowest single read.
      const [cubeParameters, dataMining, scorecard, inventoryPerformance] =
        await Promise.all([
          getCubeParamteres(uid),
          getDataMining(uid),
          getScorecardData(uid),
          getInventoryPerformanceData(uid),
        ]);

      return {
        success: true,
        data: {
          baseData: dataMining,
          scorecardData: scorecard,
          cubeParameters,
          inventoryPerformanceData: inventoryPerformance,
        },
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      return { success: false, error: message };
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
    const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
    if (!uid) return { success: false, error: "User ID is required." };

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
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      return { success: false, error: message };
    }
  }
);

export const calculateDataMining = functions.https.onCall<ICallableRequest>(
  {
    memory: "1GiB",
  },
  async (req): Promise<ICallableResponse> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
    if (!uid) return { success: false, error: "User ID is required." };

    try {
      // Parallelize independent reads — they don't depend on each other.
      const [{ dataModel }, cubeParameters] = await Promise.all([
        getCubeDataModel(uid),
        getCubeParamteres(uid),
      ]);

      // Missing await — without it the function returned success while
      // the generation was still running, so the client thought the
      // mining was ready when it wasn't.
      await generateDataMining(uid, dataModel.rows, cubeParameters);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      return { success: false, error: message };
    }
    return { success: true };
  }
);

export const calculateScorecardData = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
    if (!uid) return { success: false, error: "User ID is required." };

    try {
      const [cubeParameters, dataMining] = await Promise.all([
        getCubeParamteres(uid),
        getDataMining(uid),
      ]);

      await generateScorecard(uid, cubeParameters, dataMining);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      return { success: false, error: message };
    }
    return { success: true };
  }
);

export const calculateInventoryPerformance =
  functions.https.onCall<ICallableRequest>(
    async (req): Promise<ICallableResponse> => {
      if (!req.auth) return { success: false, error: "Not authenticated." };
      const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
      if (!uid) return { success: false, error: "User ID is required." };

      try {
        // Three independent reads → fire them in parallel.
        const [cubeParameters, dataMining, scorecardData] = await Promise.all([
          getCubeParamteres(uid),
          getDataMining(uid),
          getScorecardData(uid),
        ]);

        await generateInventoryPerformance(
          uid,
          cubeParameters.categories,
          dataMining,
          scorecardData
        );
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return { success: false, error: message };
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
      const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
      if (!uid) return { success: false, error: "User ID is required." };

      try {
        const [{ dataModel, fileUid }, inventoryPerformance] =
          await Promise.all([
            getCubeDataModel(uid),
            getInventoryPerformanceData(uid),
          ]);

        await generateDataModelInventoryPerformance(
          uid,
          fileUid,
          dataModel,
          inventoryPerformance
        );
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return { success: false, error: message };
      }
      return { success: true };
    }
  );

export const getFiles = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse<IFileData[]>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth.uid;
    if (!uid) return { success: false, error: "User ID is required." };

    try {
      const files = await getBucketFiles(uid);

      return {
        success: true,
        data: files.map((file) => ({
          name: file.name,
          type: file.metadata.contentType as EFileType,
        })),
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      functions.logger.error("getFiles failed", e);
      return { success: false, error: message };
    }
  }
);
