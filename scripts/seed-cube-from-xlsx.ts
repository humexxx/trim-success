/**
 * Local replacement for the initCube Cloud Function. Runs the same
 * calculation chain against files/db_v3.xlsx and writes the results
 * straight to Firestore using the Admin SDK + your service account.
 *
 * Use when you can't (or don't want to) deploy the Cloud Functions:
 * this gets your UI rendering real dashboards in ~5 seconds with zero
 * function invocations and zero Storage uploads.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=~/secrets/trim-success-adminsdk.json \
 *     npx tsx scripts/seed-cube-from-xlsx.ts <user-email>
 *
 *   # default email if you omit the arg:
 *   npx tsx scripts/seed-cube-from-xlsx.ts
 */

import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateInitialData,
  calculateInventoryPerformance,
  calculateScorecardData,
  generateCubeParameters,
} from "../functions/src/utils/cube";
import { DEFAULT_DRIVERS, FIRESTORE_PATHS } from "../shared/consts";
import { EDriverType } from "../shared/enums";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_EMAIL = "demo@trim-success.test";

type RawSheet = [string[], ...(string | number)[][]];

function parseJsonData<T>(jsonData: RawSheet, opts = { applyId: false }) {
  const header = jsonData[0];
  const rows: T[] = [];
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const obj = row.reduce(
      (acc: Record<string, string | number>, cell, idx) => {
        if (header[idx] || cell) acc[header[idx]] = cell;
        return acc;
      },
      {}
    );
    if (opts.applyId) (obj as Record<string, unknown>).id = i - 1;
    rows.push(obj as T);
  }
  return { columns: header, rows };
}

async function main() {
  const email = process.argv[2] ?? DEFAULT_EMAIL;

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "trim-success",
  });

  console.log(`→ Looking up user ${email}`);
  const user = await admin.auth().getUserByEmail(email);
  const uid = user.uid;
  console.log(`  uid: ${uid}`);

  console.log(`→ Reading files/db_v3.xlsx`);
  const xlsxPath = resolve(__dirname, "..", "files", "db_v3.xlsx");
  const wb = XLSX.read(readFileSync(xlsxPath), { type: "buffer" });
  const cubeRaw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]!]!, {
    header: 1,
    raw: true,
  }) as RawSheet;
  const paramsRaw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]!]!, {
    header: 1,
    raw: true,
  }) as RawSheet;

  const cubeDataModel = parseJsonData(cubeRaw, { applyId: true });
  const paramsDataModel = parseJsonData(paramsRaw);
  console.log(`  ${cubeDataModel.rows.length} cube rows`);

  console.log("→ Running calculation chain");
  const initial = calculateInitialData(cubeDataModel.rows as never);
  const cubeParameters = generateCubeParameters(
    paramsDataModel as never,
    initial,
    DEFAULT_DRIVERS.filter(
      (d) => d.key !== EDriverType.PLANNERS && d.key !== EDriverType.ORDERS
    )
  );
  const categoriesRows = calculateCategoriesDataRows(
    cubeDataModel.rows as never,
    cubeParameters.drivers
  );
  const totals = calculateCategoriesTotalsData(
    categoriesRows,
    cubeParameters.drivers
  );
  const driversRows = calculateDriversDataRows(
    categoriesRows,
    totals,
    cubeParameters.drivers
  );
  const baseData = {
    categoriesData: { rows: categoriesRows, totals },
    driversData: { rows: driversRows },
  };
  const scorecard = calculateScorecardData(cubeParameters, baseData as never);
  const inventoryPerformance = calculateInventoryPerformance(
    cubeParameters.categories,
    baseData as never,
    scorecard
  );

  console.log("→ Writing 4 Firestore documents:");
  const db = admin.firestore();

  const writes = [
    { path: FIRESTORE_PATHS.SETTINGS.PARAMS(uid), data: cubeParameters },
    { path: FIRESTORE_PATHS.SETTINGS.BASE(uid), data: baseData },
    { path: FIRESTORE_PATHS.SETTINGS.SCORECARD(uid), data: scorecard },
    {
      path: FIRESTORE_PATHS.SETTINGS.INVENTORY_PERFORMANCE(uid),
      data: inventoryPerformance,
    },
  ];

  for (const w of writes) {
    await db.doc(w.path).set(w.data);
    console.log(`  ✓ ${w.path}`);
  }

  console.log(`\n✓ Done. Sign in at /login as ${email} / Demo1234! and open`);
  console.log("  /inventory/dashboard — should render with real numbers.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err);
  process.exit(1);
});
