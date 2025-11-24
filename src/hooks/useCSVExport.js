/**
 * Custom hook to handle CSV export functionality
 * @returns {Object} exportToCSV function
 */
export const useCSVExport = () => {
  /**
   * Converts an array of objects to CSV format and triggers download
   * @param {Array} data - Array of objects to export
   * @param {String} filename - Name of the file to download (without extension)
   * @param {Object} headers - Optional mapping of keys to display names { key: "Display Name" }
   */
  const exportToCSV = (data, filename = "export", headers = null) => {
    if (!data || !data.length) {
      console.warn("No data to export");
      return;
    }

    // 1. Determine columns
    // If headers provided, use those keys. Otherwise use keys from first object.
    const columns = headers ? Object.keys(headers) : Object.keys(data[0]);

    // 2. Create CSV Header Row
    const headerRow = headers
      ? columns.map((col) => `"${headers[col]}"`).join(",")
      : columns.map((col) => `"${col}"`).join(",");

    // 3. Create CSV Data Rows
    const rows = data.map((row) => {
      return columns
        .map((col) => {
          let cell =
            row[col] === null || row[col] === undefined ? "" : row[col];

          // Handle objects (like nested user objects) - simple stringify
          if (typeof cell === "object") {
            cell = JSON.stringify(cell);
          }

          // Escape quotes and wrap in quotes
          cell = cell.toString().replace(/"/g, '""');
          return `"${cell}"`;
        })
        .join(",");
    });

    // 4. Combine Header and Rows
    const csvContent = [headerRow, ...rows].join("\n");

    // 5. Create Blob and Download Link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { exportToCSV };
};
