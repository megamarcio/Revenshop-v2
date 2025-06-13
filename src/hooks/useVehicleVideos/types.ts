
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
