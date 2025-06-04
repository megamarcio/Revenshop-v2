
import React, { useState } from 'react';
import VehicleForm from './VehicleForm';
import VehicleCard from './VehicleCard';
import VehicleListHeader from './VehicleListHeader';
import VehicleSearchBar from './VehicleSearchBar';
import EmptyVehicleState from './EmptyVehicleState';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

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

  const handleSaveVehicle = (vehicleData: Vehicle) => {
    console.log('Salvando veículo:', vehicleData);
    // Aqui seria feita a integração com a API
    setShowAddForm(false);
    setEditingVehicle(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddForm(true);
  };

  const handleDuplicateVehicle = (vehicle: Vehicle) => {
    const duplicatedVehicle = {
      ...vehicle,
      id: undefined,
      name: `${vehicle.name} (Cópia)`,
      vin: '',
      plate: '',
      internalCode: ''
    };
    setEditingVehicle(duplicatedVehicle);
    setShowAddForm(true);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <VehicleListHeader onAddVehicle={() => setShowAddForm(true)} />
      
      <VehicleSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEditVehicle}
            onDuplicate={handleDuplicateVehicle}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && <EmptyVehicleState />}

      {/* Vehicle Form Modal */}
      {showAddForm && (
        <VehicleForm
          onClose={() => {
            setShowAddForm(false);
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
          editingVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
