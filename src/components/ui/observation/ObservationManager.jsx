"use client";

import React, { useMemo } from "react";
import { useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuestionAssignments } from "@/hooks/useQuestionAssignments";
import { Loader2, AlertCircle } from "lucide-react";
import ObservationCard from "./ObservationCard";

/**
 * Ei component-ta "Observations" tab-er shob logic handle kore.
 * 1. Template theke shob Question load kore.
 * 2. Ei Session-er shob saved Observation load kore.
 * 3. Dui-ta-ke merge kore ekta list dekhay.
 */
export default function ObservationManager({
  session,
  onProblemCreated,
  readOnly = false,
  lockMessage = null,
}) {
  const { token, user } = useAuthStore();
  const { useSessionAssignments } = useQuestionAssignments();

  // --- 0. Identify Role ---
  const isLeadAuditor =
    (session.leadAuditor?._id || session.leadAuditor) ===
    (user?._id || user?.id);

  // --- 1. Load Questions (Template Based) ---
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useModuleData("questions", token, {
    template: session.template?._id,
    site: session.site?._id,
    limit: 1000,
  });

  // --- 2. Load Saved Observations ---
  const {
    data: observationsData,
    isLoading: isLoadingObservations,
    error: observationsError,
    refetch: refetchObservations,
  } = useModuleData("observations", token, {
    auditSession: session._id,
  });

  // --- 3. Load Assignments ---
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useSessionAssignments(session._id);

  // --- 4. Load Team Members (For Dropdown) ---
  const { data: teamData } = useModuleData("teams", token, {
    auditSession: session._id,
  });

  // --- 5. Merge Data & Filter ---
  const questionsWithAnswers = useMemo(() => {
    if (!questionsData || !observationsData) return [];

    const questions = questionsData.data || [];
    const observations = observationsData.data || [];
    const assignments = assignmentsData?.data || [];

    const observationMap = new Map(
      observations.map((obs) => [obs.question?._id || obs.question, obs])
    );
    const assignmentMap = new Map(
      assignments.map((asg) => [asg.question?._id || asg.question, asg])
    );

    const merged = questions.map((question) => ({
      question: question,
      savedObservation: observationMap.get(question._id) || null,
      currentAssignment: assignmentMap.get(question._id) || null,
    }));

    // --- FILTERING LOGIC ---
    // Removed assignment filtering - Any auditor can see all questions
    return merged;
  }, [questionsData, observationsData, assignmentsData]);

  // --- Loading / Error States ---
  if (isLoadingQuestions || isLoadingObservations || isLoadingAssignments) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="ml-2">Loading observations...</p>
      </div>
    );
  }

  if (questionsError || observationsError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <p>{questionsError?.message || observationsError?.message}</p>
      </div>
    );
  }

  if (questionsWithAnswers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
        {isLeadAuditor ? (
          <>
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No questions found for this template.</p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>You have no assigned observations for this session.</p>
          </>
        )}
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="space-y-4">
      {/* Lock Message */}
      {readOnly && lockMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              <strong>🔒 Read-Only Mode:</strong> {lockMessage}
            </p>
          </div>
        </div>
      )}

      {/* Pass readOnly to observation cards */}
      {/* Assignment Dropdown removed as per request */}
      {questionsWithAnswers.map(({ question, savedObservation }) => (
        <ObservationCard
          key={question._id}
          session={session}
          question={question}
          savedObservation={savedObservation}
          isLeadAuditor={isLeadAuditor}
          teamMembers={teamData?.data || []}
          onSave={() => {
            refetchObservations();
          }}
          onProblemCreated={onProblemCreated}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
