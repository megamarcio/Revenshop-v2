
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAISettings } from './useAISettings';

export interface VehicleCardPhoto {
  id: string;
  vehicle_id: string;
  photo_url: string;
  prompt_used?: string;
  created_at: string;
  updated_at: string;
}

export const useVehicleCardPhotos = (vehicleId?: string) => {
  const [cardPhoto, setCardPhoto] = useState<VehicleCardPhoto | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { cardImageInstructions } = useAISettings();

  const fetchCardPhoto = async () => {
    if (!vehicleId) {
      setCardPhoto(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_card_photos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle();

      if (error) throw error;
      setCardPhoto(data);
    } catch (error) {
      console.error('Error fetching card photo:', error);
      setCardPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadCardPhoto = async (file: File): Promise<VehicleCardPhoto | null> => {
    if (!vehicleId) return null;
    
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 3MB.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setUploading(true);
      console.log('Uploading card photo for vehicle:', vehicleId);

      const fileExt = file.name.split('.').pop();
      const fileName = `card-${vehicleId}-${Date.now()}.${fileExt}`;
      const filePath = `vehicle-cards/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicles-photos-new')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicles-photos-new')
        .getPublicUrl(filePath);

      // Remove existing card photo
      if (cardPhoto) {
        await supabase
          .from('vehicle_card_photos')
          .delete()
          .eq('vehicle_id', vehicleId);
      }

      // Save to database
      const { data: photoData, error: dbError } = await supabase
        .from('vehicle_card_photos')
        .insert({
          vehicle_id: vehicleId,
          photo_url: publicUrl
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setCardPhoto(photoData);

      toast({
        title: 'Sucesso',
        description: 'Foto do card enviada com sucesso.',
      });

      return photoData;
    } catch (error) {
      console.error('Error uploading card photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da foto do card.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const generateCardPhoto = async (vehicleData: any): Promise<VehicleCardPhoto | null> => {
    if (!vehicleId) return null;

    try {
      setGenerating(true);
      console.log('Generating card photo for vehicle:', vehicleId);

      const prompt = cardImageInstructions
        ? cardImageInstructions
            .replace(/\[MARCA\]/g, vehicleData.name?.split(' ')[0] || '')
            .replace(/\[MODELO\]/g, vehicleData.model || '')
            .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
            .replace(/\[COR\]/g, vehicleData.color || '')
            .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
        : `Criar uma imagem profissional e atrativa para o card de um veículo ${vehicleData.name} ${vehicleData.model || ''} ${vehicleData.year || ''} ${vehicleData.color || ''}. Estilo: foto de showroom, bem iluminada, fundo neutro, destaque para o veículo.`;

      console.log('Final prompt for card photo:', prompt);

      // Chamar função edge para gerar imagem
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          vehicleData
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        // Remove existing card photo
        if (cardPhoto) {
          await supabase
            .from('vehicle_card_photos')
            .delete()
            .eq('vehicle_id', vehicleId);
        }

        // Save to database
        const { data: photoData, error: dbError } = await supabase
          .from('vehicle_card_photos')
          .insert({
            vehicle_id: vehicleId,
            photo_url: data.imageUrl,
            prompt_used: prompt
          })
          .select()
          .single();

        if (dbError) throw dbError;

        setCardPhoto(photoData);

        toast({
          title: 'Sucesso',
          description: 'Foto do card gerada com IA com sucesso.',
        });

        return photoData;
      }

      toast({
        title: 'Info',
        description: 'Geração de imagem do card iniciada. Aguarde alguns momentos.',
      });

      return null;
    } catch (error) {
      console.error('Error generating card photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar foto do card com IA.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const removeCardPhoto = async () => {
    if (!vehicleId || !cardPhoto) return;

    try {
      const { error } = await supabase
        .from('vehicle_card_photos')
        .delete()
        .eq('vehicle_id', vehicleId);

      if (error) throw error;

      setCardPhoto(null);
      toast({
        title: 'Sucesso',
        description: 'Foto do card removida.',
      });
    } catch (error) {
      console.error('Error removing card photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover foto do card.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCardPhoto();
  }, [vehicleId]);

  return {
    cardPhoto,
    loading,
    uploading,
    generating,
    uploadCardPhoto,
    generateCardPhoto,
    removeCardPhoto,
    refetch: fetchCardPhoto
  };
};
