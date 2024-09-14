/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"
);

self.onmessage = function (e) {
  const file = e.data;
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
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
    } catch (error) {
      self.postMessage({ status: "error", message: error.message });
    }
  };

  reader.onerror = () => {
    self.postMessage({ status: "error", message: "Error reading file." });
  };

  reader.readAsArrayBuffer(file);
};
