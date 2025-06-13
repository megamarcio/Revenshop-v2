
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { saveVideoToDatabase } from './operations';
import type { VehicleVideo } from './types';

export const generateVideoWithAI = async (
  vehicleId: string,
  vehicleData: any,
  videoInstructions?: string
): Promise<VehicleVideo | null> => {
  try {
    // Preparar prompt personalizado
    const prompt = videoInstructions
      ? videoInstructions
          .replace(/\[MARCA\]/g, vehicleData.name?.split(' ')[0] || '')
          .replace(/\[MODELO\]/g, vehicleData.model || '')
          .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
          .replace(/\[COR\]/g, vehicleData.color || '')
          .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
      : `Criar um vídeo promocional profissional para o veículo ${vehicleData.name} ${vehicleData.model || ''} ${vehicleData.year || ''} ${vehicleData.color || ''}. Mostrar o veículo em movimento, destacando suas características principais.`;

    console.log('Generating video with Gemini Veo3, prompt:', prompt);

    // Chamar função edge para gerar vídeo com Gemini Veo3
    const { data, error } = await supabase.functions.invoke('generate-video-gemini', {
      body: {
        prompt,
        vehicleData
      }
    });

    if (error) throw error;

    if (data?.video_url) {
      // Salvar vídeo gerado no banco
      const videoData = await saveVideoToDatabase(
        vehicleId,
        data.video_url,
        `generated-video-${Date.now()}.mp4`,
        undefined,
        prompt,
        false
      );

      if (videoData) {
        toast({
          title: 'Sucesso',
          description: 'Vídeo gerado com IA com sucesso.',
        });
        return videoData;
      }
    }

    toast({
      title: 'Info',
      description: 'Geração de vídeo com IA iniciada. Aguarde alguns minutos.',
    });

    return null;
  } catch (error) {
    console.error('Error generating video:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao gerar vídeo com IA.',
      variant: 'destructive',
    });
    return null;
  }
};
