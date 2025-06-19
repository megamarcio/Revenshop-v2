
import { useState } from 'react';

export const useVehicleSelectionModal = () => {
  const [isVehicleSelectionOpen, setIsVehicleSelectionOpen] = useState(false);
  const [selectedVehicleForTechnical, setSelectedVehicleForTechnical] = useState<{
    vehicleId: string;
    vehicleName: string;
  } | null>(null);

  const openVehicleSelection = () => {
    setIsVehicleSelectionOpen(true);
  };

  const closeVehicleSelection = () => {
    setIsVehicleSelectionOpen(false);
  };

  const handleVehicleSelect = (vehicleId: string, vehicleName: string) => {
    setSelectedVehicleForTechnical({ vehicleId, vehicleName });
    setIsVehicleSelectionOpen(false);
  };

  const closeTechnicalPanel = () => {
    setSelectedVehicleForTechnical(null);
  };

  return {
    isVehicleSelectionOpen,
    selectedVehicleForTechnical,
    openVehicleSelection,
    closeVehicleSelection,
    handleVehicleSelect,
    closeTechnicalPanel,
  };
};
