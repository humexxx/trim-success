interface ReportRow {
  SKUS: number;
  SHIPPED_CASES: number;
  GROSS_MARGIN: number;
  category: string;
  AVERAGE_INVENTORY: number;
  INVENTORY_VALUE: number;
  SALES: number;
  INVENTORY_CUBE: number;
}

interface ReportData {
  totals: ReportRow;
  rows: ReportRow[];
}

export function generateGeneralReport(): any {
  const data: ReportData = {
    totals: {
      SKUS: 45151,
      SHIPPED_CASES: 3778066,
      GROSS_MARGIN: 241013276.89,
      AVERAGE_INVENTORY: 1372352,
      INVENTORY_VALUE: 114794771.17,
      SALES: 595497776.45,
      INVENTORY_CUBE: 0,
      category: "Total",
    },
    rows: [
      {
        SKUS: 3881,
        SHIPPED_CASES: 2294631,
        GROSS_MARGIN: 51758983.85,
        category: "Tejido Punto",
        AVERAGE_INVENTORY: 990391,
        INVENTORY_VALUE: 41593531.13,
        SALES: 158707852.11,
        INVENTORY_CUBE: 0,
      },
      {
        SKUS: 36688,
        SHIPPED_CASES: 1113063,
        GROSS_MARGIN: 176629641.24,
        category: "Producto Principal",
        AVERAGE_INVENTORY: 337512,
        INVENTORY_VALUE: 69662415.53,
        SALES: 403684046.49,
        INVENTORY_CUBE: 0,
      },
    ],
  };

  const drivers = [
    { columnIndexReference: 0, label: "Sku's", key: "SKUS" },
    {
      columnIndexReference: 45,
      label: "Average Inventory",
      key: "AVERAGE_INVENTORY",
    },
    {
      columnIndexReference: 46,
      label: "$ Inventory Value",
      key: "INVENTORY_VALUE",
    },
    { columnIndexReference: 51, label: "Shipped Cases", key: "SHIPPED_CASES" },
    {
      columnIndexReference: 10,
      label: "Inventory Cube",
      key: "INVENTORY_CUBE",
    },
    { columnIndexReference: 42, label: "Sales", key: "SALES" },
    { columnIndexReference: 44, label: "Gross Margin", key: "GROSS_MARGIN" },
  ];

  // Estructura básica de la tabla
  const body = [];

  // Encabezados de las columnas
  const columns = [
    { text: "Category", style: "tableHeader" },
    ...drivers
      .filter((driver) => driver.columnIndexReference !== -1)
      .map((driver) => ({
        text: `Sum of ${driver.label}`,
        style: "tableHeader",
        alignment: "right",
      })),
  ];

  // Añadir encabezados al cuerpo
  body.push(columns);

  // Añadir filas de datos al cuerpo de la tabla
  data.rows.forEach((row) => {
    const dataRow = [
      { text: row.category, alignment: "left", margin: [0, 5, 0, 5] },
      ...drivers
        .filter((driver) => driver.columnIndexReference !== -1)
        .map((driver) => ({
          text: new Intl.NumberFormat("en-US").format((row as any)[driver.key]),
          alignment: "right",
          margin: [0, 5, 0, 5],
        })),
    ];
    body.push(dataRow);
  });

  // Fila de totales
  const totalsRow = [
    {
      text: "Total",
      bold: true,
      alignment: "left",
      fillColor: "#f5a623",
      color: "white",
    },
    ...drivers
      .filter((driver) => driver.columnIndexReference !== -1)
      .map((driver) => ({
        text: new Intl.NumberFormat("en-US").format(
          (data.totals as any)[driver.key]
        ),
        bold: true,
        alignment: "right",
        fillColor: "#f5a623",
        color: "white",
      })),
  ];
  body.push(totalsRow);

  // Definir el documento PDF
  const dd = {
    content: [
      { text: "Category Report", style: "header" },
      {
        text: new Date().toLocaleDateString(),
        alignment: "right",
        margin: [0, 0, 0, 20],
      },
      {
        style: "tableExample",
        table: {
          headerRows: 1,
          body: body,
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex % 2 === 0 ? "#f3f3f3" : null; // Alternar colores de las filas
          },
        },
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 20, 0, 10],
      },
      tableExample: {
        fontSize: 6,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        fillColor: "#f0f0f0",
      },
    },
  };

  return dd;
}
