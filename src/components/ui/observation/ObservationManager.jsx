"use client";

import React, { useMemo } from "react";
import { useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2, AlertCircle } from "lucide-react";
import ObservationCard from "./ObservationCard";

/**
 * Ei component-ta "Observations" tab-er shob logic handle kore.
 * 1. Template theke shob Question load kore.
 * 2. Ei Session-er shob saved Observation load kore.
 * 3. Dui-ta-ke merge kore ekta list dekhay.
 */
export default function ObservationManager({ session }) {
  const { token } = useAuthStore();

  // --- 1. Shob Proshno (Questions) Load Kori ---
  // Shudhu oi proshno-gulo ani ja ei session-er template-e ache
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useModuleData("questions", token, {
    template: session.template?._id, // Template ID diye filter kori
    limit: 1000, // Shob proshno ani
  });

  // --- 2. Shob Save Kora Uttor (Observations) Load Kori ---
  // Shudhu ei session-er jonno
  const {
    data: observationsData,
    isLoading: isLoadingObservations,
    error: observationsError,
    refetch: refetchObservations, // ✅ Save/Update korle list refresh korar jonno
  } = useModuleData("observations", token, {
    auditSession: session._id, // Session ID diye filter kori
  });

  // --- 3. Data Merge Kori (Shobcheye Guruttopurno Step) ---
  // Amra 'questions' ebong 'observations'-ke eksathe "join" korchi
  const questionsWithAnswers = useMemo(() => {
    if (!questionsData || !observationsData) return [];

    const questions = questionsData.data || [];
    const observations = observationsData.data || [];

    // Ekta "Map" to-ri kori jate khub druto (fast) uttor khuje paowa jaay
    const observationMap = new Map(
      observations.map((obs) => [obs.question?._id, obs])
    );

    // Proshno-r list-er upor map kori
    return questions.map((question) => ({
      question: question,
      savedObservation: observationMap.get(question._id) || null, // Ei proshno-r uttor-ta Map theke ber kori
    }));
  }, [questionsData, observationsData]);

  // --- Loading / Error States ---
  if (isLoadingQuestions || isLoadingObservations) {
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
       <div className="p-4 text-center text-gray-500">
         <AlertCircle className="h-4 w-4 inline-block mr-2" />
         No questions found for this template.
       </div>
     );
  }

  // --- 4. Render the List ---
  return (
    <div className="space-y-4">
      {questionsWithAnswers.map(({ question, savedObservation }) => (
        <ObservationCard
          key={question._id}
          session={session} // Pura session object-ta pass kori
          question={question} // Ekta question object pass kori
          savedObservation={savedObservation} // Save kora uttor-ta pass kori
          onSave={() => {
            // Jokhon-i kono card save hobe, amra shob observation abar load korbo
            refetchObservations();
          }}
        />
      ))}
    </div>
  );
}