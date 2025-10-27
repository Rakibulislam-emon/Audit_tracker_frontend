"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModuleData } from "@/hooks/useUniversal";
import { useEffect, useState } from "react";

export default function UniversalFilterRelationSelect({
  id,
  token,
  moduleName, // e.g., "groups"
  placeholder,
  value,
  onChange,
}) {
  const [data, setData] = useState([]);

  // ✅ API থেকে রিলেটেড ডেটা (যেমন 'groups') ফেচ করা
  const { data: relationData, isLoading } = useModuleData(
    moduleName,
    token,
    {}
  );

  useEffect(() => {
    if (relationData?.data) {
      setData(relationData.data);
    }
  }, [relationData]);

  const loadingText = `Loading ${moduleName}...`;

  return (
    <Select
      value={isLoading ? "" : value} // লোড হওয়ার সময় ভ্যালু খালি রাখুন
      onValueChange={(value) => onChange(value === "all" ? "" : value)}
      disabled={isLoading}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={isLoading ? loadingText : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {!isLoading &&
          data.map((item) => (
            <SelectItem key={item._id} value={item._id}>
              {item.name ||
                item.title ||
                item.email ||
                item.questionText ||
                item.actionText ||
                `ID: ${item._id.slice(-6)}`}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
