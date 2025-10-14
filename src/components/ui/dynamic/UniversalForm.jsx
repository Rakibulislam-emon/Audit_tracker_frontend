"use client";

import { useForm } from "react-hook-form";
import { universalConfig } from "@/config/dynamicConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";


/**
 * UNIVERSAL FORM COMPONENT
 * 
 * Automatically generates forms from module configuration
 * 
 * @param {string} module - Module name: "users", "groups", "companies"
 * @param {function} onSubmit - Form submission handler
 * @param {boolean} isSubmitting - Loading state
 * @param {object} initialData - Pre-fill data for edit mode
 * @param {string} mode - "create" or "edit"
 * 
 * USAGE:
 * <UniversalForm module="users" onSubmit={handleSubmit} mode="create" />
 * <UniversalForm module="users" onSubmit={handleUpdate} initialData={user} mode="edit" />
 */
export default function UniversalForm({
  module,
  onSubmit,
  isSubmitting = false,
  initialData = {},
  mode = "create"
}) {
  // 1. GET MODULE CONFIGURATION
  const config = universalConfig[module];

  // 2. INITIALIZE REACT HOOK FORM
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control
  } = useForm({
    defaultValues: initialData,
  });

  // 3. SAFETY CHECK
  if (!config) {
    return (
      <div className="p-4 text-red-600 border border-red-200 rounded-lg">
        Error: Configuration not found for module "{module}"
      </div>
    );
  }

  /**
   * FIELD RENDERER FUNCTION
   * 
   * Renders appropriate input based on field type from configuration
   * 
   * @param {string} fieldKey - Field name: "name", "email", "role"
   * @param {object} fieldConfig - Field configuration from dynamicConfig
   */
  const renderField = (fieldKey, fieldConfig) => {
    // Skip createOnly fields in edit mode
    if (mode === "edit" && fieldConfig.createOnly) {
      return null;
    }

    // Common props for all inputs
    const commonProps = {
      disabled: isSubmitting,
      ...register(fieldKey, {
        required: fieldConfig.required ? `${fieldConfig.label} is required` : false,
        // You can add more validation rules here based on field type
      }),
    };

    // Switch based on field type from configuration
    switch (fieldConfig.type) {
      // TEXT INPUTS
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            className={errors[fieldKey] ? "border-red-500" : ""}
            {...commonProps}
          />
        );

      // SELECT DROPDOWN
      case 'select':
        return (
          <Select
            value={watch(fieldKey) || ""}
            onValueChange={(value) => setValue(fieldKey, value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors[fieldKey] ? "border-red-500" : ""}>
              <SelectValue placeholder={`Select ${fieldConfig.label}`} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {/* Auto-format: "audit_manager" → "Audit Manager" */}
                  {option.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      // TEXTAREA FOR LONG TEXT
      case 'textarea':
        return (
          <Textarea
            placeholder={fieldConfig.placeholder}
            className={errors[fieldKey] ? "border-red-500" : ""}
            rows={4}
            {...commonProps}
          />
        );

      // SWITCH/TOGGLE (Checkbox for now)
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldKey}
              checked={watch(fieldKey) || false}
              onCheckedChange={(checked) => setValue(fieldKey, checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor={fieldKey} className="text-sm font-normal">
              {fieldConfig.label}
            </Label>
          </div>
        );

      // DATE FIELD
      case 'date':
        return (
          <Input
            type="date"
            disabled={fieldConfig.readOnly || isSubmitting}
            {...commonProps}
          />
        );

      // FALLBACK FOR UNKNOWN TYPES
      default:
        return (
          <Input
            type="text"
            placeholder={fieldConfig.placeholder}
            className={errors[fieldKey] ? "border-red-500" : ""}
            {...commonProps}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* DYNAMIC FIELDS - Generated from configuration */}
      {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => {
        // Skip fields that shouldn't be rendered in current mode
        if (mode === "edit" && fieldConfig.createOnly) return null;

        return (
          <div key={fieldKey} className="space-y-2">
            {/* FIELD LABEL */}
            <Label htmlFor={fieldKey} className="text-sm font-medium">
              {fieldConfig.label}
              {fieldConfig.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>

            {/* RENDERED INPUT FIELD */}
            {renderField(fieldKey, fieldConfig)}

            {/* VALIDATION ERROR MESSAGE */}
            {errors[fieldKey] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[fieldKey].message}
              </p>
            )}

            {/* FIELD DESCRIPTION/HELP TEXT */}
            {fieldConfig.description && (
              <p className="text-sm text-gray-500 mt-1">
                {fieldConfig.description}
              </p>
            )}
          </div>
        );
      })}

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {mode === "create" ? "Creating..." : "Updating..."}
          </>
        ) : (
          `${mode === "create" ? "Create" : "Update"} ${config.title}`
        )}
      </Button>
    </form>
  );
}