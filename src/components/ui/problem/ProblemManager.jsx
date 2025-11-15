"use client";

import React from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

/**
 * Ei component-ta "Problems" tab-er shob logic handle kore.
 * Eti shudhu list dekhay ebong delete korte dey.
 */
export default function ProblemManager({
  session,
  problemList,
  isLoading,
  refetch,
}) {
  const { token } = useAuthStore();

  // --- Delete Hook ---
  const { mutate: deleteProblem, isPending: isDeleting } = useDeleteModule(
    "problems",
    token
  );

  const onRemoveProblem = (problemId) => {
    toast.warning("Are you sure you want to delete this problem?", {
      action: {
        label: "Confirm",
        onClick: () => {
          deleteProblem(problemId, {
            onSuccess: () => {
              toast.success("Problem deleted!");
              refetch(); // Problem list-take refresh kori
            },
            onError: (err) => toast.error(err.message),
          });
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  // --- Render Logic ---
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="divide-y">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
            Loading problems...
          </div>
        )}
        {!isLoading && problemList.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <AlertCircle className="h-4 w-4 inline-block mr-2" />
            No problems have been logged for this session yet.
          </div>
        )}
        {problemList.map((problem) => (
          <div
            key={problem._id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div className="font-medium">{problem.title}</div>
              <div className="text-sm text-gray-500">
                {problem.description.substring(0, 70)}...
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium bg-red-100 text-red-700 px-2 py-1 rounded">
                {problem.riskRating} Risk
              </span>
              <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                {problem.problemStatus}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveProblem(problem._id)}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}