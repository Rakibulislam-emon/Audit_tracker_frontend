"use client";

import {
  deleteUser,
  getAllUsers,
  patchUser,
  updateUser,
} from "@/services/userService.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = (token, options = {}) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(token),
    enabled: !!token,
    initialData: options.initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUser = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => updateUser(token, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const usePatchUser = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => patchUser(token, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useDeleteUser = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => deleteUser(token, userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
