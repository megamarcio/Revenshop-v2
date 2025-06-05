
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Vehicle {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  plate: string;
  internalCode: string;
  color: string;
  caNote: number;
  purchasePrice: number;
  salePrice: number;
  profitMargin: number;
  minNegotiable: number;
  carfaxPrice: number;
  mmrValue: number;
  description: string;
  category: 'forSale' | 'sold';
  seller?: string;
  finalSalePrice?: number;
  photos: string[];
  video?: string;
}

interface VehicleListViewProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDuplicate: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

const VehicleListView = ({ vehicles, onEdit, onDuplicate, onDelete }: VehicleListViewProps) => {
  const { t } = useLanguage();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="border rounded-lg text-xs">
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead className="text-xs">Código</TableHead>
            <TableHead className="text-xs">Nome</TableHead>
            <TableHead className="text-xs">Cor</TableHead>
            <TableHead className="text-xs">Valor de Venda</TableHead>
            <TableHead className="text-xs">VIN</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="text-xs">
              <TableCell className="font-medium text-xs whitespace-nowrap">{vehicle.internalCode}</TableCell>
              <TableCell className="text-xs whitespace-nowrap">{vehicle.name}</TableCell>
              <TableCell className="text-xs whitespace-nowrap">{vehicle.color}</TableCell>
              <TableCell className="text-blue-600 text-xs whitespace-nowrap">{formatCurrency(vehicle.salePrice)}</TableCell>
              <TableCell className="text-xs whitespace-nowrap" style={{ fontSize: '10px' }}>{vehicle.vin}</TableCell>
              <TableCell className="text-xs whitespace-nowrap">
                <Badge 
                  variant={vehicle.category === 'forSale' ? 'default' : 'secondary'}
                  className={`text-xs ${vehicle.category === 'forSale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {vehicle.category === 'forSale' ? t('forSale') : t('sold')}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(vehicle)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDuplicate(vehicle)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                    onClick={() => onDelete && onDelete(vehicle)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleListView;
