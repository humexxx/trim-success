import * as functions from "firebase-functions";

import { generateGeneralReport as _generateGeneralReport } from "./utils/reports";

export const generateGeneralReport = functions.https.onCall(
  async (
    data,
    context
  ): Promise<{ success: boolean; data: any } | { error: string }> => {
    if (!context.auth) return { error: "Not authenticated." };
    // const uid = context.auth.token.admin ? data.uid : context.auth?.uid;

    try {
      const data = _generateGeneralReport();

      return { success: true, data: data };
    } catch (e: any) {
      return { error: e.message ?? e };
    }
  }
);
