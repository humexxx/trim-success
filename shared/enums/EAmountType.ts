export const EAmountType = {
  DEFAULT: "default",
  MILLIS: "millis",
} as const;

export type EAmountType = (typeof EAmountType)[keyof typeof EAmountType];
