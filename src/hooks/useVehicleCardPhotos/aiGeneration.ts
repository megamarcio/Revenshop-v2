
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
    console.log('Vehicle data received:', vehicleData);
    console.log('Card image instructions:', cardImageInstructions);

    // Preparar dados do veículo para substituição no prompt
    const vehicleName = vehicleData.name || '';
    const vehicleParts = vehicleName.split(' ');
    const marca = vehicleParts[0] || '';
    const modelo = vehicleParts.slice(1).join(' ') || '';
    
    const prompt = cardImageInstructions
      ? cardImageInstructions
          .replace(/\[MARCA\]/g, marca)
          .replace(/\[MODELO\]/g, modelo)
          .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
          .replace(/\[COR\]/g, vehicleData.color || '')
          .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
      : `Criar uma imagem profissional e atrativa para o card de um veículo ${vehicleName} ${vehicleData.year || ''} ${vehicleData.color || ''}. Estilo: foto de showroom, bem iluminada, fundo neutro, destaque para o veículo, alta qualidade, realista.`;

    console.log('Final prompt for card photo:', prompt);

    // Chamar função edge para gerar imagem
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt,
        vehicleData
      }
    });

    if (error) {
      console.error('Error calling edge function:', error);
      throw error;
    }

    console.log('Edge function response:', data);

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
      description: 'Erro ao gerar foto do card com IA. Verifique se a chave da OpenAI está configurada.',
      variant: 'destructive',
    });
    return null;
  }
};
