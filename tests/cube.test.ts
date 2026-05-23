import { describe, expect, it } from "vitest";

import { DEFAULT_DRIVERS } from "@shared/consts";
import { EDriverType } from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import {
  calculateCategoriesDataRows,
  calculateCategoriesTotalsData,
  calculateDriversDataRows,
  calculateInitialData,
  calculateInventoryPerformance,
  calculateScorecardData,
  generateCubeParameters,
} from "../functions/src/utils/cube";

import { sampleCubeRows, sampleParameters } from "./fixtures";

const driversNoPlanners = DEFAULT_DRIVERS.filter(
  (d) => d.key !== EDriverType.PLANNERS && d.key !== EDriverType.ORDERS
);

function countNonFinite(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? 0 : 1;
  if (Array.isArray(value)) return value.reduce<number>((a, b) => a + countNonFinite(b), 0);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (a, b) => a + countNonFinite(b),
      0
    );
  }
  return 0;
}

describe("calculateInitialData", () => {
  it("collects unique categories from the rows", () => {
    const out = calculateInitialData(sampleCubeRows);
    expect(out.categories.sort()).toEqual(["A", "B"]);
  });

  it("sums SALES from the Ventas Totales column", () => {
    // 1000 + 1000 + 3000 = 5000
    const out = calculateInitialData(sampleCubeRows);
    expect(out.sumSales).toBe(5000);
  });

  it("sums COST_SALES from the Ventas al Costo column", () => {
    // 600 + 600 + 1800 = 3000
    // Regression guard for the db_v3.xlsx schema-drift bug — this
    // returned 0 before COLUMNS was aligned with the real layout.
    const out = calculateInitialData(sampleCubeRows);
    expect(out.sumCostSales).toBe(3000);
  });

  it("sums INVENTORY_VALUE from the Inventario Promedio $ column", () => {
    // 300 + 300 + 900 = 1500
    const out = calculateInitialData(sampleCubeRows);
    expect(out.sumCostInventory).toBe(1500);
  });
});

describe("calculateCategoriesDataRows", () => {
  it("groups rows by category and aggregates each driver", () => {
    const rows = calculateCategoriesDataRows(sampleCubeRows, driversNoPlanners);

    expect(rows).toHaveLength(2);
    const a = rows.find((r) => r.category === "A")!;
    const b = rows.find((r) => r.category === "B")!;

    // Category A: 2 SKUs (counter), $600+ $600 cost, $300+$300 inventory
    expect(a.SKUS).toBe(2);
    expect(a[EDriverType.SALES]).toBe(2000); // 1000 + 1000
    expect(a[EDriverType.COST_SALES]).toBe(1200); // 600 + 600
    expect(a[EDriverType.INVENTORY_VALUE]).toBe(600); // 300 + 300
    expect(a[EDriverType.GROSS_MARGIN]).toBe(800); // 400 + 400

    // Category B: 1 SKU
    expect(b.SKUS).toBe(1);
    expect(b[EDriverType.SALES]).toBe(3000);
    expect(b[EDriverType.COST_SALES]).toBe(1800);
    expect(b[EDriverType.INVENTORY_VALUE]).toBe(900);
  });

  it("throws when given an empty rows array", () => {
    expect(() => calculateCategoriesDataRows([], driversNoPlanners)).toThrow(
      /No rows provided/
    );
  });
});

describe("calculateDriversDataRows", () => {
  it("produces % share per category that sums to ~1.0", () => {
    const categoriesRows = calculateCategoriesDataRows(
      sampleCubeRows,
      driversNoPlanners
    );
    const totals = calculateCategoriesTotalsData(
      categoriesRows,
      driversNoPlanners
    );
    const driverRows = calculateDriversDataRows(
      categoriesRows,
      totals,
      driversNoPlanners
    );

    // Inventory Value driver: A = $600, B = $900 → totals 1500
    // %A = 600/1500 = 0.4; %B = 900/1500 = 0.6
    const invRow = driverRows.find((d) => d.driver === "$ Inventory Value")!;
    expect(invRow.A).toBeCloseTo(0.4, 6);
    expect(invRow.B).toBeCloseTo(0.6, 6);
    expect(Number(invRow.A) + Number(invRow.B)).toBeCloseTo(1, 6);
  });

  it("never produces NaN or Infinity even when a driver total is zero", () => {
    // Add a driver whose category totals are zero to trip the guard
    const categoriesRows = calculateCategoriesDataRows(
      sampleCubeRows,
      driversNoPlanners
    );
    // Force one driver total to 0 by zeroing the value in each row
    categoriesRows.forEach((r) => {
      r[EDriverType.SHIPPED_CASES] = 0;
    });
    const totals = calculateCategoriesTotalsData(
      categoriesRows,
      driversNoPlanners
    );
    const driverRows = calculateDriversDataRows(
      categoriesRows,
      totals,
      driversNoPlanners
    );

    expect(countNonFinite(driverRows)).toBe(0);
  });
});

describe("generateCubeParameters + scorecard + inventory performance", () => {
  it("end-to-end produces zero NaN/Infinity (Firestore-safe payload)", () => {
    // Regression for the FirebaseError: INTERNAL 500 — Firestore rejects
    // NaN, so any non-finite number in the calculated payload crashes
    // initCube before it can return.
    const initial = calculateInitialData(sampleCubeRows);
    const cubeParameters = generateCubeParameters(
      sampleParameters as never,
      initial,
      driversNoPlanners
    );
    const categoriesRows = calculateCategoriesDataRows(
      sampleCubeRows,
      cubeParameters.drivers
    );
    const totals = calculateCategoriesTotalsData(
      categoriesRows,
      cubeParameters.drivers
    );
    const driverRows = calculateDriversDataRows(
      categoriesRows,
      totals,
      cubeParameters.drivers
    );
    const baseData = {
      categoriesData: { rows: categoriesRows, totals },
      driversData: { rows: driverRows },
    } as never;

    const scorecard = calculateScorecardData(cubeParameters, baseData);
    const inventoryPerformance = calculateInventoryPerformance(
      cubeParameters.categories,
      baseData,
      scorecard
    );

    expect(countNonFinite(scorecard)).toBe(0);
    expect(countNonFinite(inventoryPerformance)).toBe(0);
    expect(countNonFinite(cubeParameters)).toBe(0);
  });

  it("scorecard storingCosts per-category totals sum to the grand total", () => {
    const initial = calculateInitialData(sampleCubeRows);
    const cubeParameters = generateCubeParameters(
      sampleParameters as never,
      initial,
      driversNoPlanners
    );
    const categoriesRows = calculateCategoriesDataRows(
      sampleCubeRows,
      cubeParameters.drivers
    );
    const totals = calculateCategoriesTotalsData(
      categoriesRows,
      cubeParameters.drivers
    );
    const driverRows = calculateDriversDataRows(
      categoriesRows,
      totals,
      cubeParameters.drivers
    );
    const baseData = {
      categoriesData: { rows: categoriesRows, totals },
      driversData: { rows: driverRows },
    } as never;

    const sc = calculateScorecardData(cubeParameters, baseData);

    const perCatSum = cubeParameters.categories.reduce(
      (s, c) => s + Number(sc.storingCosts.totals[c]),
      0
    );
    expect(perCatSum).toBeCloseTo(Number(sc.storingCosts.totals.total), 6);
  });

  it("inventory-performance ICR_PERCENTAGE total matches sum-of-costs / sum-of-inventory-value", () => {
    const initial = calculateInitialData(sampleCubeRows);
    const cubeParameters = generateCubeParameters(
      sampleParameters as never,
      initial,
      driversNoPlanners
    );
    const categoriesRows = calculateCategoriesDataRows(
      sampleCubeRows,
      cubeParameters.drivers
    );
    const totals = calculateCategoriesTotalsData(
      categoriesRows,
      cubeParameters.drivers
    );
    const driverRows = calculateDriversDataRows(
      categoriesRows,
      totals,
      cubeParameters.drivers
    );
    const baseData = {
      categoriesData: { rows: categoriesRows, totals },
      driversData: { rows: driverRows },
    } as never;

    const sc = calculateScorecardData(cubeParameters, baseData);
    const ip = calculateInventoryPerformance(
      cubeParameters.categories,
      baseData,
      sc
    );

    const icr = ip.rows.find(
      (r) => r.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
    )!;

    const expectedTotal =
      (Number(sc.inventoryCosts.totals.total) +
        Number(sc.storingCosts.totals.total)) /
      Number(totals[EDriverType.INVENTORY_VALUE]);

    expect(Number(icr.total)).toBeCloseTo(expectedTotal, 6);
  });
});
