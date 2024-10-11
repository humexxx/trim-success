import * as admin from "firebase-admin";
import { auth } from "firebase-functions/v1";

export const createUserDocument = auth.user().onCreate(async (user) => {
  const { uid, email } = user;

  await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .set({
      email: email || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return null;
});
