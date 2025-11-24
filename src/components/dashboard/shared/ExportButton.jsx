import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCSVExport } from "@/hooks/useCSVExport";

/**
 * Reusable Export to CSV Button
 * @param {Array} data - Data to export
 * @param {String} filename - Filename for the downloaded CSV
 * @param {Object} headers - Optional column mapping { key: "Display Name" }
 * @param {String} label - Button label (default: "Export CSV")
 * @param {String} className - Additional classes
 */
const ExportButton = ({
  data,
  filename,
  headers,
  label = "Export CSV",
  className = "",
  variant = "outline",
  size = "sm",
}) => {
  const { exportToCSV } = useCSVExport();

  const handleExport = () => {
    exportToCSV(data, filename, headers);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      className={`gap-2 ${className}`}
      disabled={!data || data.length === 0}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default ExportButton;
