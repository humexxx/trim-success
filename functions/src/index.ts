import "./fixTsPaths"; // This import is necessary to fix the paths for the typescript compiler
import * as admin from "firebase-admin";

admin.initializeApp();

export * from "./adminFunctions";
export * from "./userFunctions";
export * from "./aiFunctions";
export * from "./cubeFunctions";
export * from "./reportsFunctions";
