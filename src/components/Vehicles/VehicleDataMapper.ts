
import { Vehicle as HookVehicle } from '../../hooks/useVehicles/types';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

// Photo display components for vehicles
export { default as VehiclePhotoGallery } from './VehiclePhotoGallery';
export { default as VehiclePhotoThumbnails } from './VehiclePhotoThumbnails';
export { default as VehicleMainPhoto } from './VehicleMainPhoto';
export { default as VehiclePhotoViewer } from './VehiclePhotoViewer';
export { default as VehiclePhotoDisplay } from './VehiclePhotoDisplay';

export class VehicleDataMapper {
  static mapVehicleData(hookVehicles: HookVehicle[]) {
    // Convert HookVehicle to VehicleCardType
    const convertedVehiclesForCards: VehicleCardType[] = hookVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      miles: vehicle.miles || 0,
      internalCode: vehicle.internal_code,
      color: vehicle.color,
      purchasePrice: vehicle.purchase_price,
      salePrice: vehicle.sale_price,
      profitMargin: vehicle.profit_margin,
      minNegotiable: vehicle.min_negotiable || 0,
      carfaxPrice: vehicle.carfax_price || 0,
      mmrValue: vehicle.mmr_value || 0,
      description: vehicle.description || '',
      category: vehicle.category,
      consignmentStore: vehicle.consignment_store,
      seller: '',
      finalSalePrice: 0,
      // Use empty array as fallback since photos come from vehicle_photos table
      photos: [],
      video: vehicle.video,
      
      // Campos de financiamento mapeados
      financingBank: vehicle.financing_bank || '',
      financingType: vehicle.financing_type || '',
      originalFinancedName: vehicle.original_financed_name || '',
      purchaseDate: vehicle.purchase_date || '',
      dueDate: vehicle.due_date || '',
      installmentValue: vehicle.installment_value || 0,
      downPayment: vehicle.down_payment || 0,
      financedAmount: vehicle.financed_amount || 0,
      totalInstallments: vehicle.total_installments || 0,
      paidInstallments: vehicle.paid_installments || 0,
      remainingInstallments: vehicle.remaining_installments || 0,
      totalToPay: vehicle.total_to_pay || 0,
      payoffValue: vehicle.payoff_value || 0,
      payoffDate: vehicle.payoff_date || '',
      interestRate: vehicle.interest_rate || 0,
      customFinancingBank: vehicle.custom_financing_bank || ''
    }));

    // Function to convert VehicleCardType back to HookVehicle for operations
    const convertCardTypeToHookType = (cardVehicles: VehicleCardType[]): HookVehicle[] => {
      return cardVehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        vin: vehicle.vin,
        year: vehicle.year,
        model: vehicle.model,
        miles: vehicle.miles || 0,
        internal_code: vehicle.internalCode,
        color: vehicle.color,
        purchase_price: vehicle.purchasePrice,
        sale_price: vehicle.salePrice,
        profit_margin: vehicle.profitMargin,
        min_negotiable: vehicle.minNegotiable,
        carfax_price: vehicle.carfaxPrice,
        mmr_value: vehicle.mmrValue,
        description: vehicle.description,
        category: vehicle.category,
        consignment_store: vehicle.consignmentStore,
        photos: vehicle.photos,
        video: vehicle.video,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: undefined,
        
        // Campos de financiamento mapeados de volta
        financing_bank: vehicle.financingBank || '',
        financing_type: vehicle.financingType || '',
        original_financed_name: vehicle.originalFinancedName || '',
        purchase_date: vehicle.purchaseDate || '',
        due_date: vehicle.dueDate || '',
        installment_value: vehicle.installmentValue || 0,
        down_payment: vehicle.downPayment || 0,
        financed_amount: vehicle.financedAmount || 0,
        total_installments: vehicle.totalInstallments || 0,
        paid_installments: vehicle.paidInstallments || 0,
        remaining_installments: vehicle.remainingInstallments || 0,
        total_to_pay: vehicle.totalToPay || 0,
        payoff_value: vehicle.payoffValue || 0,
        payoff_date: vehicle.payoffDate || '',
        interest_rate: vehicle.interestRate || 0,
        custom_financing_bank: vehicle.customFinancingBank || ''
      }));
    };

    return { convertedVehiclesForCards, convertCardTypeToHookType };
  }

  // Helper methods for photo handling - trabalham com vehicle_photos via useVehiclePhotos hook
  static getMainPhotoUrl(vehicleId: string): string | undefined {
    // Esta função agora só retorna undefined pois as fotos devem ser buscadas via useVehiclePhotos
    return undefined;
  }

  static hasPhotos(vehicleId: string): boolean {
    // Esta função agora retorna false pois as fotos devem ser verificadas via useVehiclePhotos
    return false;
  }

  static getPhotoCount(vehicleId: string): number {
    // Esta função agora retorna 0 pois a contagem deve ser feita via useVehiclePhotos
    return 0;
  }
}
