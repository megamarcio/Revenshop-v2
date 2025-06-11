
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  url: string;
  position: number | null;
  is_main: boolean | null;
}

export const useVehiclePhotos = (vehicleId?: string) => {
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('position', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching vehicle photos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar fotos do veículo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (url: string, position?: number) => {
    if (!vehicleId) return;

    try {
      const nextPosition = position || (photos.length > 0 ? Math.max(...photos.map(p => p.position || 0)) + 1 : 1);
      const isMain = photos.length === 0; // Primera foto é principal

      const { data, error } = await supabase
        .from('vehicle_photos')
        .insert({
          vehicle_id: vehicleId,
          url,
          position: nextPosition,
          is_main: isMain
        })
        .select()
        .single();

      if (error) throw error;
      
      setPhotos(prev => [...prev, data].sort((a, b) => (a.position || 0) - (b.position || 0)));
      return data;
    } catch (error) {
      console.error('Error adding photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar foto.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      
      toast({
        title: 'Sucesso',
        description: 'Foto removida com sucesso.',
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover foto.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const setMainPhoto = async (photoId: string) => {
    try {
      // Primeiro, remove a marca principal de todas as fotos
      await supabase
        .from('vehicle_photos')
        .update({ is_main: false })
        .eq('vehicle_id', vehicleId);

      // Depois, marca a foto selecionada como principal
      const { error } = await supabase
        .from('vehicle_photos')
        .update({ is_main: true })
        .eq('id', photoId);

      if (error) throw error;
      
      setPhotos(prev => prev.map(p => ({ 
        ...p, 
        is_main: p.id === photoId 
      })));
      
      toast({
        title: 'Sucesso',
        description: 'Foto principal atualizada.',
      });
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao definir foto principal.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [vehicleId]);

  return {
    photos,
    loading,
    addPhoto,
    removePhoto,
    setMainPhoto,
    refetch: fetchPhotos
  };
};
