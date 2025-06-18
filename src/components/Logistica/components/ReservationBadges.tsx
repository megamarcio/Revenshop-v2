import React from "react";
import { Badge } from "@/components/ui/badge";

interface ReservationBadgesProps {
  rawText?: string;
}

const ReservationBadges: React.FC<ReservationBadgesProps> = ({ rawText }) => {
  if (!rawText) return null;

  const badges = [];
  const text = rawText.toLowerCase();

  // Customer-based badges (new conditions)
  if (text.includes('booster')) {
    badges.push(
      <Badge key="booster" className="bg-orange-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        Booster
      </Badge>
    );
  }

  if (text.includes('in mia') || text.includes('out mia')) {
    badges.push(
      <Badge key="mia" className="bg-purple-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        Mia
      </Badge>
    );
  }
  
  if (text.includes('in fort') || text.includes('out fort')) {
    badges.push(
      <Badge key="fort" className="bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        Fort
      </Badge>
    );
  }

  // Location badges (keep existing conditions but with smaller size)
  if (text.includes('in mco')) {
    badges.push(
      <Badge key="mco" className="bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        MCO
      </Badge>
    );
  }
  
  if (text.includes('in tampa')) {
    badges.push(
      <Badge key="tampa" className="bg-blue-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        Tampa
      </Badge>
    );
  }

  // Equipment badges (keep existing conditions but with smaller size)
  if (text.includes('1x car seat')) {
    badges.push(
      <Badge key="car-seat" className="bg-blue-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        Car Seat
      </Badge>
    );
  }
  
  if (text.includes('1x carrinho')) {
    badges.push(
      <Badge key="stroller" className="bg-yellow-500 text-black text-[8px] font-bold px-1 py-0.5 h-4">
        Stroller
      </Badge>
    );
  }

  // Sign badge (keep existing condition but with smaller size)
  if (text.includes('sign não')) {
    badges.push(
      <Badge key="sign" className="bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 h-4">
        Sign
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {badges}
    </div>
  );
};

export default ReservationBadges;
