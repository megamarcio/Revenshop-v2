
import React from "react";
import { Badge } from "@/components/ui/badge";

interface LocationBadgeProps {
  location: "Mco" | "Fort" | "Mia" | "Tampa" | null;
}

const colorClass: Record<string, string> = {
  Mco: "bg-[#2563eb] text-white border-[#2563eb]",
  Fort: "bg-[#a21caf] text-white border-[#a21caf]",
  Mia: "bg-[#16a34a] text-white border-[#16a34a]",
  Tampa: "bg-[#eab308] text-[#78350f] border-[#eab308]",
};

export const LocationBadge: React.FC<LocationBadgeProps> = ({ location }) => {
  if (!location) return null;
  return (
    <Badge
      variant="secondary"
      className={
        `ml-2 flex items-center justify-center text-[9px] h-[16px] min-w-[28px] px-[7px] font-bold border rounded-full whitespace-nowrap ${colorClass[location] ?? ""}`
      }
      style={{ letterSpacing: 0.5, lineHeight: "16px" }}
    >
      {location}
    </Badge>
  );
};
