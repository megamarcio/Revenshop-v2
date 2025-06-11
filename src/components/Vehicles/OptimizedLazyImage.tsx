
import React from 'react';
import ProgressiveImage from './ProgressiveImage';

interface OptimizedLazyImageProps {
  vehicleId?: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  showZoom?: boolean;
}

const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({ 
  vehicleId, 
  alt, 
  className = '', 
  placeholder, 
  showZoom = false 
}) => {
  // Usar o novo componente ProgressiveImage
  return (
    <ProgressiveImage
      vehicleId={vehicleId}
      alt={alt}
      className={className}
      placeholder={placeholder}
      showZoom={showZoom}
      autoLoadMedium={true}
    />
  );
};

export default OptimizedLazyImage;
