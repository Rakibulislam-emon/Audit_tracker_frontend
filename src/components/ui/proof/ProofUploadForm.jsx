// src/components/ui/proofs/ProofUploadForm.jsx

"use client";

import { Button } from "@/components/ui/button";
import RelationSelect from "@/components/ui/dynamic/UniversalRelationSelect"; // RelationSelect ইম্পোর্ট
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { universalConfig } from "@/config/dynamicConfig";
import { uploadProofApi } from "@/services/proofService"; // Proof আপলোড API
import { AlertCircle, UploadCloud } from "lucide-react"; // আইকন
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProofUploadForm({
  token,
  relatedEntityType = null,
  relatedEntityId = null,
  onClose,
  onUploadSuccess,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileNameDisplay, setFileNameDisplay] = useState("No file selected");
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      problem: relatedEntityType === "problem" ? relatedEntityId : "",
      observation: relatedEntityType === "observation" ? relatedEntityId : "",
      fixAction: relatedEntityType === "fixAction" ? relatedEntityId : "",
      caption: "",
    },
  });

  const watchedProblem = watch("problem");
  const watchedObservation = watch("observation");
  const watchedFixAction = watch("fixAction");
  const isLinked =
    !!relatedEntityId ||
    !!watchedProblem ||
    !!watchedObservation ||
    !!watchedFixAction;

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileNameDisplay(file.name);
      setFormError("");
    } else {
      setSelectedFile(null);
      setFileNameDisplay("No file selected");
    }
    if (event.target) event.target.value = null;
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      setFormError("");
      if (!selectedFile) {
        setFormError("Please select a file to upload.");
        return;
      }
      if (!isLinked) {
        setFormError(
          "Proof must be linked to a Problem, Observation, or Fix Action."
        );
        return;
      }

      setIsUploading(true);
      const toastId = toast.loading("Uploading proof, please wait...");

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("caption", data.caption || "");

        if (relatedEntityId && relatedEntityType)
          formData.append(relatedEntityType, relatedEntityId);
        else if (data.problem) formData.append("problem", data.problem);
        else if (data.observation)
          formData.append("observation", data.observation);
        else if (data.fixAction) formData.append("fixAction", data.fixAction);

        const result = await uploadProofApi(formData, token);

        toast.success(result.message || "Proof uploaded successfully!", {
          id: toastId,
        });
        setSelectedFile(null);
        setFileNameDisplay("No file selected");
        reset({
          // ফর্ম রিসেট
          problem: relatedEntityType === "problem" ? relatedEntityId : "",
          observation:
            relatedEntityType === "observation" ? relatedEntityId : "",
          fixAction: relatedEntityType === "fixAction" ? relatedEntityId : "",
          caption: "",
        });
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = null;

        if (onUploadSuccess) onUploadSuccess(); // ডেটা রিফ্রেশ করার কলব্যাক

        // ✅✅✅ ---- সমাধান এখানে ---- ✅✅✅
        if (onClose) onClose(); // Modal বন্ধ করার কলব্যাক কল করা
        // ✅✅✅ -------------------------- ✅✅✅
      } catch (error) {
        console.error("Upload failed:", error);
        const errorMessage = error.message || "Failed to upload proof.";
        setFormError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsUploading(false);
      }
      // ডিপেন্ডেন্সি অ্যারে আপডেট করা হয়েছে
    },
    [
      selectedFile,
      isLinked,
      token,
      relatedEntityId,
      relatedEntityType,
      reset,
      onUploadSuccess,
      onClose,
    ]
  );

  const renderRelationSelect = useCallback(
    (entityType, label) => {
      if (relatedEntityType && relatedEntityType !== entityType) return null;
      if (relatedEntityType && relatedEntityType === entityType) return null;

      const relationModule = `${entityType}s`;
      if (!universalConfig[relationModule]) {
        console.warn(`Config missing for ${relationModule}.`);
        return (
          <p className="text-xs text-red-500">
            Config missing for {relationModule}.
          </p>
        );
      }

      const fieldConfig = {
        relation: relationModule,
        label: label,
        required:
          !relatedEntityId &&
          !watchedProblem &&
          !watchedObservation &&
          !watchedFixAction,
        placeholder: `Select ${label}`,
      };

      return (
        <div key={entityType} className="space-y-2">
          <Label htmlFor={entityType}>
            {fieldConfig.label}{" "}
            {fieldConfig.required && !isLinked && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <RelationSelect
            fieldKey={entityType}
            fieldConfig={fieldConfig}
            control={control}
            token={token}
            isSubmitting={isUploading}
            errors={errors}
          />
          {errors[entityType] && !isLinked && (
            <p className="text-sm text-red-500">
              {errors[entityType].message ||
                `${label} is required if not linked otherwise.`}
            </p>
          )}
        </div>
      );
    },
    [
      relatedEntityType,
      token,
      isUploading,
      control,
      errors,
      watchedProblem,
      watchedObservation,
      watchedFixAction,
      isLinked,
    ]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-1 max-h-[70vh] overflow-y-auto custom-scrollbar"
    >
      {!relatedEntityId && (
        <>
          {renderRelationSelect("problem", "Link to Problem")}
          {renderRelationSelect("observation", "Observation")}
          {renderRelationSelect("fixAction", "Fix Action")}
        </>
      )}
      {relatedEntityId && relatedEntityType && (
        <div className="text-sm p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
          🔗 Linking proof to {relatedEntityType}: ID ending in ...
          {relatedEntityId.slice(-6)}
        </div>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="file-upload"
          className={
            !selectedFile && formError.includes("select a file")
              ? "text-red-600 font-semibold"
              : ""
          }
        >
          Select Proof File*
        </Label>
        <div
          className={`flex flex-col items-center justify-center w-full h-36 px-4 transition bg-white border-2 ${
            !selectedFile && formError.includes("select a file")
              ? "border-red-400"
              : "border-gray-300"
          } border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          onClick={() =>
            !isUploading && document.getElementById("file-upload")?.click()
          }
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ")
              !isUploading && document.getElementById("file-upload")?.click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (
              !isUploading &&
              e.dataTransfer.files &&
              e.dataTransfer.files[0]
            ) {
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }
          }}
        >
          <span className="flex items-center space-x-3">
            <UploadCloud className="w-8 h-8 text-gray-500" />
            <span className="font-medium text-gray-600">
              {fileNameDisplay === "No file selected" ? (
                <>
                  Drop file here, or{" "}
                  <span className="text-blue-600">click to browse</span>
                </>
              ) : (
                <span
                  className="text-blue-700 font-semibold truncate max-w-xs"
                  title={fileNameDisplay}
                >
                  {fileNameDisplay}
                </span>
              )}
            </span>
          </span>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            aria-describedby="file-error"
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/*,audio/*"
          />
        </div>
        {selectedFile && (
          <p className="text-xs text-gray-500 mt-1">
            Size: {Math.round(selectedFile.size / 1024)} KB
          </p>
        )}
        {!selectedFile && formError.includes("select a file") && (
          <p id="file-error" className="text-sm text-red-500 mt-1">
            {formError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption (Optional)</Label>
        <Textarea
          id="caption"
          placeholder="Add a description or context for the proof..."
          disabled={isUploading}
          rows={3}
          {...register("caption")}
        />
      </div>

      {formError && !formError.includes("select a file") && (
        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="break-words">{formError}</span>
        </div>
      )}
      {!isLinked && !relatedEntityId && (
        <p className="text-xs text-amber-700 p-2 bg-amber-50 border border-amber-200 rounded-md">
          ⚠️ Please link this proof to at least one item (Problem, Observation,
          or Fix Action) using the dropdowns.
        </p>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t mt-6 sticky bottom-0 bg-white dark:bg-gray-800 py-3 px-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isUploading}
        >
          {" "}
          Cancel{" "}
        </Button>
        <Button
          type="submit"
          disabled={isUploading || !selectedFile || !isLinked}
          className="min-w-[140px]"
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              {" "}
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>{" "}
              <span>Uploading...</span>{" "}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {" "}
              <UploadCloud className="h-4 w-4" /> <span>Upload Proof</span>{" "}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
