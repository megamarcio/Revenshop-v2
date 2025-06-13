
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { saveCardPhotoToDatabase } from './operations';
import type { VehicleCardPhoto } from './types';

export const generateCardPhotoWithAI = async (
  vehicleId: string,
  vehicleData: any,
  cardImageInstructions?: string
): Promise<VehicleCardPhoto | null> => {
  try {
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
      const photoData = await saveCardPhotoToDatabase(vehicleId, data.imageUrl, prompt);

      if (photoData) {
        toast({
          title: 'Sucesso',
          description: 'Foto do card gerada com IA com sucesso.',
        });
        return photoData;
      }
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
  }
};
