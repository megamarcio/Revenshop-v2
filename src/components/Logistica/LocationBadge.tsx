
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
  try {
    if (!location) {
      return (
        <Badge
          variant="secondary"
          className="ml-2 flex items-center justify-center text-[9px] h-[16px] min-w-[28px] px-[7px] font-bold border rounded-full whitespace-nowrap bg-gray-100 text-gray-600 border-gray-200"
          style={{ letterSpacing: 0.5, lineHeight: "16px" }}
        >
          N/A
        </Badge>
      );
    }

    const colorStyles = colorClass[location] || "bg-gray-100 text-gray-600 border-gray-200";
    
    return (
      <Badge
        variant="secondary"
        className={`ml-2 flex items-center justify-center text-[9px] h-[16px] min-w-[28px] px-[7px] font-bold border rounded-full whitespace-nowrap ${colorStyles}`}
        style={{ letterSpacing: 0.5, lineHeight: "16px" }}
      >
        {location}
      </Badge>
    );
  } catch (error) {
    console.error('Error rendering LocationBadge:', error, { location });
    return (
      <Badge
        variant="secondary"
        className="ml-2 flex items-center justify-center text-[9px] h-[16px] min-w-[28px] px-[7px] font-bold border rounded-full whitespace-nowrap bg-red-100 text-red-600 border-red-200"
        style={{ letterSpacing: 0.5, lineHeight: "16px" }}
      >
        ERR
      </Badge>
    );
  }
};
