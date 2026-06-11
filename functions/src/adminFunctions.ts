import { FIRESTORE_PATHS, STORAGE_PATH } from "@shared/consts";
import { ICallableRequest, ICallableResponse } from "@shared/models/functions";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const addAdminClaim = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse> => {
    if (!req.auth || !req.auth.token.admin) {
      return { success: false, error: "Only admins can add other admins." };
    }

    const uid = req.data.uid;

    if (!uid) {
      return { success: false, error: "User ID is required." };
    }

    try {
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      return { success: true };
    } catch (error) {
      functions.logger.error("addAdminClaim failed", error);
      return { success: false, error: "Something went wrong" };
    }
  }
);

export const removeCubeData = functions.https.onCall<ICallableRequest>(
  async (req): Promise<ICallableResponse> => {
    if (!req.auth || !req.auth.token.admin) {
      return { success: false, error: "Only admins can remove cube data." };
    }

    const uid = req.data.uid;

    if (!uid) {
      return { success: false, error: "User ID is required." };
    }

    try {
      functions.logger.info(`Removing cube data for user ${uid}`);
      const bucket = admin.storage().bucket();
      await bucket.deleteFiles({ prefix: `${STORAGE_PATH}/${uid}` });

      const collection = await admin
        .firestore()
        .collection(FIRESTORE_PATHS.SETTINGS.INDEX(uid))
        .get();

      // forEach + .delete() fires-and-forgets — the function would
      // return success before the deletes finish. Await them all.
      await Promise.all(collection.docs.map((doc) => doc.ref.delete()));

      return { success: true };
    } catch (error) {
      // Don't leak raw Firebase/Node error objects to the client.
      functions.logger.error("removeCubeData failed", error);
      return { success: false, error: "Failed to remove cube data" };
    }
  }
);
