import React, { forwardRef } from "react";

/**
 * Dashboard PDF Report Layout
 * A print-optimized component for generating the Executive Summary PDF
 * Uses inline styles to avoid html2canvas issues with CSS variables (oklch/lab)
 */
const DashboardPDFReport = forwardRef(({ data, userName, date }, ref) => {
  const { stats, auditProgress, riskMatrix, sitePerformance } = data;

  // Helper for safe color rendering
  const styles = {
    container: {
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: "32px",
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #000000",
      paddingBottom: "16px",
      marginBottom: "24px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#666666",
      marginTop: "4px",
    },
    scorecard: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "16px",
      marginBottom: "32px",
    },
    card: {
      border: "1px solid #e5e7eb",
      padding: "16px",
      borderRadius: "8px",
      textAlign: "center",
      backgroundColor: "#ffffff",
    },
    cardLabel: {
      fontSize: "12px",
      color: "#6b7280",
      textTransform: "uppercase",
      marginBottom: "4px",
    },
    cardValue: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "16px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      padding: "8px 16px",
      textAlign: "left",
      textTransform: "uppercase",
      fontSize: "12px",
      fontWeight: "600",
    },
    td: {
      padding: "8px 16px",
      borderBottom: "1px solid #e5e7eb",
    },
    footer: {
      marginTop: "auto",
      paddingTop: "32px",
      borderTop: "1px solid #e5e7eb",
      textAlign: "center",
      fontSize: "12px",
      color: "#6b7280",
    },
  };

  return (
    <div ref={ref} style={styles.container} id="dashboard-pdf-report">
      {/* 
        CRITICAL FIX: 
        Tailwind's global styles apply 'oklch' colors to borders and outlines on ALL elements (*).
        html2canvas crashes when parsing 'oklch'.
        We must explicitly reset these properties for the report container and all children.
      */}
      <style>{`
        #dashboard-pdf-report,
        #dashboard-pdf-report * {
          border-color: #e5e7eb; 
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Executive Audit Summary</h1>
          <p style={styles.subtitle}>Generated on {date}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "600" }}>{userName}</p>
          <p style={styles.subtitle}>Audit Management System</p>
        </div>
      </div>

      {/* Scorecard */}
      <div style={styles.scorecard}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Compliance Score</p>
          <p style={{ ...styles.cardValue, color: "#2563eb" }}>
            {stats?.complianceScore || 0}%
          </p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Active Audits</p>
          <p style={styles.cardValue}>{stats?.activeAuditSessions || 0}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Open Problems</p>
          <p style={{ ...styles.cardValue, color: "#dc2626" }}>
            {stats?.openProblems || 0}
          </p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Overdue Actions</p>
          <p style={{ ...styles.cardValue, color: "#ea580c" }}>
            {stats?.overdueItems || 0}
          </p>
        </div>
      </div>

      {/* Critical Risks & Progress */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "32px",
        }}
      >
        {/* Risk Summary */}
        <div>
          <h2 style={styles.sectionTitle}>Risk Overview</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                backgroundColor: "#fef2f2",
                borderRadius: "4px",
              }}
            >
              <span style={{ fontWeight: "500" }}>Critical Risks</span>
              <span style={{ fontWeight: "bold", color: "#b91c1c" }}>
                {riskMatrix
                  ?.filter(
                    (r) => r.impact === "Critical" || r.impact === "High"
                  )
                  .reduce((acc, curr) => acc + curr.count, 0) || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                backgroundColor: "#fefce8",
                borderRadius: "4px",
              }}
            >
              <span style={{ fontWeight: "500" }}>Moderate Risks</span>
              <span style={{ fontWeight: "bold", color: "#a16207" }}>
                {riskMatrix
                  ?.filter((r) => r.impact === "Medium")
                  .reduce((acc, curr) => acc + curr.count, 0) || 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                backgroundColor: "#f0fdf4",
                borderRadius: "4px",
              }}
            >
              <span style={{ fontWeight: "500" }}>Low Risks</span>
              <span style={{ fontWeight: "bold", color: "#15803d" }}>
                {riskMatrix
                  ?.filter((r) => r.impact === "Low")
                  .reduce((acc, curr) => acc + curr.count, 0) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Progress Summary */}
        <div>
          <h2 style={styles.sectionTitle}>Audit Progress</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {auditProgress?.slice(-3).map((month, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span style={{ width: "80px", fontWeight: "500" }}>
                  {month.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    margin: "0 12px",
                    height: "8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#2563eb",
                      width: `${
                        (month.completed / (month.planned || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <span style={{ color: "#4b5563" }}>
                  {month.completed}/{month.planned}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Failing Sites */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={styles.sectionTitle}>Lowest Performing Sites</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Site Name</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Audits</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {sitePerformance?.slice(0, 5).map((site, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{site.siteName}</td>
                <td style={{ ...styles.td, textAlign: "center" }}>
                  {site.auditCount}
                </td>
                <td
                  style={{
                    ...styles.td,
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  <span
                    style={{
                      color: site.complianceScore < 75 ? "#dc2626" : "#111827",
                    }}
                  >
                    {site.complianceScore}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>This report is confidential and intended for internal use only.</p>
        <p>&copy; {new Date().getFullYear()} Audit Tracker System</p>
      </div>
    </div>
  );
});

DashboardPDFReport.displayName = "DashboardPDFReport";

export default DashboardPDFReport;
