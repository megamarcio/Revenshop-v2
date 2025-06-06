
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
