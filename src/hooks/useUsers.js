"use client";

import {
  createUser,
  deleteUser,
  getAllUsers,
  patchUser,
  updateUser,
} from "@/services/userService.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// create user 

 export const useCreateUser = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createUser(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useUsers = (token, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["users", filters], // Include filters in query key
    queryFn: () => getAllUsers(token, filters),
    enabled: !!token,
    initialData: options.initialData,
    staleTime: 5 * 60 * 1000,
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

// export const usePatchUser = (token) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ userId, data }) => patchUser(token, userId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"]);
//     },
//   });
// };

export const useDeleteUser = (token) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => deleteUser(token, userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
