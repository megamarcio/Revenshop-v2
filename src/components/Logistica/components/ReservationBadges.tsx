
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ReservationBadgesProps {
  rawText?: string;
}

const ReservationBadges: React.FC<ReservationBadgesProps> = ({ rawText }) => {
  if (!rawText) return null;

  const badges = [];
  const text = rawText.toLowerCase();

  // Location badges
  if (text.includes('in fort')) {
    badges.push(
      <Badge key="fort" className="bg-red-500 text-white text-[9px] font-bold px-2 py-1">
        Fort
      </Badge>
    );
  }
  
  if (text.includes('in mia')) {
    badges.push(
      <Badge key="mia" className="bg-purple-500 text-white text-[9px] font-bold px-2 py-1">
        Mia
      </Badge>
    );
  }
  
  if (text.includes('in mco')) {
    badges.push(
      <Badge key="mco" className="bg-green-500 text-white text-[9px] font-bold px-2 py-1">
        Mco
      </Badge>
    );
  }
  
  if (text.includes('in tampa')) {
    badges.push(
      <Badge key="tampa" className="bg-blue-500 text-white text-[9px] font-bold px-2 py-1">
        Tampa
      </Badge>
    );
  }

  // Equipment badges
  if (text.includes('1x car seat')) {
    badges.push(
      <Badge key="car-seat" className="bg-blue-500 text-white text-[9px] font-bold px-2 py-1">
        Car Seat
      </Badge>
    );
  }
  
  if (text.includes('1x carrinho')) {
    badges.push(
      <Badge key="stroller" className="bg-yellow-500 text-black text-[9px] font-bold px-2 py-1">
        Stroller
      </Badge>
    );
  }

  // Sign badge
  if (text.includes('sign não')) {
    badges.push(
      <Badge key="sign" className="bg-red-500 text-white text-[9px] font-bold px-2 py-1">
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
