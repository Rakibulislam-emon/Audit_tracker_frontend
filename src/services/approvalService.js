import { universalConfig } from "@/config/dynamicConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const endpoint = "approvals";

export const approvalService = {
  approve: async (id, comments, token) => {
    const response = await fetch(`${baseUrl}/${endpoint}/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to approve request");
    }
    return response.json();
  },

  reject: async (id, comments, token) => {
    const response = await fetch(`${baseUrl}/${endpoint}/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reject request");
    }
    return response.json();
  },

  updateRequirement: async (id, index, completed, token) => {
    const response = await fetch(`${baseUrl}/${endpoint}/${id}/requirements`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requirementIndex: index, completed }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update requirement");
    }
    return response.json();
  },
};
