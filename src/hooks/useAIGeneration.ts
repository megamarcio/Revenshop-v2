
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
  vin?: string;
  precoVenda?: string;
}

interface GenerationOptions {
  imageSize?: string;
  textLength?: string;
}

export const useAIGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateDescription = async (vehicleData: VehicleData, options?: GenerationOptions): Promise<string> => {
    setIsLoading(true);
    try {
      // Formato específico solicitado
      const description = `🚗 ${vehicleData.ano} ${vehicleData.marca.toUpperCase()} ${vehicleData.modelo.toUpperCase()} – Clean - In Hands 🚗

📍 Located in Orlando, FL
💰 Price: $${vehicleData.precoVenda || '0.00'}

✅ Only ${vehicleData.quilometragem || '0'} miles
✅ Clean Title – No Accidents
✅ Non-smoker
✅ Runs and drives like new!
✅ Super Fuel Efficient

🛠️ Recent Maintenance Done:
• Fresh oil change
• Good tires
• Brake pads replaced
• Cold A/C just serviced

📋 VIN ${vehicleData.vin || 'N/A'}
💼 Financing available
🧽 Clean inside & out (no smells) – Ready to go!
💵 You're Welcome

⚠️ Serious buyers only. Test drives by appointment.
⚠️ No Dealer Fee.
📲 Send a message now.`;

      return description;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (vehicleData: VehicleData, options?: GenerationOptions): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          vehicleData,
          imageSize: options?.imageSize || '1024x1024'
        }
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
