
import { useCallback } from 'react';
import { MaintenanceFormData } from '../../../types/maintenance';

export const useMaintenanceQuotes = (
  formData: MaintenanceFormData,
  setFormData: React.Dispatch<React.SetStateAction<MaintenanceFormData>>
) => {
  const handleAddQuote = useCallback((partId: string) => {
    const newQuote = {
      id: crypto.randomUUID(),
      website: '',
      websiteUrl: '',
      partUrl: '',
      estimatedPrice: 0
    };
    
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === partId 
          ? { ...part, priceQuotes: [...(part.priceQuotes || []), newQuote] }
          : part
      )
    }));
  }, [setFormData]);

  const handleUpdateQuote = useCallback((partId: string, quoteId: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === partId 
          ? {
              ...part,
              priceQuotes: (part.priceQuotes || []).map(quote =>
                quote.id === quoteId 
                  ? { ...quote, [field]: value }
                  : quote
              )
            }
          : part
      )
    }));
  }, [setFormData]);

  const handleRemoveQuote = useCallback((partId: string, quoteId: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === partId 
          ? {
              ...part,
              priceQuotes: (part.priceQuotes || []).filter(quote => quote.id !== quoteId)
            }
          : part
      )
    }));
  }, [setFormData]);

  return {
    handleAddQuote,
    handleUpdateQuote,
    handleRemoveQuote
  };
};
