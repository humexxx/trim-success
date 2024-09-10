self.onmessage = function (event) {
  const jsonData = event.data;

  const header = jsonData[0];
  const rowsData = [];

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowObj = row.reduce(
      (acc, cell, index) => {
        acc[header[index]] = cell;
        return acc;
      },
      { id: i }
    );

    rowsData.push(rowObj);

    if (i % 10000 === 0) {
      self.postMessage({ progress: (i / jsonData.length) * 100 });
    }
  }

  const columns = header.map((col) => ({
    field: col,
    headerName: col,
  }));

  self.postMessage({ rows: rowsData, columns: columns });
  self.close();
};
