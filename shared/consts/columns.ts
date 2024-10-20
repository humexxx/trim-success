import { ESystemColumnType } from "@shared/enums/ESystemColumnType";
import { IColumn } from "@shared/models";

export const SYSTEM_COLUMNS: IColumn[] = [
  { code: ESystemColumnType.ICR_PERCENTAGE, name: "% ICR" },
  { code: ESystemColumnType.ICC, name: "ICC" },
  { code: ESystemColumnType.EV, name: "Valor Esperado" },
];
