import { Download } from "lucide-react";
import { exportToExcel } from "../utils/exportToExcel";

function ExcelDownloadBtn({ data, filename = "export", sheetName = "Sheet1" }) {
  const handleDownload = () => {
    exportToExcel(data, filename, sheetName);
  };

  return (
    <button
      onClick={handleDownload}
      className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
      style={{ backgroundColor: "#e6f4f1", color: "#027e69" }}>
      <Download size={13} />
      Download Excel
    </button>
  );
}


export default ExcelDownloadBtn;