"use client";

// ETA KI KORBE: React Query die data fetch, cache, update manage korbe

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { universalConfig } from "@/config/dynamicConfig";
import { universalService } from "@/services/universalService";

// 1. DATA FETCH HOOK - Table er data load korbe
export const useUniversal = (token, endpoint, filters = {}) => {
  return useQuery({
    queryKey: [endpoint, filters],
    queryFn: () => universalService.getAll(token, endpoint, filters),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

// 2. CREATE HOOK - New item create korbe
export const useCreateUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();
  console.log("🆕 useCreateUniversal hook for:", endpoint);

  return useMutation({
    mutationFn: (data) => universalService.create(token, endpoint, data),
 
    onSuccess: () => {
      // Success hole cache update korbe
      queryClient.invalidateQueries([endpoint]);
      console.log("✅ Create success - cache updated");
    },
    onError: (error) => {
      console.error("❌ Create failed:", error);
    },
  });

  // RETURN KORE: {mutate, isLoading, error}
};

// 3. UPDATE HOOK - Existing item update korbe
export const useUpdateUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();
  console.log("✏️ useUpdateUniversal hook for:", endpoint);

  return useMutation({
    mutationFn: ({ id, data }) =>
      universalService.update(token, endpoint, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([endpoint]);
      console.log("✅ Update success - cache updated");
    },
  });
};

// 4. DELETE HOOK - Item delete korbe
export const useDeleteUniversal = (token, endpoint) => {
  const queryClient = useQueryClient();
  console.log("🗑️ useDeleteUniversal hook for:", endpoint);

  return useMutation({
    mutationFn: (id) => universalService.delete(token, endpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries([endpoint]);
      console.log("✅ Delete success - cache updated");
    },
  });
};

// ========== NEW: MODULE-BASED HOOKS ==========

// 5. MODULE-BASED GET HOOK - Uses universalConfig
export const useModuleData = (module, token, filters = {}) => {
  const config = universalConfig[module];

  return useUniversal(token, config?.endpoint, filters);
};

// 6. MODULE-BASED CREATE HOOK - Uses universalConfig
export const useCreateModule = (module, token) => {
  const config = universalConfig[module];
  return useCreateUniversal(token, config?.endpoint);
};

// 7. MODULE-BASED UPDATE HOOK - Uses universalConfig
export const useUpdateModule = (module, token) => {
  const config = universalConfig[module];
  return useUpdateUniversal(token, config?.endpoint);
};

// 8. MODULE-BASED DELETE HOOK - Uses universalConfig
export const useDeleteModule = (module, token) => {
  const config = universalConfig[module];
  return useDeleteUniversal(token, config?.endpoint);
};
