"use client";

import { AlertCircle, Plus, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Custom Form Components
import MultiSelectRelation from "../template/MultiSelectRelation";
import UniversalDatePicker from "./UniversalDatePicker";
import RelationSelect from "./UniversalRelationSelect";

// Config
import { universalConfig } from "@/config/dynamicConfig";
import UniversalStaticSelect from "./UniversalStaticSelect";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  SELECT: "select",
  SELECT_MULTI: "select-multi",
  TEXTAREA: "textarea",
  DATE: "date",
};

const FULL_WIDTH_FIELD_TYPES = [FIELD_TYPES.TEXTAREA, FIELD_TYPES.SELECT_MULTI];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================
// =============================================================================
// DATA NORMALIZATION FUNCTIONS
// =============================================================================

/**
 * Normalizes API data for form usage
 * Extracts IDs from relation objects and handles nested fields
 */
// =============================================================================
// DATA NORMALIZATION FUNCTIONS - ✅ IMPROVED VERSION
// =============================================================================

/**
 * Normalizes API data for form usage
 * Extracts IDs from relation objects - handles nested objects
 */
const normalizeFormData = (data, config) => {
  if (!data || typeof data !== "object") return {};

  const normalized = JSON.parse(JSON.stringify(data)); // Deep clone to avoid mutations

  console.log("🔍 Starting data normalization:", { rawData: data });

  Object.entries(config.fields).forEach(([fieldKey, fieldConfig]) => {
    const currentValue = normalized[fieldKey];

    // Skip if no value or not a relation field
    if (!currentValue || !fieldConfig.relation) return;

    // Handle object values for relation fields
    if (typeof currentValue === "object" && currentValue !== null) {
      console.log(`🔍 Processing ${fieldKey}:`, {
        type: typeof currentValue,
        value: currentValue,
        hasId: !!currentValue._id,
      });

      // Extract ID from relation object
      if (currentValue._id) {
        normalized[fieldKey] = currentValue._id;
        console.log(`✅ Normalized ${fieldKey}: ${currentValue._id}`);
      } else {
        // If no _id but it's an object, keep it as is (might be a nested structure)
        console.log(`⚠️ ${fieldKey} is object but no _id found:`, currentValue);
      }
    }
  });

  console.log("🔍 Final normalized data:", normalized);
  return normalized;
};

/**
 * Prepares form data for API submission
 * Ensures only necessary fields are sent
 */
const prepareSubmissionData = (data, config, mode) => {
  const submissionData = { ...data };

  Object.entries(config.fields).forEach(([fieldKey, fieldConfig]) => {
    // Remove fields that shouldn't be submitted in edit mode
    if (mode === "edit" && fieldConfig.formField === false) {
      delete submissionData[fieldKey];
    }

    // Remove read-only fields
    if (fieldConfig.readOnly) {
      delete submissionData[fieldKey];
    }

    // Handle nested field submission
    if (fieldKey.includes(".")) {
      const parts = fieldKey.split(".");
      const parentKey = parts[0];
      const childKey = parts[1];

      if (!submissionData[parentKey]) {
        submissionData[parentKey] = {};
      }

      // Move the value to the nested structure
      submissionData[parentKey][childKey] = submissionData[fieldKey];
      delete submissionData[fieldKey];
    }
  });

  return submissionData;
};
const ErrorDisplay = ({ error }) => (
  <div className="flex items-start gap-1.5 text-red-600 text-sm mt-1">
    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
    <p>{error.message}</p>
  </div>
);

const FieldLabel = ({ fieldKey, fieldConfig }) => (
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
);

const FieldDescription = ({ description }) => (
  <p className="text-xs text-gray-500 mt-1">{description}</p>
);

const LoadingButtonContent = ({ mode }) => (
  <div className="flex items-center gap-2">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
    <span>{mode === "create" ? "Creating..." : "Updating..."}</span>
  </div>
);

const SubmitButtonContent = ({ mode, config }) => (
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
);

const FormStatusIndicator = ({ mode, isDirty, isSubmitting }) => {
  if (mode === "edit" && !isDirty && !isSubmitting) {
    return (
      <div className="text-center">
        <p className="text-xs text-gray-500">
          No changes detected. Make changes to enable save.
        </p>
      </div>
    );
  }
  return null;
};

// =============================================================================
// FIELD RENDERERS
// =============================================================================

const TextFieldRenderer = ({
  fieldKey,
  fieldConfig,
  register,
  errors,
  isSubmitting,
}) => {
  const hasError = errors[fieldKey];
  const errorClass = hasError ? "border-red-500 focus:ring-red-500" : "";

  const commonProps = {
    type: fieldConfig.type,
    placeholder: fieldConfig.placeholder,
    disabled: isSubmitting,
    className: `${errorClass} transition-colors`,
  };

  const validationRules = {
    required: fieldConfig.required ? `${fieldConfig.label} is required` : false,
  };

  if (fieldConfig.type === FIELD_TYPES.EMAIL) {
    validationRules.pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    };
  }

  return <Input {...commonProps} {...register(fieldKey, validationRules)} />;
};

const NumberFieldRenderer = ({
  fieldKey,
  fieldConfig,
  register,
  errors,
  isSubmitting,
}) => {
  const hasError = errors[fieldKey];
  const errorClass = hasError ? "border-red-500 focus:ring-red-500" : "";

  return (
    <Input
      type="number"
      placeholder={fieldConfig.placeholder}
      disabled={isSubmitting}
      className={`${errorClass} transition-colors`}
      step={fieldConfig.step || "any"}
      {...register(fieldKey, {
        required: fieldConfig.required
          ? `${fieldConfig.label} is required`
          : false,
        valueAsNumber: true,
        min: {
          value: fieldConfig.min ?? 0.1,
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
};

const TextareaFieldRenderer = ({
  fieldKey,
  fieldConfig,
  register,
  errors,
  isSubmitting,
}) => {
  const hasError = errors[fieldKey];
  const errorClass = hasError ? "border-red-500 focus:ring-red-500" : "";

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
};

// const StaticSelectRenderer = ({
//   fieldKey,
//   fieldConfig,
//   register,
//   errors,
//   isSubmitting,
//   watch,
// }) => {
//   const hasError = errors[fieldKey];
//   const errorClass = hasError
//     ? "border-red-500 focus:ring-red-500"
//     : "border-gray-300";
//   const currentValue = watch(fieldKey);
//   const options = fieldConfig.options || [];

//   const formatOptionLabel = (option) => {
//     if (fieldKey === "isActive") {
//       return option === "active" || option === true ? "Active" : "Inactive";
//     }

//     if (typeof option === "string" && option.includes("_")) {
//       return option
//         .split("_")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
//     }

//     return option.charAt(0).toUpperCase() + option.slice(1);
//   };

//   return (
//     <div className="relative">
//       <select
//         disabled={isSubmitting}
//         className={`
//           flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm
//           ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//           disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors
//           ${errorClass}
//           ${
//             !currentValue || currentValue === ""
//               ? "text-gray-400"
//               : "text-gray-900"
//           }
//         `}
//         {...register(fieldKey, {
//           required: fieldConfig.required
//             ? `${fieldConfig.label} is required`
//             : false,
//           validate: (value) => {
//             if (fieldConfig.required && (!value || value === "")) {
//               return `${fieldConfig.label} is required`;
//             }
//             return true;
//           },
//         })}
//       >
//         <option value="" className="text-gray-400">
//           {fieldConfig.placeholder || `Select ${fieldConfig.label}`}
//         </option>
//         {options.map((option, index) => (
//           <option key={index} value={option} className="text-gray-900">
//             {formatOptionLabel(option)}
//           </option>
//         ))}
//       </select>

//       {/* Custom dropdown arrow */}
//       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
//         <svg
//           width="15"
//           height="15"
//           viewBox="0 0 15 15"
//           fill="none"
//           className="h-4 w-4 opacity-50"
//         >
//           <path
//             d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
//             fill="currentColor"
//             fillRule="evenodd"
//             clipRule="evenodd"
//           />
//         </svg>
//       </div>
//     </div>
//   );
// };

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalForm({
  module,
  onSubmit,
  isSubmitting = false,
  initialData = {},
  mode = "create",
  token,
}) {
  // ===========================================================================
  // HOOKS & CONFIG
  // ===========================================================================

  const config = universalConfig[module];

  // Normalize initial data to extract IDs from objects
  const normalizedInitialData = normalizeFormData(initialData, config);

  console.log("🔍 UniversalForm Debug:", {
    rawInitialData: initialData,
    normalizedInitialData,
    entityId: {
      raw: initialData?.entityId,
      normalized: normalizedInitialData?.entityId,
    },
    approver: {
      raw: initialData?.approver,
      normalized: normalizedInitialData?.approver,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: normalizedInitialData,
  });

  // ===========================================================================
  // FIELD FILTERING & RENDERING
  // ===========================================================================

  const shouldRenderField = (fieldConfig) => {
    if (mode === "edit" && fieldConfig.createOnly) return false;
    if (mode === "create" && fieldConfig.editOnly) return false;
    if (fieldConfig.formField === false) return false;
    return true;
  };

  const visibleFields = Object.entries(config.fields).filter(
    ([, fieldConfig]) => shouldRenderField(fieldConfig)
  );

  const renderField = (fieldKey, fieldConfig) => {
    const commonProps = {
      fieldKey,
      fieldConfig,
      register,
      errors,
      isSubmitting,
      control,
      token,
    };

    switch (fieldConfig.type) {
      case FIELD_TYPES.TEXT:
      case FIELD_TYPES.EMAIL:
      case FIELD_TYPES.PASSWORD:
        return <TextFieldRenderer {...commonProps} />;

      case FIELD_TYPES.NUMBER:
        return <NumberFieldRenderer {...commonProps} />;

      case FIELD_TYPES.SELECT:
        if (fieldConfig.relation) {
          return (
            <RelationSelect {...commonProps} control={control} token={token} />
          );
        }
        return <UniversalStaticSelect {...commonProps} watch={watch} />;

      case FIELD_TYPES.SELECT_MULTI:
        return (
          <MultiSelectRelation
            {...commonProps}
            control={control}
            token={token}
          />
        );

      case FIELD_TYPES.TEXTAREA:
        return <TextareaFieldRenderer {...commonProps} />;

      case FIELD_TYPES.DATE:
        return (
          <Controller
            name={fieldKey}
            control={control}
            rules={{
              required: fieldConfig.required
                ? `${fieldConfig.label} is required`
                : false,
            }}
            render={({ field }) => (
              <UniversalDatePicker
                field={field}
                isSubmitting={isSubmitting}
                hasError={!!errors[fieldKey]}
              />
            )}
          />
        );

      default:
        return <TextFieldRenderer {...commonProps} />;
    }
  };

  // ===========================================================================
  // ERROR HANDLING
  // ===========================================================================

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

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-5"
    >
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleFields.map(([fieldKey, fieldConfig]) => {
          const isFullWidth =
            FULL_WIDTH_FIELD_TYPES.includes(fieldConfig.type) ||
            fieldConfig.fullWidth;

          return (
            <div
              key={fieldKey}
              className={`space-y-2 ${isFullWidth ? "md:col-span-2" : ""}`}
            >
              <FieldLabel fieldKey={fieldKey} fieldConfig={fieldConfig} />
              {renderField(fieldKey, fieldConfig)}

              {errors[fieldKey] && <ErrorDisplay error={errors[fieldKey]} />}

              {fieldConfig.description && !errors[fieldKey] && (
                <FieldDescription description={fieldConfig.description} />
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
            <LoadingButtonContent mode={mode} />
          ) : (
            <SubmitButtonContent mode={mode} config={config} />
          )}
        </Button>
      </div>

      <FormStatusIndicator
        mode={mode}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
