"use client";

import { universalConfig } from "@/config/dynamicConfig";
import { universalService } from "@/services/universalService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

/**
 * ==================== PRODUCTION-READY HOOKS ====================
 * Optimized for performance, memory management, and error handling
 */

/**
 * ✅ PRODUCTION: Universal Data Fetcher with stable query keys and cancellation
 */
export const useUniversal = (token, endpoint, filters = {}) => {
  // ✅ STABLE QUERY KEY: Prevents infinite re-renders
  const queryKey = useMemo(() => {
    if (!filters || typeof filters !== "object") {
      return [endpoint];
    }

    // Create stable filter object with sorted keys
    const stableFilters = Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        const value = filters[key];
        // Only include meaningful values
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          acc[key] = value;
        }
        return acc;
      }, {});

    return [endpoint, stableFilters];
  }, [endpoint, JSON.stringify(filters)]); // Deep comparison

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      // ✅ PASS ABORT SIGNAL for request cancellation
      return await universalService.getAll(token, endpoint, filters, signal);
    },
    keepPreviousData: true,
    enabled: !!token && !!endpoint,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection

    // ✅ OPTIMIZED RETRY STRATEGY
    retry: (failureCount, error) => {
      // Don't retry cancelled requests
      if (error?.message === "Request cancelled") return false;

      // Don't retry client errors (4xx)
      if (error?.message?.includes("HTTP 4")) return false;

      // Don't retry auth errors
      if (error?.message?.includes("401") || error?.message?.includes("403"))
        return false;

      // Retry others max 2 times
      return failureCount < 2;
    },

    // ✅ ERROR HANDLING
    throwOnError: false,
  });
};

/**
 * ✅ PRODUCTION: Universal Data Creator with optimistic updates
 */
export const useCreateUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await universalService.create(token, endpoint, data);
    },

    // ✅ OPTIMISTIC UPDATE: Immediately update UI
    onMutate: async (newData) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: [endpoint] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData([endpoint]);

      // Optimistically update the cache
      if (previousData?.data && Array.isArray(previousData.data)) {
        queryClient.setQueryData([endpoint], (old) => ({
          ...old,
          data: [...old.data, { ...newData, _id: `temp-${Date.now()}` }],
          count: old.count + 1,
        }));
      }

      return { previousData };
    },

    // ✅ ROLLBACK ON ERROR
    onError: (error, newData, context) => {
      console.error(`❌ Create failed for ${endpoint}:`, error);
      if (context?.previousData) {
        queryClient.setQueryData([endpoint], context.previousData);
      }
    },

    // ✅ INVALIDATE QUERIES
    onSuccess: () => {
      // Debounced invalidation to prevent race conditions
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [endpoint],
          refetchType: "active",
        });
      }, 100);
    },

    // ✅ ALWAYS REFETCH ON SETTLEMENT
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

/**
 * ✅ PRODUCTION: Universal Data Updater
 */
export const useUpdateUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await universalService.update(token, endpoint, id, data);
    },

    // ✅ OPTIMISTIC UPDATE
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });

      const previousData = queryClient.getQueryData([endpoint]);

      // Optimistically update the specific item
      if (previousData?.data && Array.isArray(previousData.data)) {
        queryClient.setQueryData([endpoint], (old) => ({
          ...old,
          data: old.data.map((item) =>
            item._id === id ? { ...item, ...data } : item
          ),
        }));
      }

      return { previousData };
    },

    onError: (error, variables, context) => {
      console.error(`❌ Update failed for ${endpoint}:`, error);
      if (context?.previousData) {
        queryClient.setQueryData([endpoint], context.previousData);
      }
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      }, 100);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

/**
 * ✅ PRODUCTION: Universal Data Deleter
 */
export const useDeleteUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await universalService.delete(token, endpoint, id);
    },

    // ✅ OPTIMISTIC UPDATE
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });

      const previousData = queryClient.getQueryData([endpoint]);

      // Optimistically remove the item
      if (previousData?.data && Array.isArray(previousData.data)) {
        queryClient.setQueryData([endpoint], (old) => ({
          ...old,
          data: old.data.filter((item) => item._id !== id),
          count: old.count - 1,
        }));
      }

      return { previousData };
    },

    onError: (error, id, context) => {
      console.error(`❌ Delete failed for ${endpoint}:`, error);
      if (context?.previousData) {
        queryClient.setQueryData([endpoint], context.previousData);
      }
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      }, 100);
    },
  });
};

/**
 * ✅ PRODUCTION: Universal Single Item Fetcher
 */
export const useGetByIdUniversal = (token, endpoint, id) => {
  const queryKey = useMemo(() => [endpoint, id], [endpoint, id]);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (!id) throw new Error("ID is required");
      return await universalService.getById(token, endpoint, id, signal);
    },
    enabled: !!token && !!endpoint && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection

    retry: (failureCount, error) => {
      if (error?.message === "Request cancelled") return false;
      if (error?.message?.includes("HTTP 4")) return false;
      if (error?.message?.includes("404")) return false; // Not found
      return failureCount < 2;
    },

    throwOnError: false,
  });
};

/**
 * ==================== MODULE-BASED HOOKS ====================
 */

/**
 * ✅ PRODUCTION: Module-Based Data Fetcher
 */
export const useModuleData = (module, token, filters = {}) => {
  const config = universalConfig[module];

  if (!config) {
    console.warn(`⚠️ No configuration found for module: ${module}`);
    return {
      data: null,
      isLoading: false,
      error: new Error(`Module configuration not found: ${module}`),
      isError: true,
    };
  }

  return useUniversal(token, config.endpoint, filters);
};

/**
 * ✅ PRODUCTION: Module-Based Data Creator
 */
export const useCreateModule = (module, token) => {
  const config = universalConfig[module];

  if (!config) {
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useCreateUniversal(token, config.endpoint);
};

/**
 * ✅ PRODUCTION: Module-Based Data Updater
 */
export const useUpdateModule = (module, token) => {
  const config = universalConfig[module];

  if (!config) {
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useUpdateUniversal(token, config.endpoint);
};

/**
 * ✅ PRODUCTION: Module-Based Data Deleter
 */
export const useDeleteModule = (module, token) => {
  const config = universalConfig[module];

  if (!config) {
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useDeleteUniversal(token, config.endpoint);
};

/**
 * ✅ PRODUCTION: Module-Based Single Item Fetcher
 */
export const useModuleDataById = (module, token, id) => {
  const config = universalConfig[module];

  if (!config) {
    throw new Error(`Module configuration not found: ${module}`);
  }

  return useGetByIdUniversal(token, config.endpoint, id);
};

/**
 * ✅ PRODUCTION: Universal Custom Action Mutator
 */
export const useCustomAction = (token, { modulesToInvalidate = [] } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ endpoint, method = "POST", body }) => {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body || {}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}`,
        }));
        throw new Error(errorData.message || "Custom action failed");
      }

      return await response.json();
    },

    onSuccess: () => {
      // Invalidate specified modules
      modulesToInvalidate.forEach((moduleName) => {
        const endpoint = universalConfig[moduleName]?.endpoint;
        if (endpoint) {
          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: [endpoint],
              refetchType: "active",
            });
          }, 50);
        }
      });
    },

    onError: (error) => {
      console.error("❌ Custom Action failed:", error);
    },

    onSettled: () => {
      // Ensure data consistency
      modulesToInvalidate.forEach((moduleName) => {
        const endpoint = universalConfig[moduleName]?.endpoint;
        if (endpoint) {
          queryClient.invalidateQueries({ queryKey: [endpoint] });
        }
      });
    },
  });
};
