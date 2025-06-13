
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useAISettings } from '@/hooks/useAISettings';
import OpenAIKeyForm from './OpenAIKeyForm';
import ImageInstructionsForm from './ImageInstructionsForm';
import DescriptionInstructionsForm from './DescriptionInstructionsForm';
import CardImageInstructionsForm from './CardImageInstructionsForm';
import VideoInstructionsForm from './VideoInstructionsForm';

const IASettings = () => {
  const {
    imageInstructions,
    setImageInstructions,
    descriptionInstructions,
    setDescriptionInstructions,
    cardImageInstructions,
    setCardImageInstructions,
    videoInstructions,
    setVideoInstructions,
    isLoading,
    isLoadingSettings,
    saveSettings
  } = useAISettings();

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OpenAIKeyForm />
      
      <ImageInstructionsForm 
        instructions={imageInstructions}
        onInstructionsChange={setImageInstructions}
      />
      
      <DescriptionInstructionsForm 
        instructions={descriptionInstructions}
        onInstructionsChange={setDescriptionInstructions}
      />

      <CardImageInstructionsForm 
        instructions={cardImageInstructions}
        onInstructionsChange={setCardImageInstructions}
      />

      <VideoInstructionsForm 
        instructions={videoInstructions}
        onInstructionsChange={setVideoInstructions}
      />

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Instruções'}
        </Button>
      </div>
    </div>
  );
};

export default IASettings;
