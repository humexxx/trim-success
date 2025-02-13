import { FIRESTORE_PATHS, STORAGE_PATH } from "@shared/consts";
import { ICallableRequest } from "@shared/models/functions";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const addAdminClaim = functions.https.onCall<ICallableRequest>(
  async (req) => {
    if (!req.auth || !req.auth.token.admin) {
      return { error: "Only admins can add other admins." };
    }

    const uid = req.data.uid;

    if (!uid) {
      return { error: "User ID is required." };
    }

    try {
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      return { message: `Successfully added admin claim to user ${uid}` };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  }
);

export const removeCubeData = functions.https.onCall<ICallableRequest>(
  async (req) => {
    if (!req.auth || !req.auth.token.admin) {
      return { error: "Only admins can remove cube data." };
    }

    const uid = req.data.uid;

    if (!uid) {
      return { error: "User ID is required." };
    }

    try {
      functions.logger.info(`Removing cube data for user ${uid}`);
      const bucket = admin.storage().bucket();
      await bucket.deleteFiles({ prefix: `${STORAGE_PATH}/${uid}` });

      const collection = await admin
        .firestore()
        .collection(FIRESTORE_PATHS.SETTINGS.INDEX(uid))
        .get();

      collection.forEach((doc) => doc.ref.delete());

      return { success: true };
    } catch (error) {
      return { error };
    }
  }
);
