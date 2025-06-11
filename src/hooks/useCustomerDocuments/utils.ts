
export const validateFile = (file: File, allowedTypes: string[], maxSize: number = 10 * 1024 * 1024) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido.');
  }

  if (file.size > maxSize) {
    throw new Error('O arquivo deve ter no máximo 10MB.');
  }
};

export const generateFileName = (customerId: string, type: 'bank' | 'payment', file: File) => {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${customerId}-${type}-${timestamp}-${random}.${fileExt}`;
};

export const extractStoragePath = (url: string, bucketName: string) => {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/');
  const bucketIndex = pathSegments.findIndex(segment => segment === bucketName);
  
  if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
    return pathSegments.slice(bucketIndex + 1).join('/');
  }
  
  return null;
};
