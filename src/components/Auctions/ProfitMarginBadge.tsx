import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProfitMarginBadgeProps {
  carfaxValue: number;
  mmrValue: number;
}

const ProfitMarginBadge = ({ carfaxValue, mmrValue }: ProfitMarginBadgeProps) => {
  const calculateProfitMargin = () => {
    if (!carfaxValue || !mmrValue || mmrValue === 0) return null;
    return (carfaxValue / mmrValue - 1) * 100;
  };

  const profitMargin = calculateProfitMargin();

  if (profitMargin === null) return null;

  return (
    <Badge 
      variant={profitMargin > 0 ? "default" : "destructive"}
      className={`text-lg px-3 py-1 ${profitMargin > 0 ? "bg-green-500" : ""}`}
    >
      Margem de Lucro: {profitMargin.toFixed(1)}%
    </Badge>
  );
};

export default ProfitMarginBadge;
