export const EValueType = {
  COUNT: "qty",
  AMOUNT: "amount",
  PERCENTAGE: "percentage",
  OTHER: "other",
} as const;

export type EValueType = (typeof EValueType)[keyof typeof EValueType];
