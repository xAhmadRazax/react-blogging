"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form"; // Import Path and FieldValues
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { error } from "console";

// Use a Generic <T extends FieldValues>
interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>; // This ensures 'name' must be a valid key in your schema
  label: string;
  error?: boolean;
}

export function DatePickerField<T extends FieldValues>({
  control,
  name,
  label,
  error,
}: DatePickerProps<T>) {
  const [open, setOpen] = React.useState(false); // Added state to handle auto-close

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field className="grid gap-1 w-full">
          <FieldLabel>{label}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  `w-full justify-start text-left font-normal ${error ? "border-red-400 focus-visible:ring-red-400" : ""}`,
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field && field?.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                defaultMonth={field.value}
                captionLayout="dropdown"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false); // Close on select
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
}
