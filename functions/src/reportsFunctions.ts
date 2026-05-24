import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import * as functions from "firebase-functions";

import { generateGeneralReport as _generateGeneralReport } from "./utils/reports";
import { getCubeParamteres, getDataMining } from "./utils/repository";

export const generateGeneralReport = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse<string>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    try {
      // Two independent reads — run them in parallel.
      const [cubeParameters, dataMining] = await Promise.all([
        getCubeParamteres(uid),
        getDataMining(uid),
      ]);

      const data = _generateGeneralReport(cubeParameters, dataMining);

      return { success: true, data: JSON.stringify(data) };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      functions.logger.error("generateGeneralReport failed", e);
      return { success: false, error: message };
    }
  }
);
