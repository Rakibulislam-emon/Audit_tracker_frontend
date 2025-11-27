/**
 * ✅ PRODUCTION-READY UNIVERSAL API SERVICE
 *
 * Features:
 * - Abort signal support for memory leak prevention
 * - Comprehensive error handling
 * - Request cancellation
 * - Performance optimizations
 */

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ REQUEST TIMEOUT HANDLER
const withTimeout = (promise, timeoutMs = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
};

export const universalService = {
  /**
   * ✅ PRODUCTION: GET ALL ITEMS with cancellation support
   */
  getAll: async (token, endpoint, filters = {}, signal = null) => {
    // Validate inputs
    if (!endpoint) throw new Error("Endpoint is required");

    try {
      // Build query parameters
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          params.append(key, String(value));
        }
      });

      const url = `${baseUrl}/${endpoint}${
        params.toString() ? `?${params}` : ""
      }`;

      const fetchPromise = fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        signal, // ✅ CRITICAL: Abort signal support
      });

      const response = await withTimeout(fetchPromise, 30000);

      // Check if request was cancelled
      if (signal?.aborted) {
        throw new Error("Request cancelled");
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [API] HTTP ${response.status} for ${endpoint}:`,
          errorText
        );
        throw new Error(
          `HTTP ${response.status} - Failed to fetch ${endpoint}`
        );
      }

      // Parse response
      const result = await response.json();

      // Validate response structure
      if (!result || typeof result !== "object") {
        throw new Error(`Invalid response format from ${endpoint}`);
      }

      return result;
    } catch (error) {
      // Handle cancellation gracefully
      if (
        error.name === "AbortError" ||
        error.message === "Request cancelled"
      ) {
        throw new Error("Request cancelled");
      }

      // Handle timeout
      if (error.message === "Request timeout") {
        console.error(`⏰ [API] Timeout for ${endpoint}`);
        throw new Error("Request timeout - please try again");
      }

      console.error(`❌ [API] Error for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * ✅ PRODUCTION: GET SINGLE ITEM BY ID
   */
  getById: async (token, endpoint, id, signal = null) => {
    if (!endpoint || !id) {
      throw new Error("Endpoint and ID are required");
    }

    try {
      const url = `${baseUrl}/${endpoint}/${id}`;

      const fetchPromise = fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        signal,
      });

      const response = await withTimeout(fetchPromise, 30000);

      if (signal?.aborted) {
        throw new Error("Request cancelled");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [API] HTTP ${response.status} for ${endpoint}/${id}:`,
          errorText
        );
        throw new Error(
          `HTTP ${response.status} - Failed to fetch ${endpoint}/${id}`
        );
      }

      const result = await response.json();

      if (!result || typeof result !== "object") {
        throw new Error(`Invalid response format from ${endpoint}/${id}`);
      }

      return result.data;
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.message === "Request cancelled"
      ) {
        throw new Error("Request cancelled");
      }

      if (error.message === "Request timeout") {
        console.error(`⏰ [API] Timeout for ${endpoint}/${id}`);
        throw new Error("Request timeout - please try again");
      }

      console.error(`❌ [API] Error for ${endpoint}/${id}:`, error);
      throw error;
    }
  },

  /**
   * ✅ PRODUCTION: CREATE NEW ITEM
   */
  create: async (token, endpoint, data, signal = null) => {
    if (!endpoint) throw new Error("Endpoint is required");
    if (!data || typeof data !== "object")
      throw new Error("Valid data is required");

    try {
      const fetchPromise = fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        signal,
      });

      const response = await withTimeout(fetchPromise, 30000);

      if (signal?.aborted) {
        throw new Error("Request cancelled");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [API] HTTP ${response.status} for create ${endpoint}:`,
          errorText
        );
        throw new Error(
          `HTTP ${response.status} - Failed to create ${endpoint}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.message === "Request cancelled"
      ) {
        throw new Error("Request cancelled");
      }

      if (error.message === "Request timeout") {
        console.error(`⏰ [API] Create timeout for ${endpoint}`);
        throw new Error("Create request timeout - please try again");
      }

      console.error(`❌ [API] Create failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * ✅ PRODUCTION: UPDATE EXISTING ITEM
   */
  update: async (token, endpoint, id, data, signal = null) => {
    if (!endpoint || !id) throw new Error("Endpoint and ID are required");
    if (!data || typeof data !== "object")
      throw new Error("Valid data is required");

    try {
      const fetchPromise = fetch(`${baseUrl}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        signal,
      });

      const response = await withTimeout(fetchPromise, 30000);

      if (signal?.aborted) {
        throw new Error("Request cancelled");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [API] HTTP ${response.status} for update ${endpoint}/${id}:`,
          errorText
        );
        throw new Error(
          `HTTP ${response.status} - Failed to update ${endpoint}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.message === "Request cancelled"
      ) {
        throw new Error("Request cancelled");
      }

      if (error.message === "Request timeout") {
        console.error(`⏰ [API] Update timeout for ${endpoint}/${id}`);
        throw new Error("Update request timeout - please try again");
      }

      console.error(`❌ [API] Update failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * ✅ PRODUCTION: DELETE ITEM
   */
  delete: async (token, endpoint, id, signal = null) => {
    if (!endpoint || !id) throw new Error("Endpoint and ID are required");

    try {
      const fetchPromise = fetch(`${baseUrl}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      const response = await withTimeout(fetchPromise, 30000);

      if (signal?.aborted) {
        throw new Error("Request cancelled");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [API] HTTP ${response.status} for delete ${endpoint}/${id}:`,
          errorText
        );
        throw new Error(
          `HTTP ${response.status} - Failed to delete ${endpoint}`
        );
      }

      // Handle both JSON and empty responses
      const contentLength = response.headers.get("Content-Length");
      let result;

      if (contentLength && contentLength !== "0") {
        result = await response.json();
      } else {
        result = { success: true, message: "Item deleted successfully" };
      }

      return result;
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.message === "Request cancelled"
      ) {
        throw new Error("Request cancelled");
      }

      if (error.message === "Request timeout") {
        console.error(`⏰ [API] Delete timeout for ${endpoint}/${id}`);
        throw new Error("Delete request timeout - please try again");
      }

      console.error(`❌ [API] Delete failed for ${endpoint}:`, error);
      throw error;
    }
  },
};
