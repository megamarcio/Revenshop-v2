
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
    console.log('🎬 Iniciando geração de vídeo com IA...');
    console.log('🔍 Vehicle ID:', vehicleId);
    console.log('📋 Vehicle data received:', vehicleData);
    console.log('📝 Video instructions:', videoInstructions);

    // Verificar se há dados do veículo
    if (!vehicleData || !vehicleData.name) {
      console.error('❌ Dados do veículo são obrigatórios');
      toast({
        title: 'Erro',
        description: 'Dados do veículo são necessários para gerar o vídeo.',
        variant: 'destructive',
      });
      return null;
    }

    // Preparar dados do veículo para substituição no prompt
    const vehicleName = vehicleData.name || '';
    const vehicleParts = vehicleName.split(' ');
    const marca = vehicleParts[0] || '';
    const modelo = vehicleParts.slice(1).join(' ') || vehicleData.model || '';
    
    // Criar prompt personalizado usando as instruções das configurações ou usar padrão
    let prompt = videoInstructions || 'Criar um vídeo promocional profissional para o veículo [MARCA] [MODELO] [ANO] na cor [COR]. Mostrar o veículo em movimento, destacando suas características principais, com boa iluminação e ângulos dinâmicos.';
    
    // Substituir placeholders com dados do formulário atual
    prompt = prompt
      .replace(/\[MARCA\]/g, marca)
      .replace(/\[MODELO\]/g, modelo)
      .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
      .replace(/\[COR\]/g, vehicleData.color || '')
      .replace(/\[NOME_COMPLETO\]/g, vehicleName)
      .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
      .replace(/\[QUILOMETRAGEM\]/g, vehicleData.miles?.toString() || '')
      .replace(/\[MILHAS\]/g, vehicleData.miles?.toString() || '')
      .replace(/\[VIN\]/g, vehicleData.vin || '')
      .replace(/\[PRECO_VENDA\]/g, vehicleData.salePrice?.toString() || '')
      .replace(/\[CODIGO_INTERNO\]/g, vehicleData.internalCode || '');

    console.log('📝 Final prompt for video:', prompt);

    // Chamar função edge para gerar vídeo
    console.log('🌐 Chamando edge function generate-video-gemini...');
    const { data, error } = await supabase.functions.invoke('generate-video-gemini', {
      body: {
        prompt,
        vehicleData,
        vehicleId
      }
    });

    if (error) {
      console.error('❌ Error calling edge function:', error);
      toast({
        title: 'Erro',
        description: `Erro na geração do vídeo: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    }

    console.log('✅ Edge function response:', data);

    if (data?.video_data) {
      console.log('🎉 Vídeo gerado e salvo com sucesso!');
      toast({
        title: 'Sucesso',
        description: 'Vídeo gerado com IA com sucesso.',
      });
      return data.video_data;
    } else {
      console.log('⏳ Geração em andamento...');
      toast({
        title: 'Info',
        description: 'Geração de vídeo iniciada. Aguarde alguns momentos.',
      });
    }

    return null;
  } catch (error) {
    console.error('❌ Error generating video:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao gerar vídeo com IA. Verifique se a chave do Gemini está configurada corretamente.',
      variant: 'destructive',
    });
    return null;
  }
};
