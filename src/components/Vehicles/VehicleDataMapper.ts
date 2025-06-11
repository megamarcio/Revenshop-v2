
import { VehicleUltraMinimal } from '../../hooks/useVehiclesUltraMinimal';
import { Vehicle as HookVehicle } from '../../hooks/useVehicles/types';
import { Vehicle as VehicleCardType } from './VehicleCardTypes';

export class VehicleDataMapper {
  static mapVehicleData(ultraMinimalVehicles: VehicleUltraMinimal[]) {
    // Converter dados para o formato esperado pelos componentes de card
    const convertedVehiclesForCards = ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      plate: vehicle.miles.toString(),
      internalCode: vehicle.internal_code,
      color: vehicle.color,
      caNote: vehicle.ca_note,
      purchasePrice: vehicle.purchase_price,
      salePrice: vehicle.sale_price,
      profitMargin: vehicle.profit_margin,
      minNegotiable: vehicle.min_negotiable,
      carfaxPrice: vehicle.carfax_price,
      mmrValue: vehicle.mmr_value,
      description: vehicle.description,
      category: vehicle.category,
      consignmentStore: '',
      seller: '',
      finalSalePrice: 0,
      photos: [],
      video: ''
    } as VehicleCardType));

    // Converter dados para o formato do hook useVehicles (para edição)
    const convertedVehiclesForEditing = ultraMinimalVehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      vin: vehicle.vin,
      year: vehicle.year,
      model: vehicle.model,
      miles: vehicle.miles,
      internal_code: vehicle.internal_code,
      color: vehicle.color,
      ca_note: vehicle.ca_note,
      purchase_price: vehicle.purchase_price,
      sale_price: vehicle.sale_price,
      profit_margin: vehicle.profit_margin,
      min_negotiable: vehicle.min_negotiable,
      carfax_price: vehicle.carfax_price,
      mmr_value: vehicle.mmr_value,
      description: vehicle.description,
      category: vehicle.category,
      title_type: vehicle.title_type,
      title_status: vehicle.title_status,
      photos: [],
      video: '',
      created_by: vehicle.created_by,
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at
    } as HookVehicle));

    // Função para converter de CardType para HookType para exportação
    const convertCardTypeToHookType = (vehicles: VehicleCardType[]): HookVehicle[] => {
      return vehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        vin: vehicle.vin,
        year: vehicle.year,
        model: vehicle.model,
        miles: parseInt(vehicle.plate) || 0,
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
        photos: vehicle.photos,
        video: vehicle.video
      } as HookVehicle));
    };

    return {
      convertedVehiclesForCards,
      convertedVehiclesForEditing,
      convertCardTypeToHookType
    };
  }
}
