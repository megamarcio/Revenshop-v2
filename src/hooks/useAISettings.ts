
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AISettings {
  image_instructions: string;
  description_instructions: string;
}

export const useAISettings = () => {
  const [imageInstructions, setImageInstructions] = useState('');
  const [descriptionInstructions, setDescriptionInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoadingSettings(true);
      
      // For now, we'll use a workaround since the types aren't updated yet
      const { data: settings, error } = await supabase
        .rpc('get_ai_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações:', error);
      }

      if (settings) {
        setImageInstructions(settings.image_instructions || '');
        setDescriptionInstructions(settings.description_instructions || '');
      } else {
        // Set default instructions
        const defaultImageInstructions = `Criar uma imagem realista e profissional de um veículo baseado nas seguintes especificações:
- Modelo: [MODELO]
- Ano: [ANO] 
- Cor: [COR]
- Estilo: Foto profissional em showroom ou ambiente neutro
- Qualidade: Alta resolução, bem iluminado
- Perspectiva: Vista lateral/frontal que destaque as características do veículo`;

        const defaultDescriptionInstructions = `Criar uma descrição atrativa e profissional para um veículo usado/seminovo seguindo este modelo:
- Iniciar com características principais (marca, modelo, ano, motor)
- Destacar pontos fortes e diferenciais
- Mencionar estado de conservação
- Incluir equipamentos e opcionais
- Usar linguagem comercial e persuasiva
- Finalizar com chamada para ação`;

        setImageInstructions(defaultImageInstructions);
        setDescriptionInstructions(defaultDescriptionInstructions);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Use RPC function to save settings
      const { error } = await supabase
        .rpc('save_ai_settings', {
          p_image_instructions: imageInstructions,
          p_description_instructions: descriptionInstructions
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações de IA foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    imageInstructions,
    setImageInstructions,
    descriptionInstructions,
    setDescriptionInstructions,
    isLoading,
    isLoadingSettings,
    saveSettings
  };
};
