/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"
);

self.onmessage = function (e) {
  const { workbook, sheet } = e.data;

  const worksheet = workbook.Sheets[sheet];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: true,
  });

  if (jsonData.length > 0) {
    self.postMessage({ status: "success", data: jsonData });
  } else {
    self.postMessage({
      status: "error",
      message: "No data found in the file.",
    });
  }
};
