
import { Vehicle } from '../../hooks/useVehicles/types';
import { useAuth } from '../../contexts/AuthContext';

interface VehicleActionsProps {
  vehicles: Vehicle[];
  canEditVehicles: boolean;
  createVehicle: (vehicleData: any) => Promise<Vehicle>;
  updateVehicle: (id: string, vehicleData: any) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  onEditingChange: (vehicle: Vehicle | null) => void;
  onFormToggle: (show: boolean) => void;
}

export const useVehicleActions = ({
  canEditVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  onEditingChange,
  onFormToggle
}: VehicleActionsProps) => {
  
  const handleSaveVehicle = async (vehicleData: any, editingVehicle: Vehicle | null) => {
    try {
      console.log('VehicleActions - handleSaveVehicle called with:', vehicleData);
      console.log('VehicleActions - editingVehicle:', editingVehicle);
      
      if (editingVehicle && editingVehicle.id) {
        // Se tem ID válido, é uma edição
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        // Se não tem ID ou é duplicação, é criação
        await createVehicle(vehicleData);
      }
      onFormToggle(false);
      onEditingChange(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    console.log('VehicleActions - handleEditVehicle called with:', vehicle);
    
    // Passar o objeto vehicle diretamente do banco de dados
    onEditingChange(vehicle);
    onFormToggle(true);
  };

  const handleDuplicateVehicle = (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    console.log('VehicleActions - handleDuplicateVehicle called with:', vehicle);
    
    // Criar uma cópia sem ID para forçar criação de novo veículo
    const duplicatedVehicle = {
      name: `${vehicle.name} (Cópia)`,
      vin: '',
      year: vehicle.year,
      model: vehicle.model,
      miles: vehicle.miles,
      internal_code: '',
      color: vehicle.color,
      ca_note: vehicle.ca_note,
      purchase_price: vehicle.purchase_price,
      sale_price: vehicle.sale_price,
      min_negotiable: vehicle.min_negotiable,
      carfax_price: vehicle.carfax_price,
      mmr_value: vehicle.mmr_value,
      description: vehicle.description,
      category: vehicle.category,
      title_type: vehicle.title_type,
      title_status: vehicle.title_status,
      photos: vehicle.photos,
      video: vehicle.video
    };
    
    // Não incluir ID para garantir que será tratado como criação
    onEditingChange(duplicatedVehicle as Vehicle);
    onFormToggle(true);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!canEditVehicles) return;
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      await deleteVehicle(vehicle.id);
    }
  };

  return {
    handleSaveVehicle,
    handleEditVehicle,
    handleDuplicateVehicle,
    handleDeleteVehicle
  };
};
