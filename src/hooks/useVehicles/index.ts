
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from './types';
import { 
  fetchVehicles as fetchVehiclesOperation, 
  createVehicle as createVehicleOperation, 
  updateVehicle as updateVehicleOperation, 
  deleteVehicle as deleteVehicleOperation 
} from './vehicleOperations';

export type { Vehicle } from './types';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const data = await fetchVehiclesOperation();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar veículos. Tente novamente.',
        variant: 'destructive',
      });
      
      // Em caso de erro, definir array vazio para evitar estados indefinidos
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData: any) => {
    try {
      const data = await createVehicleOperation(vehicleData);
      // Ensure the returned data has photos array if missing
      const vehicleWithPhotos: Vehicle = {
        ...data,
        photos: (data as any).photos || []
      };
      setVehicles(prev => [vehicleWithPhotos, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Veículo criado com sucesso!',
      });
      return vehicleWithPhotos;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast({
        title: 'Erro',
        description: `Erro ao criar veículo: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<any>) => {
    try {
      // Garantir que o ID está incluído nos dados do veículo
      const dataWithId = { ...vehicleData, id };
      console.log('useVehicles - updateVehicle - dataWithId:', dataWithId);
      
      const data = await updateVehicleOperation(dataWithId);
      // Ensure the returned data has photos array if missing
      const vehicleWithPhotos: Vehicle = {
        ...data,
        photos: (data as any).photos || []
      };
      setVehicles(prev => prev.map(v => v.id === id ? vehicleWithPhotos : v));
      toast({
        title: 'Sucesso',
        description: 'Veículo atualizado com sucesso!',
      });
      return vehicleWithPhotos;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Erro',
        description: `Erro ao atualizar veículo: ${errorMessage}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await deleteVehicleOperation(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Veículo deletado com sucesso!',
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Erro',
        description: `Erro ao deletar veículo: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  };
};
