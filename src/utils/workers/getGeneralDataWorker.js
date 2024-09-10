self.onmessage = function (event) {
  const rows = event.data.rows;

  if (!rows) {
    self.postMessage({ error: "No rows provided" });
    self.close();
    return;
  }

  // Obtener los índices de las columnas necesarias
  const categoryIndex = event.data.categoryIndex;
  const totalSalesIndex = event.data.totalSalesIndex;
  const costSalesIndex = event.data.salesIndex;

  const categoriesSet = new Set();
  let sumSales = 0;
  let sumCostSales = 0;

  // Procesar filas
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Procesar categorías
    const category = getRowValue(row, categoryIndex);
    categoriesSet.add(category);

    // Sumar ventas totales
    const totalSales = getRowValue(row, totalSalesIndex);
    sumSales += totalSales;

    // Sumar costo de ventas
    const costSales = getRowValue(row, costSalesIndex);
    sumCostSales += costSales;

    // Enviar progreso cada 100,000 filas
    if (i % 10000 === 0) {
      self.postMessage({ progress: (i / rows.length) * 100 });
    }
  }

  // Devolver los resultados
  self.postMessage({
    categories: Array.from(categoriesSet),
    sumSales: parseFloat(sumSales.toFixed(2)),
    sumCostSales: parseFloat(sumCostSales.toFixed(2)),
  });

  self.close();
};

function getRowValue(row, index) {
  const values = Object.values(row);
  return values[index + 1];
}
