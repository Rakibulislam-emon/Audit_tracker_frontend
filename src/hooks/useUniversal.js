"use client";

import { universalConfig } from "@/config/dynamicConfig";
import { universalService } from "@/services/universalService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * ==================== CORE HOOKS (Low-Level) ====================
 * These work with ANY endpoint - they don't know about modules
 */

/**
 * HOOK 1: Universal Data Fetcher
 *
 * @param {string} token - JWT authentication token
 * @param {string} endpoint - Raw API endpoint like "users", "groups"
 * @param {object} filters - Query filters {search: "john", status: "active"}
 * @returns {object} - {data, isLoading, error, refetch}
 *
 * USAGE: const { data } = useUniversal(token, "users", {search: "john"})
 */
// original one
// export const useUniversal = (token, endpoint, filters = {}) => {
//   return useQuery({
//     // 💡 SMART CACHING: Each endpoint+filters combination gets its own cache
//     queryKey: [endpoint, filters],

//     // 💡 QUERY FUNCTION: Actually fetches data using our universal service
//     queryFn: () => universalService.getAll(token, endpoint, filters),
//     keepPreviousData: true,
//     // 💡 SECURITY: Only run if we have authentication
//     enabled: !!token,

//     // 💡 PERFORMANCE: Cache data for 5 minutes
//     staleTime: 5 * 60 * 1000,

//     // 💡 ERROR HANDLING: Don't retry on 4xx errors (bad requests)
//     retry: (failureCount, error) => {
//       if (error.message.includes("40")) return false; // 400, 401, 403, etc.
//       return failureCount < 3; // Retry others up to 3 times
//     },
//   });
// };

// testing

export const useUniversal = (token, endpoint, filters = {}) => {
  // 💡 CRITICAL FIX: Stabilize the query key by flattening the filters object.
  const filterKey = Object.entries(filters).flat();

  return useQuery({
    // 💡 UPDATED QUERY KEY: Uses the flattened array for stability
    queryKey: [endpoint, ...filterKey],

    queryFn: () => universalService.getAll(token, endpoint, filters),

    // Crucial for smooth filtering
    keepPreviousData: true,

    enabled: !!token,
    staleTime: 5 * 60 * 1000,

    retry: (failureCount, error) => {
      if (error?.message?.includes("40")) return false;
      return failureCount < 3;
    },
  });
};
/**
 * HOOK 2: Universal Data Creator
 *
 * @param {string} token - JWT token
 * @param {string} endpoint - API endpoint
 * @returns {object} - {mutate, isPending, error}
 *
 * USAGE: const { mutate: createItem } = useCreateUniversal(token, "users")
 *        createItem({name: "John", email: "john@example.com"})
 */
export const useCreateUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    // Mutation function that creates new items
    mutationFn: (data) => universalService.create(token, endpoint, data),

    // 💡 AUTOMATIC CACHE UPDATE: Refresh data after successful creation
    onSuccess: () => {
      // Invalidate ALL queries for this endpoint
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      console.log(`✅ Create success - ${endpoint} cache updated`);
    },

    // 💡 ERROR HANDLING: Log errors for debugging
    onError: (error) => {
      console.error(`❌ Create failed for ${endpoint}:`, error);
    },
  });
};

/**
 * HOOK 3: Universal Data Updater
 *
 * @param {string} token - JWT token
 * @param {string} endpoint - API endpoint
 * @returns {object} - {mutate, isPending, error}
 *
 * USAGE: const { mutate: updateItem } = useUpdateUniversal(token, "users")
 *        updateItem({id: "123", data: {name: "John Updated"}})
 */
export const useUpdateUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    // Needs both ID and data
    mutationFn: ({ id, data }) =>
      universalService.update(token, endpoint, id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      console.log(`✅ Update success - ${endpoint} cache updated`);
    },

    onError: (error) => {
      console.error(`❌ Update failed for ${endpoint}:`, error);
    },
  });
};

/**
 * HOOK 4: Universal Data Deleter
 *
 * @param {string} token - JWT token
 * @param {string} endpoint - API endpoint
 * @returns {object} - {mutate, isPending, error}
 *
 * USAGE: const { mutate: deleteItem } = useDeleteUniversal(token, "users")
 *        deleteItem("123") // Just the ID
 */
export const useDeleteUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    // Only needs ID to delete
    mutationFn: (id) => universalService.delete(token, endpoint, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      console.log(`✅ Delete success - ${endpoint} cache updated`);
    },

    onError: (error) => {
      console.error(`❌ Delete failed for ${endpoint}:`, error);
    },
  });
};

/**
 * ==================== MODULE HOOKS (High-Level) ====================
 * These use module names from config - MUCH easier to use!
 */

/**
 * HOOK 5: Module-Based Data Fetcher (RECOMMENDED)
 *
 * @param {string} module - Module name from config: "users", "groups", "companies"
 * @param {string} token - JWT token
 * @param {object} filters - Query filters
 * @returns {object} - {data, isLoading, error, refetch}
 *
 * FLOW: useModuleData("groups") → reads config → useUniversal("groups")
 *
 * USAGE: const { data: groups } = useModuleData("groups", token, {search: "tech"})
 */
export const useModuleData = (module, token, filters = {}) => {
  // 1. Get module configuration
  const config = universalConfig[module];

  // 2. Safety check - helpful for debugging
  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    throw new Error(`Module configuration not found: ${module}`);
  }

  // 3. Use core hook with configured endpoint
  return useUniversal(token, config.endpoint, filters);
};

/**
 * HOOK 6: Module-Based Data Creator
 *
 * @param {string} module - Module name: "users", "groups", "companies"
 * @param {string} token - JWT token
 * @returns {object} - {mutate, isPending, error}
 *
 * USAGE: const { mutate: createGroup } = useCreateModule("groups", token)
 *        createGroup({name: "Tech Team", description: "Technical department"})
 */
export const useCreateModule = (module, token) => {
  const config = universalConfig[module];

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useCreateUniversal(token, config.endpoint);
};

/**
 * HOOK 7: Module-Based Data Updater
 *
 * @param {string} module - Module name
 * @param {string} token - JWT token
 * @returns {object} - {mutate, isPending, error}
 */
export const useUpdateModule = (module, token) => {
  const config = universalConfig[module];

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useUpdateUniversal(token, config.endpoint);
};

/**
 * HOOK 8: Module-Based Data Deleter
 *
 * @param {string} module - Module name
 * @param {string} token - JWT token
 * @returns {object} - {mutate, isPending, error}
 */
export const useDeleteModule = (module, token) => {
  const config = universalConfig[module];
  // console.log('config:', config)

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useDeleteUniversal(token, config.endpoint);
};
