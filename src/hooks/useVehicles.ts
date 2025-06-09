
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from './useVehicles/types';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      console.log('Fetching vehicles from database...');
      
      // Otimizar consulta selecionando apenas campos necessários e limitando resultados
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id, name, vin, year, model, miles, internal_code, color, 
          ca_note, purchase_price, sale_price, profit_margin, 
          min_negotiable, carfax_price, mmr_value, description, 
          category, title_type, title_status, photos, video, 
          created_at, updated_at, created_by
        `)
        .order('created_at', { ascending: false })
        .limit(100); // Limitar para evitar consultas muito pesadas

      if (error) {
        console.error('Supabase error fetching vehicles:', error);
        throw error;
      }
      
      console.log('Vehicles fetched successfully:', data?.length || 0, 'vehicles');
      setVehicles(data || []);
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
      console.log('Creating vehicle with data:', vehicleData);
      
      // Mapear os dados do formulário para o formato correto da tabela
      const dbVehicleData = {
        name: vehicleData.name,
        vin: vehicleData.vin,
        year: parseInt(vehicleData.year),
        model: vehicleData.model,
        miles: parseInt(vehicleData.plate), // O formulário usa 'plate' para milhas
        internal_code: vehicleData.internalCode,
        color: vehicleData.color,
        ca_note: parseInt(vehicleData.caNote),
        purchase_price: parseFloat(vehicleData.purchasePrice),
        sale_price: parseFloat(vehicleData.salePrice),
        min_negotiable: vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null,
        carfax_price: vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null,
        mmr_value: vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null,
        description: vehicleData.description || null,
        category: vehicleData.category as Vehicle['category'],
        title_type: vehicleData.titleInfo?.split('-')[0] === 'clean-title' ? 'clean-title' as const : 
                   vehicleData.titleInfo?.split('-')[0] === 'rebuilt' ? 'rebuilt' as const : null,
        title_status: vehicleData.titleInfo?.includes('em-maos') ? 'em-maos' as const :
                     vehicleData.titleInfo?.includes('em-transito') ? 'em-transito' as const : null,
        photos: vehicleData.photos || [],
        video: vehicleData.video || null,
        created_by: (await supabase.auth.getUser()).data.user?.id || null
      };

      console.log('Mapped vehicle data for database:', dbVehicleData);

      const { data, error } = await supabase
        .from('vehicles')
        .insert(dbVehicleData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle created successfully:', data);

      setVehicles(prev => [data, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Veículo criado com sucesso!',
      });
      return data;
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
      console.log('Updating vehicle:', id, 'with data:', vehicleData);
      
      // Mapear os dados de atualização
      const dbUpdateData: any = {};
      
      if (vehicleData.name) dbUpdateData.name = vehicleData.name;
      if (vehicleData.vin) dbUpdateData.vin = vehicleData.vin;
      if (vehicleData.year) dbUpdateData.year = parseInt(vehicleData.year);
      if (vehicleData.model) dbUpdateData.model = vehicleData.model;
      if (vehicleData.plate) dbUpdateData.miles = parseInt(vehicleData.plate);
      if (vehicleData.internalCode) dbUpdateData.internal_code = vehicleData.internalCode;
      if (vehicleData.color) dbUpdateData.color = vehicleData.color;
      if (vehicleData.caNote) dbUpdateData.ca_note = parseInt(vehicleData.caNote);
      if (vehicleData.purchasePrice) dbUpdateData.purchase_price = parseFloat(vehicleData.purchasePrice);
      if (vehicleData.salePrice) dbUpdateData.sale_price = parseFloat(vehicleData.salePrice);
      if (vehicleData.minNegotiable !== undefined) dbUpdateData.min_negotiable = vehicleData.minNegotiable ? parseFloat(vehicleData.minNegotiable) : null;
      if (vehicleData.carfaxPrice !== undefined) dbUpdateData.carfax_price = vehicleData.carfaxPrice ? parseFloat(vehicleData.carfaxPrice) : null;
      if (vehicleData.mmrValue !== undefined) dbUpdateData.mmr_value = vehicleData.mmrValue ? parseFloat(vehicleData.mmrValue) : null;
      if (vehicleData.description !== undefined) dbUpdateData.description = vehicleData.description;
      if (vehicleData.category) dbUpdateData.category = vehicleData.category;
      
      // Processar informações do título
      if (vehicleData.titleInfo !== undefined) {
        console.log('Processing titleInfo:', vehicleData.titleInfo);
        
        if (vehicleData.titleInfo) {
          const titleParts = vehicleData.titleInfo.split('-');
          console.log('Title parts:', titleParts);
          
          if (titleParts[0] === 'clean-title' || titleParts[0] === 'rebuilt') {
            dbUpdateData.title_type = titleParts[0];
          } else {
            dbUpdateData.title_type = null;
          }
          
          if (titleParts.length > 1) {
            const statusPart = titleParts.slice(1).join('-');
            if (statusPart === 'em-maos' || statusPart === 'em-transito') {
              dbUpdateData.title_status = statusPart;
            } else {
              dbUpdateData.title_status = null;
            }
          } else {
            dbUpdateData.title_status = null;
          }
        } else {
          dbUpdateData.title_type = null;
          dbUpdateData.title_status = null;
        }
      }
      
      if (vehicleData.photos !== undefined) {
        dbUpdateData.photos = vehicleData.photos || [];
      }
      
      if (vehicleData.video !== undefined) {
        dbUpdateData.video = vehicleData.video || null;
      }

      console.log('Update data being sent to database:', dbUpdateData);

      const { data, error } = await supabase
        .from('vehicles')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle updated successfully:', data);

      setVehicles(prev => prev.map(v => v.id === id ? data : v));
      toast({
        title: 'Sucesso',
        description: 'Veículo atualizado com sucesso!',
      });
      return data;
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
      console.log('Deleting vehicle:', id);
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting vehicle:', error);
        throw error;
      }
      
      console.log('Vehicle deleted successfully');
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
