
import React from 'react';
import { Badge } from '@/components/ui/badge';

const USAGE_LABELS = {
  personal: 'Pessoal',
  rental: 'Aluguel', 
  sale: 'Venda',
  consigned: 'Consignado',
  'sale-rental': 'Venda/Aluguel',
  maintenance: 'Manutenção'
};

const USAGE_VARIANTS = {
  personal: 'secondary',
  rental: 'default',
  sale: 'default', 
  consigned: 'outline',
  'sale-rental': 'secondary',
  maintenance: 'destructive'
} as const;

interface VehicleUsageBadgeProps {
  usage: string;
  className?: string;
}

const VehicleUsageBadge = ({ usage, className }: VehicleUsageBadgeProps) => {
  const label = USAGE_LABELS[usage as keyof typeof USAGE_LABELS] || usage;
  const variant = USAGE_VARIANTS[usage as keyof typeof USAGE_VARIANTS] || 'default';

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default VehicleUsageBadge;
