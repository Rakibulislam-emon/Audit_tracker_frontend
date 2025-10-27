"use client";

import { useModuleData } from "@/hooks/useUniversal";
import { Controller } from "react-hook-form";

export default function RelationSelect({
  fieldKey,
  fieldConfig,
  control,
  token,
  isSubmitting,
  errors,
}) {
  // ✅ 1. Hook is now at the top-level, fixing the re-render loop
  const { data: relationData, isLoading } = useModuleData(
    fieldConfig.relation,
    token,
    {}
  );

  const relationInfo = {
    data: relationData?.data || [],
    isLoading: isLoading,
  };

  const hasError = errors[fieldKey];

  return (
    // ✅ 2. Controller is used to fix the edit mode bug
    <Controller
      name={fieldKey}
      control={control}
      rules={{
        required: fieldConfig.required
          ? `${fieldConfig.label} is required`
          : false,
      }}
      render={({ field }) => (
        <div className="relative">
          <select
          
            {...field} // Use 'field' from Controller
            value={field.value === null ? "" : field.value} // যদি null হয়, "" ব্যবহার করুন
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            name={field.name}
            disabled={isSubmitting || relationInfo.isLoading}
            className={`
              flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm 
              ring-offset-background
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              disabled:cursor-not-allowed disabled:opacity-50 appearance-none
              transition-colors
              ${
                hasError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }
              ${relationInfo.isLoading ? "text-gray-400" : "text-gray-900"}
            `}
          >
            {/* Placeholder Option */}
            <option value="" className="text-gray-400">
              {relationInfo.isLoading
                ? `Loading ${fieldConfig.relation}...`
                : fieldConfig.placeholder || `Select ${fieldConfig.label}`}
            </option>

            {/* Relation Options */}
            {!relationInfo.isLoading &&
              relationInfo.data.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                  className="text-gray-900"
                >
                  {item.name || item.title || item.email || item.questionText ||item.questionText ||  item.actionText  || `ID: ${item._id.slice(-6)}`}
                </option>
              ))}
          </select>

          {/* Loading Indicator */}
          {relationInfo.isLoading && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {/* Dropdown Arrow */}
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
      )}
    />
  );
}
