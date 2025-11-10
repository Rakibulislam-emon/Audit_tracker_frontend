"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateModule, useUpdateModule } from "@/hooks/useUniversal";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AlertTriangle,
  Loader2,
  Save,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";

// Helper function to capitalize severity
const capitalizeSeverity = (s) => {
  if (typeof s !== "string" || !s) return "Medium";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function ObservationCard({
  session,
  question,
  savedObservation,
  onSave,
}) {
  const { token } = useAuthStore();
  
  // ✅ --- (1) "STATE" FIX ---
  // Default state "null" chilo bhul (wrong). '??' operator babohar kore
  // amra ekhon `null` ba `undefined`-ke shothik-bhabe (correctly) handle korchi.
  const [response, setResponse] = useState(savedObservation?.response ?? null);
  
  const [severity, setSeverity] = useState(
    savedObservation?.severity ||
      capitalizeSeverity(question.severityDefault) ||
      "Medium"
  );
  const [comments, setComments] = useState(savedObservation?.comments || "");

  // --- API Hooks ---
  const { mutate: createObservation, isPending: isCreating } = useCreateModule(
    "observations",
    token
  );
  const { mutate: updateObservation, isPending: isUpdating } = useUpdateModule(
    "observations",
    token
  );
  const isPending = isCreating || isUpdating;

  // --- "Dirty" Check (Bug Fix) ---
  let isDirty = true; // Notun item-er jonno shobshomoy dirty
  if (savedObservation) {
    // Ekhon amra 'null' ebong 'undefined'-ke shothik-bhabe check korchi
    isDirty =
      (savedObservation.response ?? null) !== response ||
      savedObservation.severity !== severity ||
      (savedObservation.comments ?? "") !== comments;
  }

  // --- Event Handlers ---
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

  // ✅ --- (2) "SAVE" VALIDATION FIX ---
  const handleSave = () => {
    // Amader notun "shothik" (correct) validation logic
    let isValid = false;
    
    // Check 1: "0" ekta valid number
    if (question.responseType === "number" && (response === 0 || response === "0")) {
      isValid = true;
    } 
    // Check 2: "yes" ba "no" valid
    else if (response === "yes" || response === "no") {
      isValid = true;
    }
    // Check 3: Text field-e jodi kichu likha thake
    else if (question.responseType === "text" && typeof response === 'string' && response.trim() !== "") {
      isValid = true;
    }
    // Check 4: Number field-e jodi 0 chhara onno number thake
    else if (question.responseType === "number" && typeof response === 'string' && response.trim() !== "") {
        isValid = true;
    }

    if (!isValid) {
      toast.error("Please provide a valid response for this question.");
      return;
    }

    const observationData = {
      auditSession: session._id,
      template: session.template._id,
      question: question._id,
      questionText: question.questionText,
      response: response, // Ekhon shothik value-ta jacche
      severity: severity,
      comments: comments,
    };

    if (savedObservation) {
      // --- UPDATE ---
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
      // --- CREATE ---
      createObservation(observationData, {
        onSuccess: (res) => {
          toast.success("Observation saved!");
          onSave(res.data);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  // ✅ --- (3) "RENDER" FUNCTION FIX ---
  // "rating" ebong "dropdown" remove kora hoyeche
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
            value={response ?? ""} // ✅ 'null' holeo jeno crash na kore
            onChange={(e) => handleResponseChange(e.target.value)}
            disabled={isPending}
            className="w-full"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter a number..."
            value={response ?? ""} // ✅ 'null' holeo jeno crash na kore
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

  // --- Render Logic ---
  
  // ✅ --- (4) "SHOW" LOGIC FIX ---
  // Ekhon amra check korchi "response"-ta 'null' ba 'undefined' kina
  const hasResponded = response !== null && response !== undefined && response !== "";
  
  // "0" ekta valid response
  const hasRespondedOrIsZero = hasResponded || response === 0 || response === "0";

  const responseColor =
    response === "yes"
      ? "border-green-500"
      : response === "no"
      ? "border-red-500"
      : hasRespondedOrIsZero // Onno kono response thakle
      ? "border-blue-500" 
      : "border-gray-200";

  const showSeverity =
    (response === "no") ||
    (hasRespondedOrIsZero && question.responseType !== "yes/no");

  return (
    <div
      className={cn(
        "p-4 bg-white border-l-4 rounded-lg shadow-sm",
        responseColor
      )}
    >
      <div className="space-y-4">
        {/* 1. Proshno (The Question) */}
        <p className="font-medium text-gray-800">{question.questionText}</p>

        {/* 2. "Smart" Input Renderer */}
        {renderResponseInput()}

        {/* 3. "Smart" Severity Dropdown */}
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

        {/* 4. Comments Box */}
        {/* ✅ Ekhon "0" type korle-o comments box dekhabe */}
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
        
        {/* 5. Save Button */}
        {/* ✅ Ekhon "0" type korle-o save button dekhabe */}
        {hasRespondedOrIsZero && (
          <div className="flex justify-end">
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
  );
}