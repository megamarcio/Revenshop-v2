import { useState } from 'react';
import { useAISettings } from './useAISettings';
import { toast } from './use-toast';

export const useAISummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { openAIKey, summaryInstructions } = useAISettings();

  const generateSummary = async (originalText: string): Promise<string | null> => {
    if (!openAIKey) {
      toast({
        title: 'Configuração Necessária',
        description: 'Configure a chave da OpenAI nas configurações de IA',
        variant: 'destructive',
      });
      return null;
    }

    if (!originalText || originalText.trim().length === 0) {
      toast({
        title: 'Texto Inválido',
        description: 'Texto para resumir não pode estar vazio',
        variant: 'destructive',
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const instructions = summaryInstructions || 
        'Resuma esta descrição financeira em até 50 caracteres, mantendo as informações mais importantes e removendo detalhes desnecessários. Seja conciso e claro.';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: instructions
            },
            {
              role: 'user',
              content: `Resuma esta descrição: "${originalText}"`
            }
          ],
          max_tokens: 100,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Erro da OpenAI API:', response.status, errorData);
        
        if (response.status === 401) {
          toast({
            title: 'Chave API Inválida',
            description: 'Verifique a chave da OpenAI nas configurações',
            variant: 'destructive',
          });
        } else if (response.status === 429) {
          toast({
            title: 'Limite Excedido',
            description: 'Limite de requisições da OpenAI excedido. Tente novamente em alguns minutos.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro da IA',
            description: `Erro ao gerar resumo: ${response.status}`,
            variant: 'destructive',
          });
        }
        return null;
      }

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content?.trim();

      if (!summary) {
        toast({
          title: 'Erro na Resposta',
          description: 'IA não retornou um resumo válido',
          variant: 'destructive',
        });
        return null;
      }

      // Limitar a 50 caracteres se exceder
      const finalSummary = summary.length > 50 ? summary.substring(0, 47) + '...' : summary;

      toast({
        title: 'Resumo Gerado',
        description: 'Resumo criado com sucesso pela IA',
      });

      return finalSummary;

    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      toast({
        title: 'Erro de Conexão',
        description: 'Erro ao conectar com a OpenAI. Verifique sua conexão.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkSummaries = async (texts: string[]): Promise<(string | null)[]> => {
    const summaries: (string | null)[] = [];
    
    for (const text of texts) {
      const summary = await generateSummary(text);
      summaries.push(summary);
      
      // Pequena pausa para evitar rate limiting
      if (texts.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return summaries;
  };

  return {
    generateSummary,
    generateBulkSummaries,
    isGenerating,
    isConfigured: !!openAIKey,
  };
}; 