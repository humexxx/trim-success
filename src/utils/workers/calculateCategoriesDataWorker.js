self.onmessage = function (event) {
  const rows = event.data.rows;

  if (!rows) {
    self.postMessage({ error: "No rows provided" });
    self.close();
    return;
  }

  const {
    category: _category,
    sumOfInvAvgQty,
    sumOfInvAvgValue,
    sumOfQtySent,
    sumOfCubageInvAvg,
    sumOfTotalSales,
    sumOfGrossMargin,
    sku,
  } = event.data;

  const response = {};

  for (let i = 0; i < rows.length; i++) {
    const category = getRowValue(rows[i], _category.index);
    if (!response[category]) {
      response[category] = {
        category,
        [sku.label]: 0,
        [sumOfInvAvgQty.label]: 0,
        [sumOfInvAvgValue.label]: 0,
        [sumOfQtySent.label]: 0,
        [sumOfCubageInvAvg.label]: 0,
        [sumOfTotalSales.label]: 0,
        [sumOfGrossMargin.label]: 0,
      };
    }
    response[category][sku.label]++;
    response[category][sumOfInvAvgQty.label] += getRowValue(
      rows[i],
      sumOfInvAvgQty.index
    );
    response[category][sumOfInvAvgValue.label] += getRowValue(
      rows[i],
      sumOfInvAvgValue.index
    );
    response[category][sumOfQtySent.label] += getRowValue(
      rows[i],
      sumOfQtySent.index
    );
    response[category][sumOfCubageInvAvg.label] += getRowValue(
      rows[i],
      sumOfCubageInvAvg.index
    );
    response[category][sumOfTotalSales.label] += getRowValue(
      rows[i],
      sumOfTotalSales.index
    );
    response[category][sumOfGrossMargin.label] += getRowValue(
      rows[i],
      sumOfGrossMargin.index
    );

    if (i % 10000 === 0) {
      self.postMessage({ progress: (i / rows.length) * 100 });
    }
  }

  self.postMessage({
    data: Object.values(response),
  });

  self.close();
};

function getRowValue(row, index) {
  const values = Object.values(row);
  return values[index + 1];
}
