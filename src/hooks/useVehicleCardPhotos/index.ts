
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
    setLoading(true);
    try {
      const data = await fetchCardPhoto(vehicleId);
      setCardPhoto(data);
    } finally {
      setLoading(false);
    }
  };

  const uploadCardPhoto = async (file: File): Promise<VehicleCardPhoto | null> => {
    if (!vehicleId) return null;
    
    try {
      setUploading(true);
      const photoData = await uploadCardPhotoToStorage(file, vehicleId);

      if (photoData) {
        setCardPhoto(photoData);
        toast({
          title: 'Sucesso',
          description: 'Foto do card enviada com sucesso.',
        });
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
      const photoData = await generateCardPhotoWithAI(vehicleId, vehicleData, cardImageInstructions);
      
      if (photoData) {
        setCardPhoto(photoData);
      }

      return photoData;
    } finally {
      setGenerating(false);
    }
  };

  const removeCardPhoto = async () => {
    if (!vehicleId || !cardPhoto) return;

    const success = await removeCardPhotoFromDatabase(vehicleId);
    
    if (success) {
      setCardPhoto(null);
      toast({
        title: 'Sucesso',
        description: 'Foto do card removida.',
      });
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
