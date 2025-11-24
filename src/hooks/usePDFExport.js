import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Custom hook to handle PDF export functionality
 * @returns {Object} { exportToPDF, isExporting }
 */
export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Generates a PDF from a React component ref
   * @param {React.RefObject} contentRef - Ref to the element to capture
   * @param {String} filename - Name of the file to download
   */
  const exportToPDF = async (contentRef, filename = "report") => {
    if (!contentRef.current) {
      console.error("No content ref provided for PDF export");
      return;
    }

    try {
      setIsExporting(true);
      const element = contentRef.current;

      // 1. Capture the element as a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow loading cross-origin images
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // CRITICAL FIX: Remove all external stylesheets and style tags
          // This prevents html2canvas from parsing global Tailwind styles that use
          // unsupported color formats like 'oklch' or 'lab'.
          // Since DashboardPDFReport uses inline styles, it doesn't need these external sheets.
          const styles = clonedDoc.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          styles.forEach((s) => s.remove());

          // Also explicitly reset the body/html of the clone to avoid inherited variables
          clonedDoc.body.style.backgroundColor = "#ffffff";
          clonedDoc.body.style.color = "#000000";
        },
      });

      // 2. Calculate PDF dimensions (A4)
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate ratio to fit width
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0; // Start at top

      // 3. Add image to PDF
      // Note: For long content, we might need multi-page logic,
      // but for the Executive Summary, we aim for a single page.
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        (imgHeight * pdfWidth) / imgWidth
      );

      // 4. Save PDF
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPDF, isExporting };
};
