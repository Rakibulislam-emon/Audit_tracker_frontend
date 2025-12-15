"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useQuestionAssignments = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // --- 1. Get All Assignments for Session (Lead Auditor) ---
  const useSessionAssignments = (sessionId) => {
    return useQuery({
      queryKey: ["question-assignments", sessionId],
      queryFn: async () => {
        const res = await fetch(
          `${BASE_URL}/question-assignments/${sessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      },
      enabled: !!sessionId && !!token,
    });
  };

  // --- 2. Get My Assignments for Session (Auditor) ---
  const useMyAssignments = (sessionId) => {
    return useQuery({
      queryKey: ["question-assignments", "mine", sessionId],
      queryFn: async () => {
        const res = await fetch(
          `${BASE_URL}/question-assignments/${sessionId}/mine`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch my assignments");
        return res.json();
      },
      enabled: !!sessionId && !!token,
    });
  };

  // --- 3. Assign Question (Mutation) ---
  const useAssignQuestion = (sessionId) => {
    return useMutation({
      mutationFn: async ({ questionId, assignedTo }) => {
        const res = await fetch(`${BASE_URL}/question-assignments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            auditSession: sessionId,
            question: questionId,
            assignedTo,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to assign question");
        }
        return res.json();
      },
      onSuccess: () => {
        // Invalidate both lists to ensure UI updates for both lead and auditor
        queryClient.invalidateQueries(["question-assignments", sessionId]);
        queryClient.invalidateQueries([
          "question-assignments",
          "mine",
          sessionId,
        ]);
        toast.success("Question assigned successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // --- 4. Unassign Question (Mutation) ---
  const useUnassignQuestion = (sessionId) => {
    return useMutation({
      mutationFn: async (assignmentId) => {
        const res = await fetch(
          `${BASE_URL}/question-assignments/${assignmentId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to remove assignment");
        }
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["question-assignments", sessionId]);
        queryClient.invalidateQueries([
          "question-assignments",
          "mine",
          sessionId,
        ]);
        toast.success("Assignment removed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return {
    useSessionAssignments,
    useMyAssignments,
    useAssignQuestion,
    useUnassignQuestion,
  };
};
