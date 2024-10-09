import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { generateGeneralReport as _generateGeneralReport } from "./utils/reports";
import { IBaseData, IParamsData } from "@shared/models";

export const generateGeneralReport = functions.https.onCall(
  async (
    data,
    context
  ): Promise<{ success: boolean; data: any } | { error: string }> => {
    if (!context.auth) return { error: "Not authenticated." };
    const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    try {
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
        };

      const data = _generateGeneralReport(
        paramsData.data() as IParamsData,
        baseData.data() as IBaseData
      );

      return { success: true, data: JSON.stringify(data) };
    } catch (e: any) {
      return { error: e.message ?? e };
    }
  }
);
