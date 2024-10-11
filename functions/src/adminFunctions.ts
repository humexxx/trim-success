import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ICallableRequest } from "@shared/models/functions";

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
      console.log("Removing cube data for user", uid);

      const bucket = admin.storage().bucket();
      await bucket.deleteFiles({ prefix: `cubes/${uid}` });
      console.log("Deleted files from storage");

      const collection = await admin
        .firestore()
        .collection(`settings/${uid}/data`)
        .get();
      collection.forEach((doc) => doc.ref.delete());
      console.log("Deleted settings from firestore");

      return { success: true };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  }
);
