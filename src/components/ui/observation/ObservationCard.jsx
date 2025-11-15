"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateModule,
  useModuleData,
  useUpdateModule,
} from "@/hooks/useUniversal";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AlertTriangle,
  Loader2,
  PlusCircle,
  Save,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProblemForm from "../problem/ProblemForm";

const capitalizeSeverity = (s) => {
  if (typeof s !== "string" || !s) return "Medium";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function ObservationCard({
  session,
  question,
  savedObservation,
  onSave,
  onProblemCreated,
}) {
  const { token } = useAuthStore();

  const [response, setResponse] = useState(savedObservation?.response ?? null);
  const [severity, setSeverity] = useState(
    savedObservation?.severity ||
      capitalizeSeverity(question.severityDefault) ||
      "Medium"
  );
  const [comments, setComments] = useState(savedObservation?.comments || "");
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);

  // API Hooks
  const { mutate: createObservation, isPending: isCreating } = useCreateModule(
    "observations",
    token
  );
  const { mutate: updateObservation, isPending: isUpdating } = useUpdateModule(
    "observations",
    token
  );

  const { data: problemData, refetch: refetchProblems } = useModuleData(
    "problems",
    token,
    { observation: savedObservation?._id },
    { enabled: !!savedObservation }
  );

  const linkedProblem = problemData?.data?.[0];
  const isPending = isCreating || isUpdating;

  // Dirty Check
  let isDirty = true;
  if (savedObservation) {
    isDirty =
      (savedObservation.response ?? null) !== response ||
      savedObservation.severity !== severity ||
      (savedObservation.comments ?? "") !== comments;
  }

  // Event Handlers
  const handleYesNoClick = (newResponse) => {
    setResponse(newResponse);
    if (newResponse === "no") {
      setSeverity("High");
    } else {
      setSeverity(capitalizeSeverity(question.severityDefault) || "Medium");
    }
  };

  const handleResponseChange = (value) => {
    setResponse(value);
  };

  // ✅ CORRECTED VALIDATION LOGIC
  const handleSave = () => {
    let isValid = false;
    let finalResponse = response;
    const { responseType } = question;

    switch (responseType) {
      case "yes/no":
        // Only "yes" or "no" are valid
        isValid = response === "yes" || response === "no";
        break;

      case "text":
        // Any non-empty string is valid
        isValid = typeof response === "string" && response.trim() !== "";
        finalResponse = response.trim();
        break;

      case "number":
        // Valid numbers: 0, positive, negative, decimals
        if (response === null || response === undefined || response === "") {
          isValid = false;
        } else {
          const numValue = Number(response);
          isValid = !isNaN(numValue) && isFinite(numValue);
          if (isValid) {
            finalResponse = numValue; // Convert to number for storage
          }
        }
        break;

      default:
        isValid = false;
        console.warn(`Unknown response type: ${responseType}`);
    }

    if (!isValid) {
      const errorMessages = {
        "yes/no": "Please select either Yes or No",
        text: "Please enter a text response",
        number: "Please enter a valid number",
      };
      toast.error(
        errorMessages[responseType] || "Please provide a valid response"
      );
      return;
    }

    const observationData = {
      auditSession: session._id,
      template: session.template._id,
      question: question._id,
      questionText: question.questionText,
      response: finalResponse,
      severity: severity,
      comments: comments,
    };

    if (savedObservation) {
      updateObservation(
        { id: savedObservation._id, data: observationData },
        {
          onSuccess: (res) => {
            toast.success("Observation updated!");
            onSave(res.data);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createObservation(observationData, {
        onSuccess: (res) => {
          toast.success("Observation saved!");
          onSave(res.data);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  // Render Response Input
  const renderResponseInput = () => {
    const { responseType } = question;

    switch (responseType) {
      case "yes/no":
        return (
          <div className="flex gap-2">
            <Button
              variant={response === "yes" ? "default" : "outline"}
              size="sm"
              onClick={() => handleYesNoClick("yes")}
              className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100 data-[state=on]:bg-green-600 data-[state=on]:text-white"
            >
              <ThumbsUp className="h-4 w-4 mr-2" /> Yes
            </Button>
            <Button
              variant={response === "no" ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleYesNoClick("no")}
            >
              <ThumbsDown className="h-4 w-4 mr-2" /> No
            </Button>
          </div>
        );

      case "text":
        return (
          <Textarea
            placeholder="Enter your observation..."
            value={response ?? ""}
            onChange={(e) => handleResponseChange(e.target.value)}
            disabled={isPending}
            className="w-full"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            step="any" // Allows decimals
            placeholder="Enter a number..."
            value={response ?? ""}
            onChange={(e) => handleResponseChange(e.target.value)}
            disabled={isPending}
            className="w-full md:w-1/2"
          />
        );

      default:
        return (
          <p className="text-red-500">
            Error: Unknown response type "{responseType}"
          </p>
        );
    }
  };

  // Render Logic
  const hasResponded =
    response !== null && response !== undefined && response !== "";
  const hasRespondedOrIsZero =
    hasResponded || response === 0 || response === "0";
  const isNegativeResponse = hasRespondedOrIsZero && response !== "yes";

  const responseColor =
    response === "yes"
      ? "border-green-500"
      : response === "no"
      ? "border-red-500"
      : hasRespondedOrIsZero
      ? "border-blue-500"
      : "border-gray-200";

  const showSeverity =
    response === "no" ||
    (hasRespondedOrIsZero && question.responseType !== "yes/no");

  return (
    <>
      <div
        className={cn(
          "p-4 bg-white border-l-4 rounded-lg shadow-sm",
          responseColor
        )}
      >
        <div className="space-y-4">
          <p className="font-medium text-gray-800">{question.questionText}</p>
          {renderResponseInput()}

          {showSeverity && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Severity
              </label>
              <Select
                value={severity}
                onValueChange={setSeverity}
                disabled={isPending}
              >
                <SelectTrigger className="w-full md:w-1/2">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[99]">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {hasRespondedOrIsZero && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Comments (Optional)
              </label>
              <Textarea
                placeholder="Add your comments or notes..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={isPending}
              />
            </div>
          )}

          {hasRespondedOrIsZero && (
            <div className="flex justify-between items-center pt-2">
              <div>
                {isNegativeResponse && (
                  <>
                    {linkedProblem ? (
                      <Button variant="outline" size="sm" disabled>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Problem Logged ({linkedProblem.problemStatus})
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsProblemModalOpen(true)}
                        disabled={!savedObservation}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Problem
                      </Button>
                    )}
                  </>
                )}
              </div>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending || (savedObservation && !isDirty)}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {savedObservation ? "Update" : "Save"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Problem Form Modal */}
      {isProblemModalOpen && (
        <Modal
          isOpen={isProblemModalOpen}
          onClose={() => setIsProblemModalOpen(false)}
        >
          <ProblemForm
            session={session}
            observation={savedObservation}
            question={question}
            onClose={() => setIsProblemModalOpen(false)}
            onProblemCreated={(newProblem) => {
              refetchProblems();
              if (onProblemCreated) onProblemCreated(newProblem);
            }}
          />
        </Modal>
      )}
    </>
  );
}
