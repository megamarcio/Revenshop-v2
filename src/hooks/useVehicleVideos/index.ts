
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAISettings } from '../useAISettings';
import { fetchVideos, uploadVideoToStorage, saveVideoToDatabase, removeVideoFromDatabase } from './operations';
import { generateVideoWithAI } from './aiGeneration';
import type { VehicleVideo } from './types';

export type { VehicleVideo } from './types';

export const useVehicleVideos = (vehicleId?: string) => {
  const [videos, setVideos] = useState<VehicleVideo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { videoInstructions } = useAISettings();

  const loadVideos = async () => {
    const videoData = await fetchVideos(vehicleId);
    setVideos(videoData);
  };

  const uploadVideo = async (file: File): Promise<VehicleVideo | null> => {
    if (!vehicleId) return null;
    
    try {
      setUploading(true);
      
      const uploadResult = await uploadVideoToStorage(file, vehicleId);
      if (!uploadResult) return null;

      const { publicUrl, fileName, fileSize } = uploadResult;

      // Save to database
      const videoData = await saveVideoToDatabase(
        vehicleId,
        publicUrl,
        fileName,
        fileSize,
        undefined,
        videos.length === 0
      );

      if (videoData) {
        setVideos(prev => [videoData, ...prev]);
        
        toast({
          title: 'Sucesso',
          description: 'Vídeo enviado com sucesso.',
        });

        return videoData;
      }

      return null;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar vídeo.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const generateVideo = async (vehicleData: any): Promise<VehicleVideo | null> => {
    if (!vehicleId) return null;

    try {
      setGenerating(true);
      
      const videoData = await generateVideoWithAI(vehicleId, vehicleData, videoInstructions);
      
      if (videoData) {
        setVideos(prev => [videoData, ...prev]);
      }

      return videoData;
    } finally {
      setGenerating(false);
    }
  };

  const removeVideo = async (videoId: string) => {
    const success = await removeVideoFromDatabase(videoId);
    
    if (success) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
      
      toast({
        title: 'Sucesso',
        description: 'Vídeo removido com sucesso.',
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Erro ao remover vídeo.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadVideos();
  }, [vehicleId]);

  return {
    videos,
    uploading,
    generating,
    uploadVideo,
    generateVideo,
    removeVideo,
    refetch: loadVideos
  };
};
