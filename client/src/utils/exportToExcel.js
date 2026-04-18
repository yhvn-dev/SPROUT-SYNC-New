import * as XLSX from "xlsx";

/**
 * Exports data to an Excel (.xlsx) file.
 *
 * @param {Object[]} data        - Array of objects to export
 * @param {string}   filename    - Output filename (without extension)
 * @param {string}   sheetName   - Sheet tab name (default: "Sheet1")
 */
export function exportToExcel(data, filename = "export", sheetName = "Sheet1") {
  if (!data || data.length === 0) {
    console.warn("exportToExcel: No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}


/**
 * Exports multiple sheets to a single Excel file.
 *
 * @param {Array<{ sheetName: string, data: Object[] }>} sheets
 * @param {string} filename
 */
export function exportMultiSheetToExcel(sheets, filename = "export") {
  if (!sheets || sheets.length === 0) {
    console.warn("exportMultiSheetToExcel: No sheets to export.");
    return;
  }

  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, data }) => {
    if (!data || data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || "Sheet");
  });

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}