
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
        .select('id, name, model, year, color, description')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Mapear os dados da tabela vehicles para o formato esperado
      const mappedVehicles: Vehicle[] = (data || []).map(vehicle => ({
        id: vehicle.id,
        marca: vehicle.name.split(' ')[0] || vehicle.name, // Assumir que o primeiro palavra é a marca
        modelo: vehicle.model,
        ano: vehicle.year.toString(),
        cor: vehicle.color,
        motor: '', // Campo não disponível na tabela atual
        quilometragem: '', // Campo não disponível na tabela atual
        equipamentos: vehicle.description || ''
      }));

      setVehicles(mappedVehicles);
      console.log('Vehicles fetched successfully:', mappedVehicles.length, 'vehicles');
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
