"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import CapaSubmissionForm from "@/components/ui/fixAction/CapaSubmissionForm";

export default function MyProblemsPage() {
  const { user, token } = useAuthStore();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showCapaModal, setShowCapaModal] = useState(false);

  // Fetch problems assigned to current user
  const {
    data: myProblems,
    isLoading,
    error,
    refetch,
  } = useModuleData("problems", token, {
    enabled: !!user,
    additionalParams: {
      assignedTo: user?._id,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Loading your problems...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <AlertCircle className="h-8 w-8 text-destructive mr-2" />
        <span className="text-destructive">Failed to load problems</span>
      </div>
    );
  }

  const problems = myProblems?.data || [];

  const handleSubmitCapa = (problem) => {
    setSelectedProblem(problem);
    setShowCapaModal(true);
  };

  const getRiskBadgeVariant = (rating) => {
    switch (rating?.toLowerCase()) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Problems</h1>
        <p className="text-muted-foreground mt-1">
          Problems assigned to you for resolution
        </p>
      </div>

      {problems?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No problems assigned to you
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Problems assigned to you will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {problems?.map((problem) => (
            <Card
              key={problem._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {problem.description}
                    </p>
                  </div>
                  <Badge variant={getRiskBadgeVariant(problem.riskRating)}>
                    {problem.riskRating} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Impact:</span>{" "}
                      <span className="font-medium">{problem.impact}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Likelihood:</span>{" "}
                      <span className="font-medium">{problem.likelihood}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge variant="secondary" className="ml-1">
                        {problem.problemStatus}
                      </Badge>
                    </div>
                  </div>
                  {/* Only show Submit CAPA if status is Open */}
                  {problem.assignedTo?._id === user?._id &&
                  problem.problemStatus === "Open" ? (
                    <Button onClick={() => handleSubmitCapa(problem)}>
                      Submit CAPA
                    </Button>
                  ) : problem.problemStatus === "In Progress" ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      In Review
                    </Badge>
                  ) : problem.problemStatus === "Resolved" ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Resolved
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CAPA Modal */}
      {showCapaModal && selectedProblem && (
        <Modal
          isOpen={showCapaModal}
          onClose={() => {
            setShowCapaModal(false);
            setSelectedProblem(null);
          }}
          title="Submit CAPA for Problem"
          className="max-w-2xl"
        >
          <CapaSubmissionForm
            problem={selectedProblem}
            onClose={() => {
              setShowCapaModal(false);
              setSelectedProblem(null);
            }}
            onSuccess={() => {
              refetch();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
