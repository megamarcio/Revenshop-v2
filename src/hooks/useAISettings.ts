
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAISettings = () => {
  const [imageInstructions, setImageInstructions] = useState('');
  const [descriptionInstructions, setDescriptionInstructions] = useState('');
  const [cardImageInstructions, setCardImageInstructions] = useState('');
  const [videoInstructions, setVideoInstructions] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [rapidApiKey, setRapidApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.rpc('get_ai_settings');
      if (error) {
        console.error('Error loading AI settings:', error);
        return;
      }
      if (data && data.length > 0) {
        const settings = data[0];
        setImageInstructions(settings.image_instructions || '');
        setDescriptionInstructions(settings.description_instructions || '');
        setCardImageInstructions(settings.card_image_instructions || '');
        setVideoInstructions(settings.video_instructions || '');
        setOpenAIKey(settings.openai_key || '');
        setGeminiKey(settings.gemini_key || '');
        setRapidApiKey(settings.rapidapi_key || '');
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc('save_ai_settings', {
        p_image_instructions: imageInstructions,
        p_description_instructions: descriptionInstructions,
        p_card_image_instructions: cardImageInstructions,
        p_video_instructions: videoInstructions,
        p_openai_key: openAIKey || null,
        p_gemini_key: geminiKey || null,
        p_rapidapi_key: rapidApiKey || null
      });

      if (error) {
        console.error('Error saving AI settings:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar configurações de IA.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Sucesso',
        description: 'Configurações de IA salvas com sucesso.',
      });
    } catch (error) {
      console.error('Error saving AI settings:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar configurações de IA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    imageInstructions,
    setImageInstructions,
    descriptionInstructions,
    setDescriptionInstructions,
    cardImageInstructions,
    setCardImageInstructions,
    videoInstructions,
    setVideoInstructions,
    openAIKey,
    setOpenAIKey,
    geminiKey,
    setGeminiKey,
    rapidApiKey,
    setRapidApiKey,
    isLoading,
    isLoadingSettings,
    saveSettings,
  };
};
