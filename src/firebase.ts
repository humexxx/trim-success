import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzmS7TYxhpIVJEORwIP3f9s5nijfz_bgo",
  authDomain: "trim-success.firebaseapp.com",
  projectId: "trim-success",
  storageBucket: "trim-success.appspot.com",
  messagingSenderId: "1217526278",
  appId: "1:1217526278:web:05733dd88c3edf80caa187",
  measurementId: "G-6VQQFQKHXG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

export default app;
