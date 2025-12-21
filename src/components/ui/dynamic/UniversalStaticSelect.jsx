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
  user,
  errors,
}) {
  // ===========================================================================
  // AUTHORITY-BASED FILTERING (UX)
  // ===========================================================================

  const AUTHORITY_TIERS = {
    superAdmin: 1,
    sysadmin: 1,
    admin: 1,
    groupAdmin: 2,
    companyAdmin: 3,
    complianceOfficer: 4,
    siteManager: 4,
    auditor: 5,
  };

  const SCOPE_WEIGHTS = {
    system: 100,
    group: 75,
    company: 50,
    site: 25,
  };

  const getFilteredOptions = () => {
    let rawOptions = fieldConfig.options || [];
    if (!user || user.role === "superAdmin" || user.role === "sysadmin")
      return rawOptions;

    const userTier = AUTHORITY_TIERS[user.role] || 5;

    // Infer scope if missing (defensive)
    let userScopeLevel = user.scopeLevel;
    if (!userScopeLevel) {
      if (user.role === "groupAdmin") userScopeLevel = "group";
      else if (user.role === "companyAdmin") userScopeLevel = "company";
      else if (user.role === "siteManager") userScopeLevel = "site";
      else if (["superAdmin", "sysadmin", "admin"].includes(user.role))
        userScopeLevel = "system";
    }

    const userScopeWeight = SCOPE_WEIGHTS[userScopeLevel] || 0;

    // 1. Filter User Roles dropdown
    if (fieldKey === "role") {
      return rawOptions.filter((option) => {
        const optionTier = AUTHORITY_TIERS[option] || 5;
        // Cannot create peer or higher role
        return optionTier > userTier;
      });
    }

    // 2. Filter assignTo (Scope) dropdown
    if (fieldKey === "assignTo") {
      return rawOptions.filter((option) => {
        const optionWeight = SCOPE_WEIGHTS[option] || 0;
        // Cannot create scope ABOVE your own (equal is fine)
        return optionWeight <= userScopeWeight;
      });
    }

    return rawOptions;
  };

  const options = getFilteredOptions();
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
      render={({ field }) => {
        // ✅ VALUE TRANSFORMATION
        // Handle boolean values for isActive field
        let displayValue = field.value;
        if (fieldKey === "isActive") {
          // Convert boolean to string for Select component
          if (field.value === true) displayValue = "active";
          else if (field.value === false) displayValue = "inactive";
          // If already string (e.g. from default), keep it
        }

        const handleValueChange = (newValue) => {
          // ✅ CHANGE TRANSFORMATION
          if (fieldKey === "isActive") {
            // Convert string back to boolean for Form/API
            const boolValue = newValue === "active";
            field.onChange(boolValue);
          } else {
            field.onChange(newValue);
          }
        };

        return (
          <Select
            onValueChange={handleValueChange}
            defaultValue={displayValue}
            value={displayValue || ""}
            disabled={isSubmitting}
          >
            <SelectTriggerWithError
              hasError={hasError}
              value={displayValue}
              placeholder={placeholderText}
              isSubmitting={isSubmitting}
            />

            <SelectContentWithOptions
              options={options}
              fieldConfig={fieldConfig}
              hasRequiredOption={hasRequiredOption}
            />
          </Select>
        );
      }}
    />
  );
}
