"use client";

import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

// ShadCN Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const SELECT_CONFIG = {
  zIndex: 9999,
  position: "popper",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Formats option labels for display
 * Examples:
 * - "active" → "Active"
 * - "in_progress" → "In Progress"
 * - "admin" → "Admin"
 */
const formatOptionLabel = (option) => {
  if (typeof option !== "string") return String(option);

  // Handle special cases
  if (option === "active") return "Active";
  if (option === "inactive") return "Inactive";

  // Convert snake_case to Title Case
  return option
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Gets placeholder text for the select input
 */
const getPlaceholderText = (fieldConfig) => {
  return fieldConfig.placeholder || `Select ${fieldConfig.label}`;
};

/**
 * Validates if field is required
 */
const getValidationRules = (fieldConfig) => ({
  required: fieldConfig.required ? `${fieldConfig.label} is required` : false,
});

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Select trigger with error styling
 */
const SelectTriggerWithError = ({
  hasError,
  value,
  placeholder,
  isSubmitting,
}) => (
  <SelectTrigger
    className={cn(
      "w-full",
      hasError && "border-red-500",
      !value && "text-muted-foreground"
    )}
    disabled={isSubmitting}
  >
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
);

/**
 * Select content with proper positioning
 */
const SelectContentWithOptions = ({
  options,
  fieldConfig,
  hasRequiredOption,
}) => (
  <SelectContent
    position={SELECT_CONFIG.position}
    className={`z-[${SELECT_CONFIG.zIndex}]`}
  >
    {/* Optional placeholder option for non-required fields */}
    {/* {!hasRequiredOption && (
      <SelectItem value="" className="text-gray-400">
        {getPlaceholderText(fieldConfig)}
      </SelectItem>
    )} */}

    {/* Main options list */}
    {options.map((option, index) => (
      <SelectItem key={index} value={String(option)}>
        {formatOptionLabel(option)}
      </SelectItem>
    ))}
  </SelectContent>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalStaticSelect({
  fieldKey,
  fieldConfig,
  control,
  isSubmitting,
  errors,
}) {
  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  const options = fieldConfig.options || [];
  const hasError = Boolean(errors[fieldKey]);
  const hasRequiredOption = fieldConfig.required;
  const placeholderText = getPlaceholderText(fieldConfig);
  const validationRules = getValidationRules(fieldConfig);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Controller
      name={fieldKey}
      control={control}
      rules={validationRules}
      render={({ field }) => (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          value={field.value || ""}
          disabled={isSubmitting}
        >
          <SelectTriggerWithError
            hasError={hasError}
            value={field.value}
            placeholder={placeholderText}
            isSubmitting={isSubmitting}
          />

          <SelectContentWithOptions
            options={options}
            fieldConfig={fieldConfig}
            hasRequiredOption={hasRequiredOption}
          />
        </Select>
      )}
    />
  );
}
