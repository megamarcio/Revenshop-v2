
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VehicleData {
  marca: string;
  modelo: string;
  ano: string;
  cor?: string;
  motor?: string;
  quilometragem?: string;
  equipamentos?: string;
}

export const useAIGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateDescription = async (vehicleData: VehicleData): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { vehicleData }
      });

      if (error) {
        throw error;
      }

      return data.description;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (vehicleData: VehicleData): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { vehicleData }
      });

      if (error) {
        throw error;
      }

      return data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateDescription,
    generateImage,
    isLoading
  };
};
