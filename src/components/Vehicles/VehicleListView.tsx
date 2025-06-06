
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash2, ExternalLink } from 'lucide-react';
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

  const handleCarfaxLookup = (vin: string) => {
    const carfaxUrl = `https://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVG_0&vin=${vin}`;
    window.open(carfaxUrl, '_blank');
  };

  // Sort vehicles by internal code from smallest to largest
  const sortedVehicles = [...vehicles].sort((a, b) => {
    return a.internalCode.localeCompare(b.internalCode, undefined, { numeric: true });
  });

  return (
    <div className="border rounded-lg text-sm">
      <Table>
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead className="text-sm">Código/Nome</TableHead>
            <TableHead className="text-sm">Cor</TableHead>
            <TableHead className="text-sm">Valor de Venda</TableHead>
            <TableHead className="text-sm">VIN</TableHead>
            <TableHead className="text-sm">Status</TableHead>
            <TableHead className="text-sm">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="text-sm">
              <TableCell className="text-sm">
                <div>
                  <div className="font-bold text-[11px]">
                    {vehicle.internalCode} - {vehicle.name}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">{vehicle.color}</TableCell>
              <TableCell className="text-blue-600 text-sm whitespace-nowrap">{formatCurrency(vehicle.salePrice)}</TableCell>
              <TableCell className="text-sm whitespace-nowrap" style={{ fontSize: '10px' }}>{vehicle.vin}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                <Badge 
                  variant={vehicle.category === 'forSale' ? 'default' : 'secondary'}
                  className={`text-xs ${vehicle.category === 'forSale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {vehicle.category === 'forSale' ? t('forSale') : t('sold')}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(vehicle)}
                    className="h-6 w-6 p-0"
                    title="Editar"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDuplicate(vehicle)}
                    className="h-6 w-6 p-0"
                    title="Duplicar"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCarfaxLookup(vehicle.vin)}
                    className="h-6 w-6 p-0"
                    title="Consultar Carfax"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                    onClick={() => onDelete && onDelete(vehicle)}
                    title="Excluir"
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
