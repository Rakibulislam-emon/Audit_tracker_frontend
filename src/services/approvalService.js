// services/approvalService.js
import { universalConfig } from "@/config/dynamicConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const endpoint = universalConfig.approvals?.endpoint || "approvals";

export const createApprovalApi = async (data, token) => {
  console.log("🚀 Creating Approval Request:", data);
  const url = `${baseUrl}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`❌ HTTP Error ${response.status}:`, errorData);
      throw new Error(
        errorData.message ||
          `Failed to create approval request (Status: ${response.status})`
      );
    }

    const result = await response.json();
    console.log("✅ Approval creation response:", result);
    return result;
  } catch (error) {
    console.error("❌ Network Error during approval creation:", error);
    throw new Error(error.message || "Failed to create approval request.");
  }
};

export const approveApprovalApi = async (approvalId, comments = "", token) => {
  console.log("✅ Approving Approval:", approvalId);
  const url = `${baseUrl}/${endpoint}/${approvalId}/approve`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`❌ HTTP Error ${response.status}:`, errorData);
      throw new Error(
        errorData.message || `Failed to approve (Status: ${response.status})`
      );
    }

    const result = await response.json();
    console.log("✅ Approval response:", result);
    return result;
  } catch (error) {
    console.error("❌ Network Error during approval:", error);
    throw new Error(error.message || "Failed to approve request.");
  }
};

export const rejectApprovalApi = async (approvalId, comments = "", token) => {
  console.log("❌ Rejecting Approval:", approvalId);
  const url = `${baseUrl}/${endpoint}/${approvalId}/reject`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`❌ HTTP Error ${response.status}:`, errorData);
      throw new Error(
        errorData.message || `Failed to reject (Status: ${response.status})`
      );
    }

    const result = await response.json();
    console.log("✅ Rejection response:", result);
    return result;
  } catch (error) {
    console.error("❌ Network Error during rejection:", error);
    throw new Error(error.message || "Failed to reject request.");
  }
};

export const updateRequirementApi = async (
  approvalId,
  requirementIndex,
  completed,
  token
) => {
  console.log("📝 Updating Requirement:", {
    approvalId,
    requirementIndex,
    completed,
  });
  const url = `${baseUrl}/${endpoint}/${approvalId}/requirement`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requirementIndex, completed }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`❌ HTTP Error ${response.status}:`, errorData);
      throw new Error(
        errorData.message ||
          `Failed to update requirement (Status: ${response.status})`
      );
    }

    const result = await response.json();
    console.log("✅ Requirement update response:", result);
    return result;
  } catch (error) {
    console.error("❌ Network Error during requirement update:", error);
    throw new Error(error.message || "Failed to update requirement.");
  }
};

// services/approvalService.js - ADD BULK METHODS

/**
 * Bulk approve multiple approval requests
 */
export const bulkApproveApi = async (approvalIds, comments = '', token) => {
  console.log("✅ Bulk Approving Approvals:", approvalIds);
  const url = `${baseUrl}/${endpoint}/bulk/approve`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalIds, comments }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`❌ HTTP Error ${response.status}:`, errorData);
      throw new Error(errorData.message || `Failed to bulk approve (Status: ${response.status})`);
    }

    const result = await response.json();
    console.log("✅ Bulk approval response:", result);
    return result;
  } catch (error) {
    console.error("❌ Network Error during bulk approval:", error);
    throw new Error(error.message || "Failed to bulk approve requests.");
  }
};

/**
 * Bulk reject multiple approval requests
 */
export const bulkRejectApi = async (approvalIds, comments = '', token) => {
  console.log("❌ Bulk Rejecting Approvals:", approvalIds);
  const url = `${baseUrl}/${endpoint}/bulk/reject`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalIds, comments }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error(`❌ HTTP Error ${response.status}:`, errorData);
      throw new Error(errorData.message || `Failed to bulk reject (Status: ${response.status})`);
    }

    const result = await response.json();
    console.log("✅ Bulk rejection response:", result);
    return result;
  } catch (error) {
    console.error("❌ Network Error during bulk rejection:", error);
    throw new Error(error.message || "Failed to bulk reject requests.");
  }
};

// Update the service object
export const approvalService = {
  create: createApprovalApi,
  approve: approveApprovalApi,
  reject: rejectApprovalApi,
  updateRequirement: updateRequirementApi,
  bulkApprove: bulkApproveApi,    // ✅ NEW
  bulkReject: bulkRejectApi,      // ✅ NEW
};