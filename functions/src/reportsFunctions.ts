import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { generateGeneralReport as _generateGeneralReport } from "./utils/reports";
import { IBaseData, IParamsData } from "@shared/models";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";

export const generateGeneralReport = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse<string>> => {
    if (!req.auth) return { success: false, error: "Not authenticated." };
    const uid = req.auth.token.admin ? req.data.uid : req.auth?.uid;

    try {
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

      const data = _generateGeneralReport(
        paramsData.data() as IParamsData,
        baseData.data() as IBaseData
      );

      return { success: true, data: JSON.stringify(data) };
    } catch (e: any) {
      return { success: false, error: e.message ?? e };
    }
  }
);
