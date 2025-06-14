
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
    console.log('🚀 Iniciando geração de foto do card com IA...');
    console.log('🔍 Vehicle ID:', vehicleId);
    console.log('📋 Vehicle data received:', vehicleData);
    console.log('📝 Card image instructions:', cardImageInstructions);

    // Verificar se há dados do veículo
    if (!vehicleData || !vehicleData.name) {
      console.error('❌ Dados do veículo são obrigatórios');
      toast({
        title: 'Erro',
        description: 'Dados do veículo são necessários para gerar a imagem.',
        variant: 'destructive',
      });
      return null;
    }

    // Preparar dados do veículo para substituição no prompt
    const vehicleName = vehicleData.name || '';
    const vehicleParts = vehicleName.split(' ');
    const marca = vehicleParts[0] || '';
    const modelo = vehicleParts.slice(1).join(' ') || '';
    
    // Criar prompt personalizado usando as instruções das configurações ou usar padrão
    let prompt = cardImageInstructions || 'Criar uma imagem profissional e atrativa para o card de um veículo [NOME_COMPLETO] [ANO] na cor [COR]. Estilo: foto de showroom, bem iluminada, fundo neutro, destaque para o veículo, alta qualidade, realista.';
    
    // Substituir todos os placeholders disponíveis
    prompt = prompt
      .replace(/\[MARCA\]/g, marca)
      .replace(/\[MODELO\]/g, modelo)
      .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
      .replace(/\[COR\]/g, vehicleData.color || '')
      .replace(/\[NOME_COMPLETO\]/g, vehicleName)
      .replace(/\[QUILOMETRAGEM\]/g, vehicleData.miles?.toString() || '')
      .replace(/\[VIN\]/g, vehicleData.vin || '')
      .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
      .replace(/\[PRECO_VENDA\]/g, vehicleData.salePrice?.toString() || '');

    console.log('📝 Final prompt for card photo:', prompt);

    // Chamar função edge para gerar imagem
    console.log('🌐 Chamando edge function generate-image...');
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt,
        vehicleData
      }
    });

    if (error) {
      console.error('❌ Error calling edge function:', error);
      toast({
        title: 'Erro',
        description: `Erro na geração da imagem: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    }

    console.log('✅ Edge function response:', data);

    if (data?.imageUrl) {
      console.log('💾 Salvando foto do card no banco de dados...');
      const photoData = await saveCardPhotoToDatabase(vehicleId, data.imageUrl, prompt);

      if (photoData) {
        console.log('🎉 Foto do card gerada e salva com sucesso!');
        toast({
          title: 'Sucesso',
          description: 'Foto do card gerada com IA com sucesso.',
        });
        return photoData;
      }
    } else {
      console.log('⏳ Geração em andamento...');
      toast({
        title: 'Info',
        description: 'Geração de imagem do card iniciada. Aguarde alguns momentos.',
      });
    }

    return null;
  } catch (error) {
    console.error('❌ Error generating card photo:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao gerar foto do card com IA. Verifique se a chave da OpenAI está configurada corretamente.',
      variant: 'destructive',
    });
    return null;
  }
};
