
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ImageUrls {
  micro: string;
  small: string;
  medium: string;
  original: string;
}

interface UseProgressiveImageResult {
  urls: ImageUrls | null;
  currentUrl: string | null;
  loading: boolean;
  error: string | null;
  loadNextQuality: () => void;
}

export const useProgressiveImage = (vehicleId: string | null): UseProgressiveImageResult => {
  const [urls, setUrls] = useState<ImageUrls | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [currentQuality, setCurrentQuality] = useState<'micro' | 'small' | 'medium' | 'original'>('micro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImageUrls = useCallback((originalUrl: string): ImageUrls => {
    if (!originalUrl.includes('supabase')) {
      // Para URLs externas ou base64, usar diretamente
      return {
        micro: originalUrl,
        small: originalUrl,
        medium: originalUrl,
        original: originalUrl
      };
    }

    const baseUrl = new URL(originalUrl);
    
    // Micro thumbnail - 50x33, quality 30, blur para placeholder
    const microUrl = new URL(originalUrl);
    microUrl.searchParams.set('width', '50');
    microUrl.searchParams.set('height', '33');
    microUrl.searchParams.set('quality', '30');
    microUrl.searchParams.set('resize', 'cover');

    // Small thumbnail - 150x100, quality 60 para listagens
    const smallUrl = new URL(originalUrl);
    smallUrl.searchParams.set('width', '150');
    smallUrl.searchParams.set('height', '100');
    smallUrl.searchParams.set('quality', '60');
    smallUrl.searchParams.set('resize', 'cover');

    // Medium thumbnail - 400x300, quality 80 para visualização
    const mediumUrl = new URL(originalUrl);
    mediumUrl.searchParams.set('width', '400');
    mediumUrl.searchParams.set('height', '300');
    mediumUrl.searchParams.set('quality', '80');
    mediumUrl.searchParams.set('resize', 'cover');

    return {
      micro: microUrl.toString(),
      small: smallUrl.toString(),
      medium: mediumUrl.toString(),
      original: originalUrl
    };
  }, []);

  const fetchPhoto = useCallback(async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching progressive photo for vehicle:', vehicleId);
      
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('url')
        .eq('vehicle_id', vehicleId)
        .eq('is_main', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.url) {
        const imageUrls = generateImageUrls(data.url);
        setUrls(imageUrls);
        setCurrentUrl(imageUrls.micro);
        console.log('Progressive image URLs generated for vehicle', vehicleId);
      } else {
        setUrls(null);
        setCurrentUrl(null);
      }
    } catch (err) {
      console.error('Error in useProgressiveImage:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar foto');
      setUrls(null);
      setCurrentUrl(null);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, generateImageUrls]);

  const loadNextQuality = useCallback(() => {
    if (!urls) return;

    switch (currentQuality) {
      case 'micro':
        setCurrentUrl(urls.small);
        setCurrentQuality('small');
        break;
      case 'small':
        setCurrentUrl(urls.medium);
        setCurrentQuality('medium');
        break;
      case 'medium':
        setCurrentUrl(urls.original);
        setCurrentQuality('original');
        break;
    }
  }, [urls, currentQuality]);

  useEffect(() => {
    fetchPhoto();
  }, [fetchPhoto]);

  return { urls, currentUrl, loading, error, loadNextQuality };
};
