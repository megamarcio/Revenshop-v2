
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface VehiclePhotoDisplayProps {
  photoUrl?: string;
  alt: string;
  className?: string;
  showLoader?: boolean;
}

const VehiclePhotoDisplay: React.FC<VehiclePhotoDisplayProps> = ({ 
  photoUrl, 
  alt, 
  className = '',
  showLoader = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log('🖼️ VehiclePhotoDisplay - URL recebida:', photoUrl);

  if (showLoader) {
    console.log('⏳ Mostrando loader...');
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!photoUrl || imageError) {
    console.log('❌ Sem foto ou erro na imagem:', { photoUrl, imageError });
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Sem foto</p>
        </div>
      </div>
    );
  }

  // Usar a URL diretamente como está no banco
  console.log('🚀 Carregando imagem com URL:', photoUrl);

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={photoUrl}
        alt={alt}
        className={`object-cover w-full h-full ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        loading="lazy"
        onLoad={() => {
          console.log('✅ Imagem carregada com sucesso:', photoUrl);
          setImageLoading(false);
        }}
        onError={(e) => {
          console.error('❌ FALHA ao carregar imagem:', photoUrl);
          console.log('🔍 Detalhes do erro:', e);
          console.log('🔍 Event target src:', (e.target as HTMLImageElement)?.src);
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
};

export default VehiclePhotoDisplay;
