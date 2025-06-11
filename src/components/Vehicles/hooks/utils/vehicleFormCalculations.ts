
import { calculateProfitMargin } from '../../utils/vehicleFormUtils';

export const useVehicleFormCalculations = (purchasePrice: string, salePrice: string) => {
  const getProfitMargin = () => calculateProfitMargin(purchasePrice, salePrice);

  return {
    calculateProfitMargin: getProfitMargin
  };
};
