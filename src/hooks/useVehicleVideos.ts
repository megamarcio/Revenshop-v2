
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAISettings } from './useAISettings';

export interface VehicleVideo {
  id: string;
  vehicle_id: string;
  video_url: string;
  prompt_used?: string;
  file_name?: string;
  file_size?: number;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export const useVehicleVideos = (vehicleId?: string) => {
  const [videos, setVideos] = useState<VehicleVideo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { videoInstructions } = useAISettings();

  const fetchVideos = async () => {
    if (!vehicleId) {
      setVideos([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vehicle_videos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    }
  };

  const uploadVideo = async (file: File): Promise<VehicleVideo | null> => {
    if (!vehicleId) return null;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'Arquivo muito grande',
        description: 'O vídeo deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-videos')
        .getPublicUrl(filePath);

      // Save to database
      const { data: videoData, error: dbError } = await supabase
        .from('vehicle_videos')
        .insert({
          vehicle_id: vehicleId,
          video_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          is_main: videos.length === 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setVideos(prev => [videoData, ...prev]);
      
      toast({
        title: 'Sucesso',
        description: 'Vídeo enviado com sucesso.',
      });

      return videoData;
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
      
      // Preparar prompt personalizado
      const prompt = videoInstructions
        ? videoInstructions
            .replace(/\[MARCA\]/g, vehicleData.name?.split(' ')[0] || '')
            .replace(/\[MODELO\]/g, vehicleData.model || '')
            .replace(/\[ANO\]/g, vehicleData.year?.toString() || '')
            .replace(/\[COR\]/g, vehicleData.color || '')
            .replace(/\[CATEGORIA\]/g, vehicleData.category || '')
        : `Criar um vídeo promocional profissional para o veículo ${vehicleData.name} ${vehicleData.model || ''} ${vehicleData.year || ''} ${vehicleData.color || ''}. Mostrar o veículo em movimento, destacando suas características principais.`;

      console.log('Generating video with Gemini Veo3, prompt:', prompt);

      // Chamar função edge para gerar vídeo com Gemini Veo3
      const { data, error } = await supabase.functions.invoke('generate-video-gemini', {
        body: {
          prompt,
          vehicleData
        }
      });

      if (error) throw error;

      if (data?.video_url) {
        // Salvar vídeo gerado no banco
        const { data: videoData, error: dbError } = await supabase
          .from('vehicle_videos')
          .insert({
            vehicle_id: vehicleId,
            video_url: data.video_url,
            prompt_used: prompt,
            file_name: `generated-video-${Date.now()}.mp4`,
            is_main: videos.length === 0
          })
          .select()
          .single();

        if (dbError) throw dbError;

        setVideos(prev => [videoData, ...prev]);
        
        toast({
          title: 'Sucesso',
          description: 'Vídeo gerado com IA com sucesso.',
        });

        return videoData;
      }

      toast({
        title: 'Info',
        description: 'Geração de vídeo com IA iniciada. Aguarde alguns minutos.',
      });

      return null;
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar vídeo com IA.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const removeVideo = async (videoId: string) => {
    try {
      // Remove from database
      const { error: dbError } = await supabase
        .from('vehicle_videos')
        .delete()
        .eq('id', videoId);

      if (dbError) throw dbError;

      setVideos(prev => prev.filter(v => v.id !== videoId));
      
      toast({
        title: 'Sucesso',
        description: 'Vídeo removido com sucesso.',
      });
    } catch (error) {
      console.error('Error removing video:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover vídeo.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [vehicleId]);

  return {
    videos,
    uploading,
    generating,
    uploadVideo,
    generateVideo,
    removeVideo,
    refetch: fetchVideos
  };
};
