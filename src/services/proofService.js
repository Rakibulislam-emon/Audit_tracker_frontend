// src/services/proofService.js
import { universalConfig } from "@/config/dynamicConfig";

// Base URL from environment variable
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// Get endpoint from config, provide a fallback
const endpoint = universalConfig.proofs?.endpoint || "proofs";

/**
 * Uploads a proof file along with related data using FormData and fetch.
 * @param {FormData} formData - FormData object with 'file' and relation fields.
 * @param {string} token - Authorization token.
 * @returns {Promise<object>} - The API response ({ data, message, success }).
 */
export const uploadProofApi = async (formData, token) => {
  console.log("📤 Uploading Proof data:", Object.fromEntries(formData)); // Log form data (excluding file content)
  const url = `${baseUrl}/${endpoint}`;
  console.log(`🌐 API Call: POST ${url}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        // 'Content-Type': 'multipart/form-data' // fetch sets this automatically for FormData
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
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
        `❌ HTTP Error ${response.status} during upload:`,
        errorData
      );
      // Throw error with backend message or fallback
      throw new Error(
        errorData.message || `Upload failed with status ${response.status}`
      );
    }

    // Parse successful JSON response
    const result = await response.json();
    console.log("✅ Proof upload response:", result);

    // Check for explicit success flag from backend
    if (!result || !result.success) {
      throw new Error(
        result.message || "Backend reported an error during upload."
      );
    }

    return result; // Should contain { data, message, success }
  } catch (error) {
    // Catch network errors or errors thrown above
    console.error("❌ Network or Parsing Error during proof upload:", error);
    throw new Error(
      error.message || "Upload failed due to a network or unexpected error."
    );
  }
};

/**
 * Updates proof metadata (like caption or status) using fetch PATCH.
 * @param {string} proofId - The ID of the proof to update.
 * @param {object} updateData - Object with fields to update (e.g., { caption, status }).
 * @param {string} token - Authorization token.
 * @returns {Promise<object>} - The API response ({ data, message, success }).
 */
export const updateProofApi = async (proofId, updateData, token) => {
  console.log(`✏️ Updating Proof ID: ${proofId} with data:`, updateData);
  const url = `${baseUrl}/api/${endpoint}/${proofId}`;
  console.log(`🌐 API Call: PATCH ${url}`);

  try {
    const response = await fetch(url, {
      method: "PATCH", // Use PATCH for partial updates
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json", // Sending JSON for metadata updates
      },
      body: JSON.stringify(updateData), // Stringify the update data
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(
        `❌ HTTP Error ${response.status} during update:`,
        errorData
      );
      throw new Error(
        errorData.message || `Update failed with status ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Proof update response:", result);

    if (!result || !result.success) {
      throw new Error(
        result.message || "Backend reported an error during update."
      );
    }
    return result;
  } catch (error) {
    console.error("❌ Network or Parsing Error during proof update:", error);
    throw new Error(error.message || "Update failed");
  }
};

/**
 * Deletes a proof record from DB and Cloudinary using fetch.
 * @param {string} proofId - The ID of the proof to delete.
 * @param {string} token - Authorization token.
 * @returns {Promise<object>} - The API response ({ message, success, data? }).
 */
export const deleteProofApi = async (proofId, token) => {
  console.log(`🗑️ Deleting Proof ID: ${proofId}`);
  const url = `${baseUrl}/api/${endpoint}/${proofId}`;
  console.log(`🌐 API Call: DELETE ${url}`);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
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
        `❌ HTTP Error ${response.status} during delete:`,
        errorData
      );
      throw new Error(
        errorData.message || `Delete failed with status ${response.status}`
      );
    }

    // Handle empty response body common with DELETE
    const contentType = response.headers.get("content-type");
    let result;
    if (
      contentType &&
      contentType.indexOf("application/json") !== -1 &&
      response.status !== 204
    ) {
      // 204 No Content
      result = await response.json();
    } else {
      // Assume success if status is ok (200, 204) and no JSON body
      result = {
        success: true,
        message: `Proof deleted successfully (Status: ${response.status})`,
      };
    }

    console.log("✅ Proof delete response:", result);
    // We might not always get a success flag from backend on DELETE, rely on HTTP status
    // if (!result.success) {
    //     throw new Error(result.message || "Backend reported an error during deletion.");
    // }
    return result;
  } catch (error) {
    console.error("❌ Network or Parsing Error during proof delete:", error);
    throw new Error(error.message || "Delete failed");
  }
};

// Note: Function to get proofs (getAll) should be handled by universalService.getAll
// If you need a specific getProofById function:
/*
export const getProofByIdApi = async (proofId, token) => { ... fetch logic ... };
*/
