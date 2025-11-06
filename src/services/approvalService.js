// src/services/approvalService.js
import { universalConfig } from "@/config/dynamicConfig";

// Base URL from environment variable
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// Get endpoint from config, provide a fallback
const endpoint = universalConfig.approvals?.endpoint || "approvals";

/**
 * Creates a new approval request using fetch.
 * @param {object} data - The approval request data (entityType, entityId, title, description, approver, priority).
 * @param {string} token - Authorization token.
 * @returns {Promise<object>} - The API response ({ data, message, success }).
 */
export const createApprovalApi = async (data, token) => {
  console.log("🚀 Creating Approval Request:", data);
  const url = `${baseUrl}/${endpoint}`; // POST /api/approvals
  console.log(`🌐 API Call: POST ${url}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json", // We are sending JSON data
      },
      body: JSON.stringify(data), // Stringify the data object
    });

    // Check if the response is ok (status code 2xx)
    if (!response.ok) {
      let errorData;
      try {
        // Try to parse JSON error response from backend
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        errorData = { message: response.statusText };
      }
      console.error(
        `❌ HTTP Error ${response.status} during approval creation:`,
        errorData
      );
      // Throw error with backend message or fallback
      throw new Error(
        errorData.message ||
          `Failed to create approval request (Status: ${response.status})`
      );
    }

    // Parse successful JSON response
    const result = await response.json();
    console.log("✅ Approval creation response:", result);

    // Check for explicit success flag from backend
    if (!result || !result.success) {
      throw new Error(
        result.message || "Backend reported an error during creation."
      );
    }
    return result;
  } catch (error) {
    // Catch network errors or errors thrown above
    console.error(
      "❌ Network or Parsing Error during approval creation:",
      error
    );
    throw new Error(error.message || "Failed to create approval request.");
  }
};

// Note: Other functions like approveRequestApi, rejectRequestApi can be added here later
// when building the "My Approvals" inbox page.
