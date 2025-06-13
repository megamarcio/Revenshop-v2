
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

interface VehicleListActionsProps {
  editingVehicle: VehicleCardType | null;
  setEditingVehicle: (vehicle: VehicleCardType | null) => void;
  setIsFormOpen: (open: boolean) => void;
  createVehicle: (data: any) => Promise<any>;
  updateVehicle: (id: string, data: any) => Promise<any>;
  deleteVehicle: (id: string) => Promise<void>;
  refetchList: () => Promise<void>;
}

export const useVehicleListActions = ({
  editingVehicle,
  setEditingVehicle,
  setIsFormOpen,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  refetchList,
}: VehicleListActionsProps) => {
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleCardType) => {
    console.log('VehicleListContainer - Editing vehicle:', vehicle);
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDuplicateVehicle = (vehicle: VehicleCardType) => {
    const duplicatedVehicle = { 
      ...vehicle, 
      id: undefined,
      name: `${vehicle.name} (Cópia)`,
      internalCode: ''
    };
    setEditingVehicle(duplicatedVehicle);
    setIsFormOpen(true);
  };

  const handleDeleteVehicle = async (vehicle: VehicleCardType) => {
    if (vehicle.id) {
      await deleteVehicle(vehicle.id);
      await refetchList();
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleFormSave = async (vehicleData: any) => {
    console.log('VehicleListContainer - Saving vehicle data:', vehicleData);
    
    try {
      if (vehicleData.id) {
        await updateVehicle(vehicleData.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }
      
      // Refresh the list after successful save
      await refetchList();
      
      handleFormClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  };

  // Function to handle delete from form (receives vehicle ID string)
  const handleFormDelete = async (id: string) => {
    await deleteVehicle(id);
    await refetchList();
    handleFormClose();
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    // These will be passed as props to be handled by the parent
  };

  const handleExport = (format: 'csv' | 'xls') => {
    console.log(`Exporting vehicles as ${format}`);
    // Export functionality to be implemented
  };

  // Function to handle import completion
  const handleImportComplete = async () => {
    await refetchList();
  };

  return {
    handleAddVehicle,
    handleEditVehicle,
    handleDuplicateVehicle,
    handleDeleteVehicle,
    handleFormClose,
    handleFormSave,
    handleFormDelete,
    handleSortChange,
    handleExport,
    handleImportComplete,
  };
};
