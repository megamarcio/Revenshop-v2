
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Copy, Trash2, Car } from 'lucide-react';

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

const VehicleList = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock vehicles data
  const [vehicles] = useState<Vehicle[]>([
    {
      id: '1',
      name: 'Honda Civic EXL 2.0',
      vin: '1HGCV1F30JA123456',
      year: 2020,
      model: 'Civic',
      plate: 'ABC-1234',
      internalCode: 'HC001',
      color: 'Preto',
      caNote: 42,
      purchasePrice: 55000,
      salePrice: 68000,
      profitMargin: 1.24,
      minNegotiable: 65000,
      carfaxPrice: 67000,
      mmrValue: 66000,
      description: 'Honda Civic EXL 2020, completo, único dono, revisões em dia.',
      category: 'forSale',
      photos: [],
    },
    {
      id: '2',
      name: 'Toyota Corolla XEI 2.0',
      vin: '1NXBR32E37Z123456',
      year: 2021,
      model: 'Corolla',
      plate: 'DEF-5678',
      internalCode: 'TC002',
      color: 'Branco',
      caNote: 45,
      purchasePrice: 60000,
      salePrice: 75000,
      profitMargin: 1.25,
      minNegotiable: 72000,
      carfaxPrice: 74000,
      mmrValue: 73000,
      description: 'Toyota Corolla XEI 2021, automático, muito conservado.',
      category: 'sold',
      seller: 'João Silva',
      finalSalePrice: 73500,
      photos: [],
    }
  ]);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('vehicles')}</h1>
          <p className="text-gray-600">Gerencie seu estoque de veículos</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-revenshop-primary hover:bg-revenshop-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addVehicle')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={`${t('search')} por nome, VIN ou placa...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-revenshop-primary/10 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-revenshop-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{vehicle.name}</CardTitle>
                    <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.color}</p>
                  </div>
                </div>
                <Badge 
                  variant={vehicle.category === 'forSale' ? 'default' : 'secondary'}
                  className={vehicle.category === 'forSale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {vehicle.category === 'forSale' ? t('forSale') : t('sold')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">VIN:</span>
                  <p className="font-medium">{vehicle.vin}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('plate')}:</span>
                  <p className="font-medium">{vehicle.plate}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('purchasePrice')}:</span>
                  <p className="font-medium text-green-600">{formatCurrency(vehicle.purchasePrice)}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('salePrice')}:</span>
                  <p className="font-medium text-blue-600">{formatCurrency(vehicle.salePrice)}</p>
                </div>
              </div>

              {vehicle.category === 'sold' && vehicle.seller && (
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <span className="text-gray-500">{t('seller')}:</span>
                  <p className="font-medium">{vehicle.seller}</p>
                  <span className="text-gray-500">{t('finalSalePrice')}:</span>
                  <p className="font-medium text-green-600">{formatCurrency(vehicle.finalSalePrice || 0)}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  {t('edit')}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Copy className="h-3 w-3 mr-1" />
                  {t('duplicate')}
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros de busca ou adicione um novo veículo.</p>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
