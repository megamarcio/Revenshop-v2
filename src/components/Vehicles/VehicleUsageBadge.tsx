
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VehicleUsageBadgeProps {
  usage?: string;
  consignmentStore?: string;
}

const VehicleUsageBadge: React.FC<VehicleUsageBadgeProps> = ({ 
  usage,
  consignmentStore 
}) => {
  console.log('VehicleUsageBadge - Received usage:', usage);
  console.log('VehicleUsageBadge - Received consignmentStore:', consignmentStore);

  // Get badge color and text based on usage
  const getBadgeProps = (usageType: string) => {
    switch (usageType) {
      case 'rental':
        return { 
          variant: 'outline' as const, 
          text: 'Aluguel', 
          className: 'bg-blue-600 text-white border-blue-600' 
        };
      case 'personal':
        return { 
          variant: 'outline' as const, 
          text: 'Uso Próprio', 
          className: 'bg-green-600 text-white border-green-600' 
        };
      case 'sale':
        return { 
          variant: 'default' as const, 
          text: 'Venda', 
          className: 'bg-purple-600 text-white' 
        };
      case 'consigned':
        return { 
          variant: 'outline' as const, 
          text: consignmentStore || 'Consignado', 
          className: 'bg-orange-600 text-white border-orange-600' 
        };
      default:
        return { 
          variant: 'default' as const, 
          text: 'Venda', 
          className: 'bg-purple-600 text-white' 
        };
    }
  };

  const badgeProps = getBadgeProps(usage || 'sale');
  
  console.log('VehicleUsageBadge - Final badge text:', badgeProps.text);

  return (
    <Badge 
      variant={badgeProps.variant}
      className={`text-xs font-medium ${badgeProps.className} shadow-md`}
    >
      {badgeProps.text}
    </Badge>
  );
};

export default VehicleUsageBadge;
