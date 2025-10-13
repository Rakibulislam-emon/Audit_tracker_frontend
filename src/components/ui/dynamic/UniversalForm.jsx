"use client";

import { universalConfig } from "@/config/dynamicConfig";
import { useForm } from "react-hook-form";
import { Input } from "../input";
import { Select } from "../select";
import { Textarea } from "../textarea";

export default function UniversalForm({
  module, // "users", "groups"
  onSubmit, // Form submit handler
  isSubmitting, // Loading state
  initialData, // Edit করার জন্য existing data
  mode = "create", // "create" or "edit"
}) {
  // 1. Config থেকে module এর data নাও
  const config = universalConfig[module];

  // 2. React Hook Form initialize করো
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  // 3. Fields render করার function
  const renderField = (fieldKey, fieldConfig) => {
    switch (fieldConfig.type) {
      case "text":
      case "email":
      case "password":
        return <Input type={fieldConfig.type} {...register(fieldKey)} />;

      case "select":
        return (
          <Select {...register(fieldKey)}>
            {fieldConfig.options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );

      case "textarea":
        return <Textarea {...register(fieldKey)} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 4. Config এর সব fields এর জন্য loop করো */}
      {Object.entries(config.fields).map(([fieldKey, fieldConfig]) => {
        // Edit mode এ createOnly fields skip করো
        if (mode === "edit" && fieldConfig.createOnly) return null;

        return (
          <div key={fieldKey}>
            <label>{fieldConfig.label}</label>
            {renderField(fieldKey, fieldConfig)}
          </div>
        );
      })}

      <button type="submit">Submit</button>
    </form>
  );
}
