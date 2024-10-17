import { COLUMNS, DEFAULT_DRIVERS, SYSTEM_COLUMNS } from "@shared/consts";
import { EColumnType, EDriverType } from "@shared/enums";
import { ESystemColumnType } from "@shared/enums/ESystemColumnType";
import { IColumn } from "@shared/models";

export function getColumnIndex(column: EColumnType): number | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.index;
}

export function getColumnIndexRange(column: EColumnType): number[] | undefined {
  const col = COLUMNS.find((col) => col.code === column);
  return col?.indexRange;
}

export function getRowValue(
  row: Record<string, string | number>,
  index: number
): string | number {
  const values = Object.values(row);
  return values[index];
}

export function getRowValues(
  row: Record<string, string | number>,
  indexRange: number[]
): (string | number)[] {
  const values = Object.values(row);
  return indexRange.map((i) => values[i]);
}

export function getColumn(
  columnType: EColumnType | ESystemColumnType
): IColumn {
  if (Object.values(EColumnType).includes(columnType as EColumnType)) {
    return COLUMNS.find((col) => col.code === columnType)!;
  } else {
    return SYSTEM_COLUMNS.find((col) => col.code === columnType)!;
  }
}

export function getDriver(driverType: EDriverType) {
  return DEFAULT_DRIVERS.find((driver) => driver.key === driverType)!;
}
