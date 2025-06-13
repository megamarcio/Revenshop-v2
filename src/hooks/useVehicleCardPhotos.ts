
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  const fetchCardPhoto = async () => {
    if (!vehicleId) {
      setCardPhoto(null);
      return;
    }

    setLoading(true);
    try {
      // For now, just return null since the table doesn't exist yet
      console.log('Card photo fetch - table not ready yet');
      setCardPhoto(null);
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

      // For now, just show success - database operations will work after migration
      toast({
        title: 'Sucesso',
        description: 'Upload realizado com sucesso. Aguarde a configuração do banco de dados.',
      });

      return null; // Temporarily return null
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

      // Temporarily use a default prompt since AI settings might not have card_image_instructions yet
      const defaultPrompt = 'Criar uma imagem profissional e atrativa para o card de um veículo [MARCA] [MODELO] [ANO] [COR]. Estilo: foto de showroom, bem iluminada, fundo neutro, destaque para o veículo.';

      // Replace placeholders in prompt
      const finalPrompt = defaultPrompt
        .replace(/\[MARCA\]/g, vehicleData.name?.split(' ')[0] || '')
        .replace(/\[MODELO\]/g, vehicleData.model || '')
        .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
        .replace(/\[COR\]/g, vehicleData.color || '');

      console.log('Final prompt:', finalPrompt);

      // For now, just show a message since the full implementation needs the database
      toast({
        title: 'Info',
        description: 'Geração de imagem será disponibilizada após configuração do banco de dados.',
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
    console.log('Remove card photo - feature will be available after database setup');
    toast({
      title: 'Info',
      description: 'Remoção será disponibilizada após configuração do banco de dados.',
    });
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
