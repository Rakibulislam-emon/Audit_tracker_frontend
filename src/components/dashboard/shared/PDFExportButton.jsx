import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { usePDFExport } from "@/hooks/usePDFExport";
import DashboardPDFReport from "@/components/dashboard/reports/DashboardPDFReport";

/**
 * PDF Export Button Component
 * Renders a button and a hidden report template.
 * When clicked, generates a PDF of the report.
 */
export default function PDFExportButton({ data, userName }) {
  const { exportToPDF, isExporting } = usePDFExport();
  const reportRef = useRef(null);

  const handleExport = () => {
    const dateStr = new Date().toLocaleDateString();
    exportToPDF(
      reportRef,
      `Audit_Executive_Summary_${dateStr.replace(/\//g, "-")}`
    );
  };

  // If no data, disable button
  const isDisabled = !data || isExporting;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={isDisabled}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        {isExporting ? "Generating..." : "Export Report"}
      </Button>

      {/* Hidden Report Template - Rendered off-screen but visible to html2canvas */}
      <div className="fixed left-[-9999px] top-0">
        <DashboardPDFReport
          ref={reportRef}
          data={data}
          userName={userName}
          date={new Date().toLocaleDateString()}
        />
      </div>
    </>
  );
}
