import JSZip from 'jszip';

export const downloadSinglePhoto = async (photoUrl: string, vehicleName: string, index: number) => {
  try {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${vehicleName}_photo_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading photo:', error);
    throw error;
  }
};

export const downloadAllPhotosAsZip = async (photos: string[], vehicleName: string) => {
  try {
    const zip = new JSZip();
    
    for (let i = 0; i < photos.length; i++) {
      const response = await fetch(photos[i]);
      const blob = await response.blob();
      zip.file(`${vehicleName}_photo_${i + 1}.jpg`, blob);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${vehicleName}_photos.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error creating zip file:', error);
    throw error;
  }
};

export const downloadAllPhotos = async (photos: string[], vehicleName: string) => {
  try {
    const zip = new JSZip();
    const photoFolder = zip.folder('fotos');
    
    // Adicionar cada foto ao ZIP
    for (let i = 0; i < photos.length; i++) {
      const photoUrl = photos[i];
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      
      // Gerar nome do arquivo
      const extension = photoUrl.split('.').pop() || 'jpg';
      const fileName = `foto_${i + 1}.${extension}`;
      
      photoFolder?.file(fileName, blob);
    }
    
    // Gerar o arquivo ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Criar link de download
    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fotos_${vehicleName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar URL
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao baixar fotos:', error);
    throw error;
  }
};
