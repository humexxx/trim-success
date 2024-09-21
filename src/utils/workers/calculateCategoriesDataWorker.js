self.onmessage = function (event) {
  const rows = event.data.rows;

  if (!rows) {
    self.postMessage({ error: "No rows provided" });
    self.close();
    return;
  }

  const { category: _category, drivers } = event.data;

  const response = {};

  for (let i = 0; i < rows.length; i++) {
    const category = getRowValue(rows[i], _category.index);
    if (!response[category]) {
      response[category] = {
        category,
        ...drivers.reduce((acc, driver) => {
          acc[driver.key] = 0;
          return acc;
        }, {}),
      };
    }

    for (let j = 0; j < drivers.length; j++) {
      if (drivers[j].key === "SKUS") {
        response[category][drivers[j].key]++;
      } else {
        response[category][drivers[j].key] += getRowValue(
          rows[i],
          drivers[j].columnIndexReference
        );
      }
    }

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
