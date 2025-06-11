
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VehicleMinimal {
  id: string;
  name: string;
  vin: string;
  year: number;
  model: string;
  miles: number;
  internal_code: string;
  color: string;
  purchase_price: number;
  sale_price: number;
  profit_margin: number;
  min_negotiable?: number;
  carfax_price?: number;
  mmr_value?: number;
  description?: string;
  category: 'forSale' | 'sold' | 'rental' | 'maintenance' | 'consigned';
  created_at: string;
  updated_at: string;
  created_by?: string;
  video?: string;
  title_type_id?: string;
  
  // Campos de financiamento
  financing_bank?: string;
  financing_type?: string;
  original_financed_name?: string;
  purchase_date?: string;
  due_date?: string;
  installment_value?: number;
  down_payment?: number;
  financed_amount?: number;
  total_installments?: number;
  paid_installments?: number;
  remaining_installments?: number;
  total_to_pay?: number;
  payoff_value?: number;
  payoff_date?: string;
  interest_rate?: number;
  custom_financing_bank?: string;
  
  photos: string[];
}

export const useVehiclesUltraMinimal = () => {
  const [vehicles, setVehicles] = useState<VehicleMinimal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      
      // Buscar veículos básicos
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          id,
          name,
          vin,
          year,
          model,
          miles,
          internal_code,
          color,
          purchase_price,
          sale_price,
          profit_margin,
          min_negotiable,
          carfax_price,
          mmr_value,
          description,
          category,
          created_at,
          updated_at,
          created_by,
          video,
          title_type_id,
          financing_bank,
          financing_type,
          original_financed_name,
          purchase_date,
          due_date,
          installment_value,
          down_payment,
          financed_amount,
          total_installments,
          paid_installments,
          remaining_installments,
          total_to_pay,
          payoff_value,
          payoff_date,
          interest_rate,
          custom_financing_bank
        `)
        .order('created_at', { ascending: false });

      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError);
        throw vehiclesError;
      }

      // Buscar fotos dos veículos
      const vehicleIds = vehiclesData?.map(v => v.id) || [];
      let photosData: any[] = [];
      
      if (vehicleIds.length > 0) {
        const { data: photos, error: photosError } = await supabase
          .from('vehicle_photos')
          .select('vehicle_id, url')
          .in('vehicle_id', vehicleIds);

        if (photosError) {
          console.error('Error fetching photos:', photosError);
          // Continue sem fotos em caso de erro
        } else {
          photosData = photos || [];
        }
      }

      // Mapear veículos com suas fotos
      const mappedVehicles: VehicleMinimal[] = vehiclesData?.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        vin: vehicle.vin,
        year: vehicle.year,
        model: vehicle.model,
        miles: vehicle.miles,
        internal_code: vehicle.internal_code,
        color: vehicle.color,
        purchase_price: vehicle.purchase_price,
        sale_price: vehicle.sale_price,
        profit_margin: vehicle.profit_margin,
        min_negotiable: vehicle.min_negotiable,
        carfax_price: vehicle.carfax_price,
        mmr_value: vehicle.mmr_value,
        description: vehicle.description,
        category: vehicle.category,
        created_at: vehicle.created_at,
        updated_at: vehicle.updated_at,
        created_by: vehicle.created_by,
        
        video: vehicle.video,
        title_type_id: vehicle.title_type_id,
        
        // Campos de financiamento
        financing_bank: vehicle.financing_bank,
        financing_type: vehicle.financing_type,
        original_financed_name: vehicle.original_financed_name,
        purchase_date: vehicle.purchase_date,
        due_date: vehicle.due_date,
        installment_value: vehicle.installment_value,
        down_payment: vehicle.down_payment,
        financed_amount: vehicle.financed_amount,
        total_installments: vehicle.total_installments,
        paid_installments: vehicle.paid_installments,
        remaining_installments: vehicle.remaining_installments,
        total_to_pay: vehicle.total_to_pay,
        payoff_value: vehicle.payoff_value,
        payoff_date: vehicle.payoff_date,
        interest_rate: vehicle.interest_rate,
        custom_financing_bank: vehicle.custom_financing_bank,
        
        photos: photosData
          .filter(photo => photo.vehicle_id === vehicle.id)
          .map(photo => photo.url)
      })) || [];

      setVehicles(mappedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar veículos. Tente novamente.',
        variant: 'destructive',
      });
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    refetch: fetchVehicles,
  };
};
