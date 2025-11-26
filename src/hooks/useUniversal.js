"use client";

import { universalConfig } from "@/config/dynamicConfig";
import { universalService } from "@/services/universalService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * ✅ FIXED: Stable filters hook (ESLint compliant)
 */
const useStableFilters = (filters = {}) => {
  return useMemo(() => {
    if (!filters || typeof filters !== "object") {
      return {};
    }

    return Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        const value = filters[key];
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
  }, [filters]);
};

/**
 * ✅ FIXED: Universal Data Fetcher (No lint errors)
 */
export const useUniversal = (token, endpoint, filters = {}) => {
  const stableFilters = useStableFilters(filters);
  
  const queryKey = useMemo(() => {
    return [endpoint, stableFilters];
  }, [endpoint, stableFilters]);

  const queryContext = useMemo(() => ({
    token,
    endpoint,
    filters
  }), [token, endpoint, filters]);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      return await universalService.getAll(
        queryContext.token, 
        queryContext.endpoint, 
        queryContext.filters, 
        signal
      );
    },
    keepPreviousData: true,
    enabled: !!token && !!endpoint,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message === "Request cancelled") return false;
      if (error?.message?.includes("HTTP 4")) return false;
      if (error?.message?.includes("401") || error?.message?.includes("403"))
        return false;
      return failureCount < 2;
    },
    throwOnError: false,
  });
};

/**
 * ✅ FIXED: Universal Single Item Fetcher (No lint errors)
 */
export const useGetByIdUniversal = (token, endpoint, id) => {
  const queryKey = useMemo(() => [endpoint, id], [endpoint, id]);

  const queryContext = useMemo(() => ({
    token,
    endpoint,
    id
  }), [token, endpoint, id]);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (!queryContext.id) throw new Error("ID is required");
      return await universalService.getById(
        queryContext.token, 
        queryContext.endpoint, 
        queryContext.id, 
        signal
      );
    },
    enabled: !!token && !!endpoint && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message === "Request cancelled") return false;
      if (error?.message?.includes("HTTP 4")) return false;
      if (error?.message?.includes("404")) return false;
      return failureCount < 2;
    },
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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });
      const previousData = queryClient.getQueryData([endpoint]);
      if (previousData?.data && Array.isArray(previousData.data)) {
        queryClient.setQueryData([endpoint], (old) => ({
          ...old,
          data: [...old.data, { ...newData, _id: `temp-${Date.now()}` }],
          count: old.count + 1,
        }));
      }
      return { previousData };
    },
    onError: (error, newData, context) => {
      console.error(`❌ Create failed for ${endpoint}:`, error);
      if (context?.previousData) {
        queryClient.setQueryData([endpoint], context.previousData);
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [endpoint],
          refetchType: "active",
        });
      }, 100);
    },
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
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });
      const previousData = queryClient.getQueryData([endpoint]);
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });
      const previousData = queryClient.getQueryData([endpoint]);
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
 * ✅ PRODUCTION: Module-Based Data Fetcher
 */
export const useModuleData = (module, token, filters = {}) => {
  const config = universalConfig[module];
  const universalResult = useUniversal(
    token, 
    config?.endpoint || 'fallback-endpoint',
    config ? filters : {}
  );

  if (!config) {
    console.warn(`⚠️ No configuration found for module: ${module}`);
    return {
      ...universalResult,
      data: null,
      isLoading: false,
      error: new Error(`Module configuration not found: ${module}`),
      isError: true,
    };
  }

  return universalResult;
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
      modulesToInvalidate.forEach((moduleName) => {
        const endpoint = universalConfig[moduleName]?.endpoint;
        if (endpoint) {
          queryClient.invalidateQueries({ queryKey: [endpoint] });
        }
      });
    },
  });
};