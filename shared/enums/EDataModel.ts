export const EDataModelParameterType = {
  GENERAL: "generales",
  STORING: "almacenaje",
  INVENTORY: "inventario",
} as const;

export type EDataModelParameterType =
  (typeof EDataModelParameterType)[keyof typeof EDataModelParameterType];

export const EDataModelParameterSubType = {
  FINACIAL: "financieros",
  OPERATIVE: "operacionales",
  COSTS: "costos",
  INVESTMENTS: "inversiones",
} as const;

export type EDataModelParameterSubType =
  (typeof EDataModelParameterSubType)[keyof typeof EDataModelParameterSubType];

export const ECalculatedParamameterType = {
  SALES: "sales",
  SALES_COST: "salesCost",
  INVENTORY_INVESTMENT: "inventoryInvestment",
} as const;

export type ECalculatedParamameterType =
  (typeof ECalculatedParamameterType)[keyof typeof ECalculatedParamameterType];
