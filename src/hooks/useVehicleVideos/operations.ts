
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VehicleVideo } from './types';

export const fetchVideos = async (vehicleId?: string): Promise<VehicleVideo[]> => {
  if (!vehicleId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('vehicle_videos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const uploadVideoToStorage = async (
  file: File,
  vehicleId: string
): Promise<VehicleVideo | null> => {
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: 'Arquivo muito grande',
      description: 'O vídeo deve ter no máximo 5MB.',
      variant: 'destructive',
    });
    return null;
  }

  try {
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

    return { publicUrl, fileName: file.name, fileSize: file.size };
  } catch (error) {
    console.error('Error uploading video:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao enviar vídeo.',
      variant: 'destructive',
    });
    return null;
  }
};

export const saveVideoToDatabase = async (
  vehicleId: string,
  videoUrl: string,
  fileName?: string,
  fileSize?: number,
  promptUsed?: string,
  isMainVideo: boolean = false
): Promise<VehicleVideo | null> => {
  try {
    const { data: videoData, error: dbError } = await supabase
      .from('vehicle_videos')
      .insert({
        vehicle_id: vehicleId,
        video_url: videoUrl,
        file_name: fileName,
        file_size: fileSize,
        prompt_used: promptUsed,
        is_main: isMainVideo
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return videoData;
  } catch (error) {
    console.error('Error saving video to database:', error);
    return null;
  }
};

export const removeVideoFromDatabase = async (videoId: string): Promise<boolean> => {
  try {
    const { error: dbError } = await supabase
      .from('vehicle_videos')
      .delete()
      .eq('id', videoId);

    if (dbError) throw dbError;
    return true;
  } catch (error) {
    console.error('Error removing video:', error);
    return false;
  }
};
