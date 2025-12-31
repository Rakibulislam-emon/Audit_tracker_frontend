// src/components/ui/reports/ExportButton.jsx

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useExcelExport from "@/hooks/useExcelExport";
import { useCSVExport } from "@/hooks/useCSVExport";
import {
  Download,
  FileSpreadsheet,
  FileText,
  History,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Universal Export Button Component
 * Provides dropdown with multiple export format options
 */
export default function ExportButton({
  reportId,
  reportData,
  token,
  onExportHistory,
  compact = false,
}) {
  const [exportingFormat, setExportingFormat] = useState(null);

  const { exportToExcel, isExporting: isExportingExcel } = useExcelExport();
  const { exportReportToCSV, isExporting: isExportingCSV } = useCSVExport();

  // Check if we have either reportId or reportData
  const hasReport = reportId || reportData;

  /**
   * Handle Excel export
   */
  const handleExcelExport = async () => {
    if (!reportData) {
      toast.error("Report data is required for export");
      return;
    }

    setExportingFormat("excel");
    const toastId = toast.loading("Generating Excel file...");

    try {
      await exportToExcel(reportData);
      toast.success("Excel file downloaded successfully!", { id: toastId });

      // Track export if we have reportId
      if (reportId && token) {
        await trackExport(reportId, "excel", token);
      }
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to generate Excel file", { id: toastId });
    } finally {
      setExportingFormat(null);
    }
  };

  /**
   * Handle CSV export
   */
  const handleCSVExport = async () => {
    if (!reportData) {
      toast.error("Report data is required for export");
      return;
    }

    setExportingFormat("csv");
    const toastId = toast.loading("Generating CSV file...");

    try {
      await exportReportToCSV(reportData);
      toast.success("CSV file downloaded successfully!", { id: toastId });

      // Track export
      if (reportId && token) {
        await trackExport(reportId, "csv", token);
      }
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to generate CSV file", { id: toastId });
    } finally {
      setExportingFormat(null);
    }
  };

  /**
   * Handle PDF export (server-side)
   */
  const handlePDFExport = async (template = "standard") => {
    if (!reportId) {
      toast.error("Report ID is required for PDF export");
      return;
    }

    setExportingFormat("pdf");
    const toastId = toast.loading("Generating professional PDF...");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${reportId}/export/pdf`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ template }),
        }
      );

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // If response isn't JSON, simply use status text
        }
        throw new Error(`PDF generation failed: ${errorMessage}`);
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        reportData?.title?.replace(/[^a-z0-9]/gi, "_") || "report"
      }_${template}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(error.message || "Failed to generate PDF", { id: toastId });
    } finally {
      setExportingFormat(null);
    }
  };

  /**
   * Handle JSON export
   */
  const handleJSONExport = () => {
    if (!reportData) {
      toast.error("Report data is required for export");
      return;
    }

    setExportingFormat("json");
    const toastId = toast.loading("Generating JSON file...");

    try {
      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        reportData.title?.replace(/[^a-z0-9]/gi, "_") || "report"
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("JSON file downloaded successfully!", { id: toastId });

      // Track export
      if (reportId && token) {
        trackExport(reportId, "json", token);
      }
    } catch (error) {
      console.error("JSON export error:", error);
      toast.error("Failed to generate JSON file", { id: toastId });
    } finally {
      setExportingFormat(null);
    }
  };

  /**
   * Track export in database
   */
  const trackExport = async (reportId, format, token) => {
    try {
      // This is optional tracking - don't throw errors
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${reportId}/export/history`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ format }),
        }
      );
    } catch (error) {
      console.warn("Failed to track export:", error);
    }
  };

  const isExporting = exportingFormat !== null;

  if (!hasReport) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {!compact && "Export"}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Formats</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* PDF Export */}
        <DropdownMenuItem
          onClick={() => handlePDFExport("standard")}
          disabled={!reportId || isExporting}
        >
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          <div className="flex flex-col">
            <span className="font-medium">PDF (Standard)</span>
            <span className="text-xs text-gray-500">Professional format</span>
          </div>
        </DropdownMenuItem>

        {/* Excel Export */}
        <DropdownMenuItem
          onClick={handleExcelExport}
          disabled={!reportData || isExporting}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <div className="flex flex-col">
            <span className="font-medium">Excel (.xlsx)</span>
            <span className="text-xs text-gray-500">Multi-sheet workbook</span>
          </div>
        </DropdownMenuItem>

        {/* CSV Export */}
        <DropdownMenuItem
          onClick={handleCSVExport}
          disabled={!reportData || isExporting}
        >
          <FileText className="mr-2 h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="font-medium">CSV (.csv)</span>
            <span className="text-xs text-gray-500">
              Data analysis friendly
            </span>
          </div>
        </DropdownMenuItem>

        {/* JSON Export */}
        <DropdownMenuItem
          onClick={handleJSONExport}
          disabled={!reportData || isExporting}
        >
          <FileText className="mr-2 h-4 w-4 text-purple-500" />
          <div className="flex flex-col">
            <span className="font-medium">JSON (.json)</span>
            <span className="text-xs text-gray-500">Raw data format</span>
          </div>
        </DropdownMenuItem>

        {/* Export History */}
        {onExportHistory && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportHistory} disabled={isExporting}>
              <History className="mr-2 h-4 w-4" />
              <span>Export History</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
