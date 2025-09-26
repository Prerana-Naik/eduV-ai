// "use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface ModeToggleProps {
  value: "student" | "teacher";
  onValueChange: (val: "student" | "teacher") => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ value, onValueChange }) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onValueChange(val as "student" | "teacher");
      }}
      className="bg-white shadow-md border rounded-lg px-2 py-1"
    >
      <ToggleGroupItem value="student" className="px-4 py-2">
        Student
      </ToggleGroupItem>
      <ToggleGroupItem value="teacher" className="px-4 py-2">
        Teacher
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ModeToggle;
