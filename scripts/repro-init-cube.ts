/**
 * Local repro of the initCube Cloud Function pipeline, run without Firebase.
 *
 * Reads files/db_v3.xlsx, runs the same parsing + calculation chain as the
 * production function, and prints the first error encountered. Lets us
 * find the bug behind "FirebaseError: INTERNAL" without needing to deploy
 * or tail Cloud Function logs.
 *
 * Run: npx tsx scripts/repro-init-cube.ts
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));

import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateInitialData,
  calculateInventoryPerformance,
  calculateScorecardData,
  generateCubeParameters,
} from "../functions/src/utils/cube";
import { DEFAULT_DRIVERS } from "../shared/consts";
import { EColumnType } from "../shared/enums";
import { EInventoryPerformaceMetricType } from "../shared/enums/EInventoryPerformaceMetricType";
import { ESystemColumnType } from "../shared/enums/ESystemColumnType";
import { getColumn, getRowValue } from "../shared/utils";

type RawSheet = [string[], ...(string | number)[][]];

function parseJsonData<T>(
  jsonData: RawSheet,
  options: { applyId: boolean } = { applyId: false }
) {
  const header = jsonData[0];
  const rowsData: T[] = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowObj = row.reduce(
      (
        acc: Record<string, string | number>,
        cell: string | number,
        index: number
      ) => {
        if (header[index] || cell) acc[header[index]] = cell;
        return acc;
      },
      {}
    );
    if (options.applyId) (rowObj as Record<string, unknown>).id = i - 1;
    rowsData.push(rowObj as T);
  }

  return { columns: header, rows: rowsData };
}

async function main() {
  const xlsxPath = resolve(__dirname, "..", "files", "db_v3.xlsx");
  console.log(`→ Reading ${xlsxPath}`);

  const buf = readFileSync(xlsxPath);
  const wb = XLSX.read(buf, { type: "buffer" });

  console.log(`→ Sheets in workbook: ${wb.SheetNames.join(", ")}`);

  if (wb.SheetNames.length < 2) {
    throw new Error(
      `Expected at least 2 sheets (cube + parameters); found ${wb.SheetNames.length}`
    );
  }

  const cubeRaw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]!]!, {
    header: 1,
    raw: true,
  }) as RawSheet;
  const paramsRaw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]!]!, {
    header: 1,
    raw: true,
  }) as RawSheet;

  console.log(
    `→ Cube sheet: ${cubeRaw.length - 1} rows, ${cubeRaw[0]?.length ?? 0} cols`
  );
  console.log(
    "→ Cube headers (raw):",
    cubeRaw[0]!.map((h, i) => `[${i}] ${JSON.stringify(h)}`).join("\n   ")
  );
  console.log(
    "→ Cube row 1 length:",
    cubeRaw[1]?.length,
    "values at 42-47:",
    (cubeRaw[1] ?? []).slice(42, 48)
  );
  console.log(
    "→ Object.keys of first parsed row:",
    Object.keys((function () {
      const header = cubeRaw[0]!;
      const row = cubeRaw[1] ?? [];
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < row.length; i++) {
        if (header[i] || row[i]) obj[header[i] as string] = row[i];
      }
      return obj;
    })()).map((k, i) => `[${i}] ${k}`)
  );
  console.log(
    `→ Params sheet: ${paramsRaw.length - 1} rows, ${paramsRaw[0]?.length ?? 0} cols`
  );

  const cubeDataModel = parseJsonData(cubeRaw, { applyId: true });
  const paramsDataModel = parseJsonData(paramsRaw);

  console.log("\n[step 1] calculateInitialData");
  const initial = calculateInitialData(cubeDataModel.rows as never);
  console.log({
    categories: initial.categories,
    sumSales: initial.sumSales,
    sumCostSales: initial.sumCostSales,
    sumCostInventory: initial.sumCostInventory,
  });

  console.log("\n[step 2] generateCubeParameters");
  const cubeParameters = generateCubeParameters(
    paramsDataModel as never,
    initial,
    DEFAULT_DRIVERS.filter((d) => d.key !== "PLANNERS" && d.key !== "ORDERS")
  );
  console.log({
    categories: cubeParameters.categories.length,
    drivers: cubeParameters.drivers.length,
    parameters: cubeParameters.parameters.length,
  });

  console.log("\n[step 3] calculateCategoriesDataRows");
  const categoriesRows = calculateCategoriesDataRows(
    cubeDataModel.rows as never,
    cubeParameters.drivers
  );
  console.log(`→ ${categoriesRows.length} category rows`);

  console.log("\n[step 4] calculateCategoriesTotalsData");
  const catTotals = calculateCategoriesTotalsData(
    categoriesRows,
    cubeParameters.drivers
  );
  console.log({ totalsKeys: Object.keys(catTotals) });

  console.log("\n[step 5] calculateDriversDataRows");
  const driversRows = calculateDriversDataRows(
    categoriesRows,
    catTotals,
    cubeParameters.drivers
  );
  console.log(`→ ${driversRows.length} driver rows`);
  console.log("→ driver labels:", driversRows.map((r) => r.driver));
  console.log("→ first cat row:", categoriesRows[0]);

  console.log("\n[step 6] calculateScorecardData");
  const baseData = {
    categoriesData: { rows: categoriesRows, totals: catTotals },
    driversData: { rows: driversRows },
  } as never;
  const scorecard = calculateScorecardData(cubeParameters, baseData);
  console.log({
    storingRows: scorecard.storingCosts.rows.length,
    inventoryRows: scorecard.inventoryCosts.rows.length,
    totalStoringCost: scorecard.storingCosts.totals.total,
    totalInventoryCost: scorecard.inventoryCosts.totals.total,
  });
  console.log(
    "→ storing per-category totals:",
    Object.fromEntries(
      cubeParameters.categories.map((c) => [c, scorecard.storingCosts.totals[c]])
    )
  );
  console.log(
    "→ scorecard.inventoryCosts.rows[0]:",
    scorecard.inventoryCosts.rows[0]
  );

  console.log("\n[step 7] calculateInventoryPerformance");
  const invPerf = calculateInventoryPerformance(
    cubeParameters.categories,
    baseData,
    scorecard
  );
  console.log({
    rows: invPerf.rows.length,
    keys: invPerf.rows.map((r) => r.key),
  });
  // What does an icrRow actually look like?
  const icrInspect = invPerf.rows.find(
    (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
  )!;
  console.log("→ icrRow:", JSON.stringify(icrInspect, null, 2));
  console.log("→ cubeParameters.categories:", cubeParameters.categories);

  // Count NaN values inside the calculated payloads — Firestore rejects NaN
  // and that throws as INTERNAL in callable functions.
  function countNonFinite(obj: unknown): number {
    if (obj === null || obj === undefined) return 0;
    if (typeof obj === "number") return Number.isFinite(obj) ? 0 : 1;
    if (Array.isArray(obj)) return obj.reduce<number>((a, b) => a + countNonFinite(b), 0);
    if (typeof obj === "object")
      return Object.values(obj as Record<string, unknown>).reduce<number>(
        (a, b) => a + countNonFinite(b),
        0
      );
    return 0;
  }
  console.log("\n→ NaN/Infinity counts in payloads (Firestore would reject):");
  console.log("  baseData:           ", countNonFinite(baseData));
  console.log("  scorecard:          ", countNonFinite(scorecard));
  console.log("  inventoryPerf:      ", countNonFinite(invPerf));
  console.log("  cubeParameters:     ", countNonFinite(cubeParameters));

  console.log("\n[step 8] augment cube rows with ICR/ICC/EV");
  const icrRow = invPerf.rows.find(
    (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
  )!;
  let nullIcr = 0;
  let nonFiniteIcc = 0;
  for (const row of cubeDataModel.rows as Record<string, unknown>[]) {
    const category = getRowValue(
      row as never,
      getColumn(EColumnType.CATEGORY).index!
    );
    const inventoryValue = getRowValue(
      row as never,
      getColumn(EColumnType.INVENTORY_VALUE).index!
    );
    const grossMargin = getRowValue(
      row as never,
      getColumn(EColumnType.GROSS_MARGIN).index!
    );
    const icrPercentage = Number(icrRow[category as string]);
    if (!Number.isFinite(icrPercentage)) nullIcr++;
    const icc = icrPercentage * Number(inventoryValue);
    if (!Number.isFinite(icc)) nonFiniteIcc++;
    row[ESystemColumnType.ICR_PERCENTAGE] = icrPercentage;
    row[ESystemColumnType.ICC] = icc;
    row[ESystemColumnType.EV] = Number(grossMargin) - icc;
  }
  console.log({
    totalRows: cubeDataModel.rows.length,
    nullIcr,
    nonFiniteIcc,
  });

  console.log("\n[step 9] estimate sizes — Firestore .set() limit is 1 MiB");
  const sizes = {
    dataMining: JSON.stringify(baseData).length,
    scorecard: JSON.stringify(scorecard).length,
    inventoryPerformance: JSON.stringify(invPerf).length,
    cubeParameters: JSON.stringify(cubeParameters).length,
    cubeJsonForStorage: JSON.stringify(cubeDataModel).length,
  };
  for (const [name, b] of Object.entries(sizes)) {
    const kb = (b / 1024).toFixed(1);
    const warn = b > 1024 * 1024 ? "  ❌ OVER 1 MiB" : "";
    console.log(`  ${name.padEnd(22)} ${kb.padStart(8)} KiB${warn}`);
  }

  console.log("\n✓ All steps completed without throwing");
}

main().catch((err) => {
  console.error("\n✗ Pipeline failed at:");
  console.error(err);
  process.exit(1);
});
