// src/services/reportService.js

import { universalConfig } from "@/config/dynamicConfig";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const endpoint = universalConfig.reports?.endpoint || "reports";

/**
 * Calls the backend endpoint to auto-generate a report from an audit session.
 * @param {string} auditSessionId - The ID of the audit session.
 * @param {string} token - Authorization token.
 * @returns {Promise<object>} - The API response ({ data, message, success }).
 */
export const generateReportApi = async (auditSessionId, token) => {
  console.log(`🚀 Generating Report for Audit Session ID: ${auditSessionId}`);
  const url = `${baseUrl}/${endpoint}/generate`; // POST /api/reports/generate
  console.log(`🌐 API Call: POST ${url}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auditSessionId }), // Send session ID in body
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(
        `❌ HTTP Error ${response.status} during report generation:`,
        errorData
      );
      // Backend-এর নির্দিষ্ট এরর মেসেজ (যেমন "Report already exists") পাস করা
      throw new Error(
        errorData.message || `Generation failed with status ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Report generation response:", result);

    if (!result || !result.success) {
      throw new Error(
        result.message || "Backend reported an error during generation."
      );
    }
    return result;
  } catch (error) {
    console.error(
      "❌ Network or Parsing Error during report generation:",
      error
    );
    throw new Error(error.message || "Report generation failed.");
  }
};

// Add to services/reportService.js - AFTER your existing functions

/**
 * Submit report for approval
 * Follows your exact service pattern with consistent error handling
 */
export const submitReportForApprovalApi = async (reportId, token) => {
  console.log(`🚀 Submitting Report for Approval ID: ${reportId}`);
  const url = `${baseUrl}/${endpoint}/${reportId}/submit`; // POST /api/reports/:id/submit
  console.log(`🌐 API Call: POST ${url}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(
        `❌ HTTP Error ${response.status} during report submission:`,
        errorData
      );
      throw new Error(
        errorData.message || `Submission failed with status ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Report submission response:", result);

    if (!result || !result.success) {
      throw new Error(
        result.message || "Backend reported an error during submission."
      );
    }
    return result;
  } catch (error) {
    console.error(
      "❌ Network or Parsing Error during report submission:",
      error
    );
    throw new Error(error.message || "Report submission failed.");
  }
};