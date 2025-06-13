
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAISettings } from '../useAISettings';
import { fetchCardPhoto, uploadCardPhotoToStorage, removeCardPhotoFromDatabase } from './operations';
import { generateCardPhotoWithAI } from './aiGeneration';
import type { VehicleCardPhoto } from './types';

export type { VehicleCardPhoto } from './types';

export const useVehicleCardPhotos = (vehicleId?: string) => {
  const [cardPhoto, setCardPhoto] = useState<VehicleCardPhoto | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { cardImageInstructions } = useAISettings();

  const loadCardPhoto = async () => {
    if (!vehicleId) {
      setCardPhoto(null);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Carregando foto do card para veículo:', vehicleId);
      const data = await fetchCardPhoto(vehicleId);
      console.log('📸 Resultado da busca:', data);
      setCardPhoto(data);
    } catch (error) {
      console.error('❌ Erro ao carregar foto do card:', error);
      setCardPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadCardPhoto = async (file: File): Promise<VehicleCardPhoto | null> => {
    if (!vehicleId) return null;
    
    try {
      setUploading(true);
      console.log('📤 Iniciando upload da foto do card...');
      const photoData = await uploadCardPhotoToStorage(file, vehicleId);

      if (photoData) {
        setCardPhoto(photoData);
        toast({
          title: 'Sucesso',
          description: 'Foto do card enviada com sucesso.',
        });
        console.log('✅ Upload da foto do card concluído');
      }

      return photoData;
    } finally {
      setUploading(false);
    }
  };

  const generateCardPhoto = async (vehicleData: any): Promise<VehicleCardPhoto | null> => {
    if (!vehicleId) return null;

    try {
      setGenerating(true);
      console.log('🤖 Gerando foto do card com IA...');
      const photoData = await generateCardPhotoWithAI(vehicleId, vehicleData, cardImageInstructions);
      
      if (photoData) {
        setCardPhoto(photoData);
        console.log('✅ Foto do card gerada com IA');
      }

      return photoData;
    } finally {
      setGenerating(false);
    }
  };

  const removeCardPhoto = async () => {
    if (!vehicleId || !cardPhoto) return;

    console.log('🗑️ Removendo foto do card...');
    const success = await removeCardPhotoFromDatabase(vehicleId);
    
    if (success) {
      setCardPhoto(null);
      toast({
        title: 'Sucesso',
        description: 'Foto do card removida.',
      });
      console.log('✅ Foto do card removida');
    } else {
      toast({
        title: 'Erro',
        description: 'Erro ao remover foto do card.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadCardPhoto();
  }, [vehicleId]);

  return {
    cardPhoto,
    loading,
    uploading,
    generating,
    uploadCardPhoto,
    generateCardPhoto,
    removeCardPhoto,
    refetch: loadCardPhoto
  };
};
