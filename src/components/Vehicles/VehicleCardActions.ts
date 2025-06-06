
import { downloadSinglePhoto, downloadAllPhotosAsZip } from '../../utils/photoDownloader';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from './VehicleCardTypes';

export const useVehicleCardActions = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleCarfaxLookup = (vin: string) => {
    const carfaxUrl = `https://www.carfaxonline.com/vhr/${vin}`;
    window.open(carfaxUrl, '_blank');
  };

  const handleDownloadSingle = async (photoUrl: string, vehicleName: string, index: number) => {
    try {
      await downloadSinglePhoto(photoUrl, vehicleName, index);
      toast({
        title: 'Sucesso',
        description: 'Foto baixada com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao baixar foto.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadAll = async (photos: string[], vehicleName: string) => {
    if (!photos || photos.length === 0) {
      toast({
        title: 'Aviso',
        description: 'Nenhuma foto disponível para download.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await downloadAllPhotosAsZip(photos, vehicleName);
      toast({
        title: 'Sucesso',
        description: 'Todas as fotos baixadas com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao baixar fotos.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyDescription = (description?: string) => {
    if (description) {
      navigator.clipboard.writeText(description);
      toast({
        title: 'Copiado!',
        description: 'Descrição copiada para a área de transferência.',
      });
    } else {
      toast({
        title: 'Aviso',
        description: 'Nenhuma descrição disponível para copiar.',
        variant: 'destructive',
      });
    }
  };

  return {
    formatCurrency,
    handleCarfaxLookup,
    handleDownloadSingle,
    handleDownloadAll,
    handleCopyDescription,
  };
};
