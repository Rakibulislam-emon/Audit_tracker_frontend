"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { universalConfig } from "@/config/dynamicConfig";
import { AlertCircle, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form"; // ✅ 1. Controller imported
import MultiSelectRelation from "../template/MultiSelectRelation";
import RelationSelect from "./UniversalRelationSelect"; // ✅ 2. New component imported

export default function UniversalForm({
  module,
  onSubmit,
  isSubmitting = false,
  initialData = {},
  mode = "create",
  token,
}) {
  const config = universalConfig[module];

  // check for permission will be implemented later

  const {
    register,
    handleSubmit,
    watch,
    control, // ✅ 3. 'control' is now taken from useForm
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialData,
  });

  if (!config) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold">Configuration Error</p>
          <p className="text-sm mt-1">
            No configuration found for module "{module}"
          </p>
        </div>
      </div>
    );
  }

  // ❌ 'getRelationData' function has been REMOVED
  // ❌ 'renderRelationSelect' function has been REMOVED

  const renderField = (fieldKey, fieldConfig) => {
    // Skip fields based on mode
    if (mode === "edit" && fieldConfig.createOnly) return null;
    if (mode === "create" && fieldConfig.editOnly) return null;
    if (fieldConfig.formField === false) return null;

    const hasError = errors[fieldKey];
    const errorClass = hasError ? "border-red-500 focus:ring-red-500" : "";

    switch (fieldConfig.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Input
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            disabled={isSubmitting}
            className={`${errorClass} transition-colors`}
            {...register(fieldKey, {
              required: fieldConfig.required
                ? `${fieldConfig.label} is required`
                : false,
              pattern:
                fieldConfig.type === "email"
                  ? {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    }
                  : undefined,
            })}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={fieldConfig.placeholder}
            disabled={isSubmitting}
            className={`${errorClass} transition-colors`}
            step={fieldConfig.step || "any"} // Allow decimals if needed, e.g., "0.1" for weight
            {...register(fieldKey, {
              required: fieldConfig.required
                ? `${fieldConfig.label} is required`
                : false,

              valueAsNumber: true,

              min: {
                value: fieldConfig.min ?? 0.1, // Config থেকে min নিন, না থাকলে 0.1
                message: `${fieldConfig.label} must be at least ${
                  fieldConfig.min ?? 0.1
                }`,
              },
              max: {
                value: fieldConfig.max ?? 10,
                message: `${fieldConfig.label} must be no more than ${
                  fieldConfig.max ?? 10
                }`,
              },

              pattern: {
                value: /^\d*\.?\d*$/,
                message: "Please enter a valid number",
              },
            })}
          />
        );
      case "select":
        // ✅ 4. This logic is now clean
        if (fieldConfig.relation) {
          // If it's a relation, render the new component
          console.log(
            fieldConfig.relation,
            fieldKey,
            "Rendering RelationSelect for relation field"
          );
          return (
            <RelationSelect
              fieldKey={fieldKey}
              fieldConfig={fieldConfig}
              control={control}
              token={token}
              isSubmitting={isSubmitting}
              errors={errors}
            />
          );
        }
        // Watch current value for dynamic styling
        const currentValue = watch(fieldKey);

        // This part is for STATIC dropdowns (like 'status' or 'role')
        const options = fieldConfig.options || [];
        return (
          <div className="relative">
            <select
              disabled={isSubmitting}
              className={`
                flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm 
                ring-offset-background
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                disabled:cursor-not-allowed disabled:opacity-50 appearance-none
                transition-colors
                ${errorClass || "border-gray-300"}
                ${
                  !currentValue || currentValue === ""
                    ? "text-gray-400"
                    : "text-gray-900"
                }
              `}
              {...register(fieldKey, {
                required: fieldConfig.required
                  ? `${fieldConfig.label} is required`
                  : false,
                validate: (value) => {
                  if (fieldConfig.required && (!value || value === "")) {
                    return `${fieldConfig.label} is required`;
                  }
                  return true;
                },
              })}
            >
              <option value="" className="text-gray-400">
                {fieldConfig.placeholder || `Select ${fieldConfig.label}`}
              </option>
              {options.map((option, index) => (
                <option key={index} value={option} className="text-gray-900">
                  {fieldKey === "isActive"
                    ? option === "active" || option === true
                      ? "Active"
                      : "Inactive"
                    : typeof option === "string" && option.includes("_")
                    ? option
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 opacity-50"
              >
                <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        );
      case "select-multi":
        console.log(
          fieldConfig.relation,
          fieldKey,
          "Rendering MultiSelectRelation for multi-select relation field"
        );
        return (
        <div className="w-full">
            <MultiSelectRelation
              fieldKey={fieldKey}
              fieldConfig={fieldConfig}
              control={control}
              token={token}
              isSubmitting={isSubmitting}
              errors={errors}
            />
           
        </div>
        );
      case "textarea":
        return (
          <Textarea
            placeholder={fieldConfig.placeholder}
            disabled={isSubmitting}
            className={`${errorClass} transition-colors resize-none`}
            rows={4}
            {...register(fieldKey, {
              required: fieldConfig.required
                ? `${fieldConfig.label} is required`
                : false,
            })}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            disabled={fieldConfig.readOnly || isSubmitting}
            className={`${errorClass} transition-colors`}
            {...register(fieldKey, {
              required: fieldConfig.required
                ? `${fieldConfig.label} is required`
                : false,
            })}
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder={fieldConfig.placeholder}
            disabled={isSubmitting}
            className={`${errorClass} transition-colors`}
            {...register(fieldKey, {
              required: fieldConfig.required
                ? `${fieldConfig.label} is required`
                : false,
            })}
          />
        );
    }
  };

  // Get visible fields for layout
  const visibleFields = Object.entries(config.fields).filter(
    ([fieldKey, fieldConfig]) => {
      if (mode === "edit" && fieldConfig.createOnly) return false;
      if (mode === "create" && fieldConfig.editOnly) return false;
      if (fieldConfig.formField === false) return false;
      return true;
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-5  "
    >
      {/* Form Fields - Grid Layout for better space usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleFields.map(([fieldKey, fieldConfig]) => {
          const isFullWidth =
            fieldConfig.type === "textarea" || fieldConfig.type === "select-multi" || fieldConfig.fullWidth;

          return (
            <div
              key={fieldKey}
              className={`space-y-2 ${isFullWidth ? "md:col-span-2" : ""}`}
            >
              {/* Label */}
              <Label
                htmlFor={fieldKey}
                className="text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                {fieldConfig.label}
                {fieldConfig.required && (
                  <span className="text-red-500" title="Required">
                    *
                  </span>
                )}
              </Label>

              {/* Field */}
              {renderField(fieldKey, fieldConfig)}

              {/* Error Message */}
              {errors[fieldKey] && (
                <div className="flex items-start gap-1.5 text-red-600 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{errors[fieldKey].message}</p>
                </div>
              )}

              {/* Description/Helper Text */}
              {fieldConfig.description && !errors[fieldKey] && (
                <p className="text-xs text-gray-500 mt-1">
                  {fieldConfig.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-5" />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || (mode === "edit" && !isDirty)}
          className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>{mode === "create" ? "Creating..." : "Updating..."}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {mode === "create" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create {config.title}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </div>
          )}
        </Button>
      </div>

      {/* Form Status Indicator */}
      {mode === "edit" && !isDirty && !isSubmitting && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            No changes detected. Make changes to enable save.
          </p>
        </div>
      )}
    </form>
  );
}


