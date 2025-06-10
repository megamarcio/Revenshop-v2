
import React from 'react';

interface VehicleListResultsProps {
  vehicleCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const VehicleListResults = ({ vehicleCount, totalCount, currentPage, totalPages }: VehicleListResultsProps) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>
        Mostrando {vehicleCount} de {totalCount} veículos
      </span>
      <span>
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};
