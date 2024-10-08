import { TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";
import { IBaseData, IParamsData } from "../models";
import { formatCurrency, formatPercentage } from "./number";

const COMMON_TABLE_LAYOUT: TableLayout = {
  fillColor: function (rowIndex, node, columnIndex) {
    return rowIndex === 0 ? "#f0f0f0" : null;
  },
};

export function generateCategoriesReport(
  paramsData: IParamsData,
  baseData: IBaseData
): TDocumentDefinitions {
  return {
    content: [
      {
        text: "Category Report",
        style: "header",
      },
      {
        style: "table",
        table: {
          headerRows: 1,
          body: [
            [
              {
                text: "Rotulos de fila",
                style: "tableHeader",
              },
              ...paramsData.drivers
                .filter((x) => -1 !== x.columnIndexReference)
                .map((driver, index) => ({
                  text: `${index === 0 ? "Count of" : "Sum of"} ${driver.label}`,
                  style: "tableHeader",
                  alignment: "right",
                })),
            ],
            ...baseData.categoriesData.rows.map((row) => [
              {
                text: row.category,
                margin: [0, 5, 0, 5],
              },
              ...paramsData.drivers.map((driver, index) => ({
                text:
                  index === 0
                    ? row[driver.key]
                    : formatCurrency(row[driver.key] as number),
                margin: [0, 5, 0, 5],
                alignment: "right",
              })),
            ]),
            [
              {
                text: "Total",
                bold: true,
                alignment: "left",
                fillColor: "#f5a623",
                color: "white",
              },
              ...paramsData.drivers
                .filter((x) => -1 !== x.columnIndexReference)
                .map((driver, index) => ({
                  text:
                    index === 0
                      ? baseData.categoriesData.totals.SKUS
                      : formatCurrency(
                          baseData.categoriesData.totals[driver.key] as number
                        ),
                  bold: true,
                  alignment: "right",
                  fillColor: "#f5a623",
                  color: "white",
                })),
            ],
          ],
        },
        layout: COMMON_TABLE_LAYOUT,
      },
    ],
  } as TDocumentDefinitions;
}

export function generateDriversReport(
  paramsData: IParamsData,
  baseData: IBaseData
): TDocumentDefinitions {
  return {
    content: [
      {
        text: "Driver Report",
        style: "header",
      },
      {
        style: "table",
        table: {
          headerRows: 1,
          body: [
            [
              {
                text: "Driver",
                style: "tableHeader",
              },
              ...paramsData.categories.map((category) => ({
                text: category,
                style: "tableHeader",
                alignment: "right",
              })),
            ],
            ...baseData.driversData.rows.map((row) => [
              {
                text: row.driver,
                margin: [0, 5, 0, 5],
              },
              ...paramsData.categories.map((category) => ({
                text: formatPercentage(row[category] as number),
                margin: [0, 5, 0, 5],
                alignment: "right",
              })),
            ]),
          ],
        },
        layout: COMMON_TABLE_LAYOUT,
      },
    ],
  } as TDocumentDefinitions;
}

export function generateGeneralReport(
  paramsData: IParamsData,
  baseData: IBaseData
): TDocumentDefinitions {
  return {
    content: [
      ...(generateCategoriesReport(paramsData, baseData).content as any),
      ...(generateDriversReport(paramsData, baseData).content as any),
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 20, 0, 10],
      },
      table: {
        fontSize: 8,
        margin: [0, 5, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        fillColor: "#f0f0f0",
      },
    },
  };
}
