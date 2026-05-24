import { IBaseData, ICubeParameters } from "@shared/models";
import { formatAmount, formatPercentage } from "@shared/utils";
import { Content, TableLayout, TDocumentDefinitions } from "pdfmake/interfaces";

const COMMON_TABLE_LAYOUT: TableLayout = {
  // pdfmake's `fillColor` signature passes (rowIndex, node, columnIndex);
  // only the row index matters here, so the other two are prefixed with
  // `_` to satisfy the unused-vars lint rule while keeping the right arity.
  fillColor: function (rowIndex, _node, _columnIndex) {
    return rowIndex === 0 ? "#f0f0f0" : null;
  },
};

export function generateCategoriesReport(
  cubeParameters: ICubeParameters,
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
              ...cubeParameters.drivers
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
              ...cubeParameters.drivers.map((driver, index) => ({
                text:
                  index === 0
                    ? row[driver.key]
                    : formatAmount(row[driver.key] as number),
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
              ...cubeParameters.drivers
                .filter((x) => -1 !== x.columnIndexReference)
                .map((driver, index) => ({
                  text:
                    index === 0
                      ? baseData.categoriesData.totals.SKUS
                      : formatAmount(
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
  cubeParameters: ICubeParameters,
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
              ...cubeParameters.categories.map((category) => ({
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
              ...cubeParameters.categories.map((category) => ({
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
  cubeParameters: ICubeParameters,
  baseData: IBaseData
): TDocumentDefinitions {
  // pdfmake's Content union is wide; cast each sub-report's content
  // to Content[] once instead of inline-`as any` on each spread.
  const categoriesContent = generateCategoriesReport(cubeParameters, baseData)
    .content as Content[];
  const driversContent = generateDriversReport(cubeParameters, baseData)
    .content as Content[];

  return {
    content: [...categoriesContent, ...driversContent],
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
