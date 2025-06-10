
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: string;
  cor?: string;
  motor?: string;
  quilometragem?: string;
  equipamentos?: string;
}

export const useVehicleSelection = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, marca, modelo, ano, cor, motor, quilometragem, equipamentos')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vehicles,
    isLoading,
    refreshVehicles: fetchVehicles
  };
};
