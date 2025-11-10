"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

export default function UniversalDatePicker({ field, isSubmitting, hasError }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal cursor-pointer",
            !field.value && "text-muted-foreground",
            hasError && "border-red-500"
          )}
          disabled={isSubmitting}
          type="button" // Important: prevent form submission
        >
          <CalendarIcon className="mr-2 h-4 w-4 " />
          {field.value ? (
            format(new Date(field.value), "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 "
        align="start"
        onInteractOutside={(e) => {
          // Don't close when clicking on the trigger
          if (e.target.closest('[data-state="open"]')) {
            e.preventDefault();
          }
        }}
      >
        <Calendar
          mode="single"
          selected={field.value ? new Date(field.value) : null}
          onSelect={(date) => {
            field.onChange(date);
            setOpen(false); // Close after selection
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
