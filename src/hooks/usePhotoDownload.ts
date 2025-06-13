
import { useState } from 'react';
import JSZip from 'jszip';
import { toast } from '@/hooks/use-toast';

export const usePhotoDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadSinglePhoto = async (photoUrl: string, fileName: string, index?: number) => {
    try {
      setDownloading(true);
      
      const response = await fetch(photoUrl);
      if (!response.ok) throw new Error('Failed to fetch photo');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${index ? `foto_${index}` : 'foto'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Sucesso',
        description: 'Foto baixada com sucesso.',
      });
    } catch (error) {
      console.error('Error downloading photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao baixar foto.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const downloadPhotosZip = async (photoUrls: string[], vehicleName: string) => {
    if (!photoUrls || photoUrls.length === 0) {
      toast({
        title: 'Aviso',
        description: 'Nenhuma foto disponível para download.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setDownloading(true);
      const zip = new JSZip();
      
      toast({
        title: 'Preparando download',
        description: `Compactando ${photoUrls.length} foto(s)...`,
      });

      // Download all photos and add to zip
      const downloadPromises = photoUrls.map(async (url, index) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch photo ${index + 1}`);
          
          const blob = await response.blob();
          zip.file(`${vehicleName}_foto_${index + 1}.jpg`, blob);
        } catch (error) {
          console.error(`Error downloading photo ${index + 1}:`, error);
        }
      });

      await Promise.all(downloadPromises);

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Download zip file
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${vehicleName}_fotos.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Sucesso',
        description: `Pacote de fotos de ${vehicleName} baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Error creating photo zip:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar pacote de fotos.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloading,
    downloadSinglePhoto,
    downloadPhotosZip,
  };
};
