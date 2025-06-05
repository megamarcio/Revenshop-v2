
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../hooks/useVehicles';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye, Download } from 'lucide-react';

interface VehicleListViewProps {
  searchTerm: string;
  categoryFilter: string;
  onEdit?: (vehicle: any) => void;
  onDelete?: (vehicleId: string) => void;
  onView?: (vehicle: any) => void;
  showCostInfo: boolean;
}

const VehicleListView = ({ 
  searchTerm, 
  categoryFilter, 
  onEdit, 
  onDelete, 
  onView, 
  showCostInfo 
}: VehicleListViewProps) => {
  const { t } = useLanguage();
  const { vehicles, loading } = useVehicles();

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.internal_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || vehicle.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getPriorityColor = (category: string) => {
    switch (category) {
      case 'sold': return 'bg-green-100 text-green-800';
      case 'forSale': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sold': return 'Vendido';
      case 'forSale': return 'À Venda';
      default: return category;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">Carregando veículos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Veículo</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Milhas</TableHead>
              <TableHead>Status</TableHead>
              {showCostInfo && <TableHead>Preço Compra</TableHead>}
              <TableHead>Preço Venda</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{vehicle.year} {vehicle.name}</p>
                    <p className="text-sm text-gray-500">{vehicle.model}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                <TableCell>{vehicle.internal_code}</TableCell>
                <TableCell>{vehicle.miles?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(vehicle.category)}>
                    {getCategoryLabel(vehicle.category)}
                  </Badge>
                </TableCell>
                {showCostInfo && (
                  <TableCell className="text-green-600 font-medium">
                    ${vehicle.purchase_price?.toLocaleString()}
                  </TableCell>
                )}
                <TableCell className="text-blue-600 font-medium">
                  ${vehicle.sale_price?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(vehicle)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(vehicle.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VehicleListView;
