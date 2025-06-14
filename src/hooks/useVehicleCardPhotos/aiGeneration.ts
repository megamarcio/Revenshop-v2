import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { saveCardPhotoToDatabase } from './operations';
import type { VehicleCardPhoto } from './types';

export const generateCardPhotoWithAI = async (
  vehicleId: string,
  vehicleData: any,
  cardImageInstructions?: string,
  options?: { aiModel?: string; seed?: string }
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
    const modelo = vehicleParts.slice(1).join(' ') || vehicleData.model || '';
    
    // Criar prompt personalizado usando as instruções das configurações ou usar padrão
    let prompt = cardImageInstructions || 'Criar uma imagem profissional e atrativa para o card de um veículo [NOME_COMPLETO] [ANO] na cor [COR]. Estilo: foto de showroom, bem iluminada, fundo neutro, destaque para o veículo, alta qualidade, realista.';
    
    // Substituir TODOS os placeholders disponíveis com dados do formulário atual
    prompt = prompt
      .replace(/\[MARCA\]/g, marca)
      .replace(/\[MODELO\]/g, modelo)
      .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
      .replace(/\[COR\]/g, vehicleData.color || '')
      .replace(/\[NOME_COMPLETO\]/g, vehicleName)
      .replace(/\[QUILOMETRAGEM\]/g, vehicleData.miles?.toString() || '')
      .replace(/\[MILHAS\]/g, vehicleData.miles?.toString() || '')
      .replace(/\[VIN\]/g, vehicleData.vin || '')
      .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
      .replace(/\[PRECO_VENDA\]/g, vehicleData.salePrice?.toString() || '')
      .replace(/\[CODIGO_INTERNO\]/g, vehicleData.internalCode || '')
      .replace(/\[PRECO_COMPRA\]/g, vehicleData.purchasePrice?.toString() || '')
      .replace(/\[PRECO_MINIMO\]/g, vehicleData.minNegotiable?.toString() || '')
      .replace(/\[CARFAX_PRICE\]/g, vehicleData.carfaxPrice?.toString() || '')
      .replace(/\[MMR_VALUE\]/g, vehicleData.mmrValue?.toString() || '')
      .replace(/\[DESCRICAO\]/g, vehicleData.description || '')
      
      // Placeholders de financiamento
      .replace(/\[BANCO_FINANCIAMENTO\]/g, vehicleData.financingBank || '')
      .replace(/\[TIPO_FINANCIAMENTO\]/g, vehicleData.financingType || '')
      .replace(/\[NOME_FINANCIADO_ORIGINAL\]/g, vehicleData.originalFinancedName || '')
      .replace(/\[DATA_COMPRA\]/g, vehicleData.purchaseDate || '')
      .replace(/\[DATA_VENCIMENTO\]/g, vehicleData.dueDate || '')
      .replace(/\[VALOR_PARCELA\]/g, vehicleData.installmentValue?.toString() || '')
      .replace(/\[ENTRADA\]/g, vehicleData.downPayment?.toString() || '')
      .replace(/\[VALOR_FINANCIADO\]/g, vehicleData.financedAmount?.toString() || '')
      .replace(/\[TOTAL_PARCELAS\]/g, vehicleData.totalInstallments?.toString() || '')
      .replace(/\[PARCELAS_PAGAS\]/g, vehicleData.paidInstallments?.toString() || '')
      .replace(/\[PARCELAS_RESTANTES\]/g, vehicleData.remainingInstallments?.toString() || '')
      .replace(/\[TOTAL_PAGAR\]/g, vehicleData.totalToPay?.toString() || '')
      .replace(/\[VALOR_QUITACAO\]/g, vehicleData.payoffValue?.toString() || '')
      .replace(/\[DATA_QUITACAO\]/g, vehicleData.payoffDate || '')
      .replace(/\[TAXA_JUROS\]/g, vehicleData.interestRate?.toString() || '')
      .replace(/\[BANCO_PERSONALIZADO\]/g, vehicleData.customFinancingBank || '')
      
      // Placeholders de venda
      .replace(/\[VENDEDOR\]/g, vehicleData.seller || '')
      .replace(/\[PRECO_VENDA_FINAL\]/g, vehicleData.finalSalePrice?.toString() || '')
      .replace(/\[DATA_VENDA\]/g, vehicleData.saleDate || '')
      .replace(/\[OBSERVACOES_VENDA\]/g, vehicleData.saleNotes || '')
      .replace(/\[NOME_CLIENTE\]/g, vehicleData.customerName || '')
      .replace(/\[TELEFONE_CLIENTE\]/g, vehicleData.customerPhone || '')
      .replace(/\[METODO_PAGAMENTO\]/g, vehicleData.paymentMethod || '')
      .replace(/\[EMPRESA_FINANCIAMENTO\]/g, vehicleData.financingCompany || '')
      .replace(/\[DETALHES_CHEQUE\]/g, vehicleData.checkDetails || '')
      .replace(/\[DETALHES_OUTROS_PAGAMENTOS\]/g, vehicleData.otherPaymentDetails || '')
      .replace(/\[COMISSAO_VENDEDOR\]/g, vehicleData.sellerCommission?.toString() || '')
      
      // Placeholders de consignação
      .replace(/\[USO_VEICULO\]/g, vehicleData.vehicleUsage || '')
      .replace(/\[LOJA_CONSIGNACAO\]/g, vehicleData.consignmentStore || '');

    console.log('📝 Final prompt for card photo:', prompt);

    // Juntar seed/texto referência se informado
    let finalPrompt = prompt;
    if (options?.seed) {
      finalPrompt += `\nReferência/base: ${options.seed}`;
    }

    // Chamar edge function, agora incluindo modelo
    console.log('🌐 Chamando edge function generate-image...');
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt: finalPrompt,
        vehicleData,
        model: options?.aiModel || 'gpt-image-1'
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
