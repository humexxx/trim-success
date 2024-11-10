import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import * as functions from "firebase-functions";

import { generateGeneralReport as _generateGeneralReport } from "./utils/reports";
import { getCubeParamteres, getDataMining } from "./utils/repository";

export const generateGeneralReport = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse<string>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    try {
      const cubeParameters = await getCubeParamteres(uid);
      const dataMining = await getDataMining(uid);

      const data = _generateGeneralReport(cubeParameters, dataMining);

      return { success: true, data: JSON.stringify(data) };
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
  }
);
