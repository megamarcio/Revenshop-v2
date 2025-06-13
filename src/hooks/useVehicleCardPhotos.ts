
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
      const { data, error } = await supabase
        .from('vehicle_card_photos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching card photo:', error);
        setCardPhoto(null);
      } else {
        setCardPhoto(data || null);
      }
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

      // Remove existing card photo if any
      if (cardPhoto) {
        await removeCardPhoto();
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
        description: 'Foto do card atualizada com sucesso.',
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

      // Get AI settings for card prompt
      const { data: aiSettings } = await supabase.rpc('get_ai_settings');
      const cardPrompt = aiSettings?.[0]?.card_image_instructions || 
        'Criar uma imagem profissional e atrativa para o card de um veículo [MARCA] [MODELO] [ANO] [COR]. Estilo: foto de showroom, bem iluminada, fundo neutro, destaque para o veículo.';

      // Replace placeholders in prompt
      const finalPrompt = cardPrompt
        .replace(/\[MARCA\]/g, vehicleData.name?.split(' ')[0] || '')
        .replace(/\[MODELO\]/g, vehicleData.model || '')
        .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
        .replace(/\[COR\]/g, vehicleData.color || '');

      // Call edge function to generate image
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: finalPrompt,
          vehicleData,
          imageSize: '1024x1024'
        }
      });

      if (imageError) throw imageError;

      // Convert base64 to blob and upload
      const base64Data = imageData.imageUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const fileName = `card-ai-${vehicleId}-${Date.now()}.png`;
      const filePath = `vehicle-cards/${fileName}`;

      // Upload generated image
      const { error: uploadError } = await supabase.storage
        .from('vehicles-photos-new')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicles-photos-new')
        .getPublicUrl(filePath);

      // Remove existing card photo if any
      if (cardPhoto) {
        await removeCardPhoto();
      }

      // Save to database
      const { data: photoData, error: dbError } = await supabase
        .from('vehicle_card_photos')
        .insert({
          vehicle_id: vehicleId,
          photo_url: publicUrl,
          prompt_used: finalPrompt
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setCardPhoto(photoData);
      
      toast({
        title: 'Sucesso',
        description: 'Foto do card gerada com sucesso pela IA.',
      });

      return photoData;
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
    if (!cardPhoto) return;

    try {
      // Extract file path from URL for storage deletion
      const url = new URL(cardPhoto.photo_url);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.findIndex(segment => segment === 'vehicles-photos-new');
      
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
        
        // Remove from storage
        await supabase.storage
          .from('vehicles-photos-new')
          .remove([storagePath]);
      }

      // Remove from database
      const { error } = await supabase
        .from('vehicle_card_photos')
        .delete()
        .eq('id', cardPhoto.id);

      if (error) throw error;

      setCardPhoto(null);
      
      toast({
        title: 'Sucesso',
        description: 'Foto do card removida com sucesso.',
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
