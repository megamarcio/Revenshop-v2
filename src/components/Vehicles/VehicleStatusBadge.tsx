
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VehicleStatusBadgeProps {
  category: string;
  extended_category?: string;
  consignment_store?: string;
}

const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ 
  category, 
  extended_category, 
  consignment_store 
}) => {
  // Determine the actual category to display
  const displayCategory = extended_category || category;
  
  // Get badge color and text based on category
  const getBadgeProps = (cat: string) => {
    switch (cat) {
      case 'forSale':
        return { variant: 'default' as const, text: 'À Venda', className: 'bg-green-600 text-white' };
      case 'sold':
        return { variant: 'secondary' as const, text: 'Vendido', className: 'bg-gray-600 text-white' };
      case 'rental':
        return { variant: 'outline' as const, text: 'Aluguel', className: 'bg-blue-600 text-white border-blue-600' };
      case 'maintenance':
        return { variant: 'outline' as const, text: 'Manutenção', className: 'bg-orange-600 text-white border-orange-600' };
      case 'consigned':
        return { variant: 'outline' as const, text: consignment_store || 'Consignado', className: 'bg-purple-600 text-white border-purple-600' };
      default:
        return { variant: 'default' as const, text: 'À Venda', className: 'bg-green-600 text-white' };
    }
  };

  const badgeProps = getBadgeProps(displayCategory);

  return (
    <Badge 
      variant={badgeProps.variant}
      className={`absolute top-2 left-2 text-xs font-medium ${badgeProps.className} shadow-md`}
    >
      {badgeProps.text}
    </Badge>
  );
};

export default VehicleStatusBadge;
