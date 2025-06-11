
import { Vehicle as HookVehicle } from '../../hooks/useVehicles/types';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

export class VehicleDataMapper {
  static mapVehicleData(hookVehicles: HookVehicle[]) {
    // Convert HookVehicle to VehicleCardType
    const convertedVehiclesForCards: VehicleCardType[] = hookVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      plate: vehicle.plate,
      internalCode: vehicle.internal_code,
      color: vehicle.color,
      caNote: vehicle.ca_note,
      purchasePrice: vehicle.purchase_price,
      salePrice: vehicle.sale_price,
      profitMargin: vehicle.profit_margin,
      minNegotiable: vehicle.min_negotiable || 0,
      carfaxPrice: vehicle.carfax_price || 0,
      mmrValue: vehicle.mmr_value || 0,
      description: vehicle.description || '',
      category: vehicle.category,
      consignmentStore: vehicle.consignment_store,
      seller: '', // Este campo não existe no HookVehicle, manter vazio
      finalSalePrice: 0, // Este campo não existe no HookVehicle, manter como 0
      photos: vehicle.photos,
      video: vehicle.video
    }));

    // Function to convert VehicleCardType back to HookVehicle for operations
    const convertCardTypeToHookType = (cardVehicles: VehicleCardType[]): HookVehicle[] => {
      return cardVehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        vin: vehicle.vin,
        year: vehicle.year,
        model: vehicle.model,
        miles: parseInt(vehicle.plate) || 0, // Corrigido: converter plate de volta para miles
        internal_code: vehicle.internalCode,
        color: vehicle.color,
        ca_note: vehicle.caNote,
        purchase_price: vehicle.purchasePrice,
        sale_price: vehicle.salePrice,
        profit_margin: vehicle.profitMargin,
        min_negotiable: vehicle.minNegotiable,
        carfax_price: vehicle.carfaxPrice,
        mmr_value: vehicle.mmrValue,
        description: vehicle.description,
        category: vehicle.category,
        consignment_store: vehicle.consignmentStore,
        title_type: undefined,
        title_status: undefined,
        photos: vehicle.photos,
        video: vehicle.video,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: undefined
      }));
    };

    return { convertedVehiclesForCards, convertCardTypeToHookType };
  }
}
