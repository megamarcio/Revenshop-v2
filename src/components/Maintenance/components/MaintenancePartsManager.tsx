
import React from 'react';
import PartsAndLaborForm from '../forms/PartsAndLaborForm';
import { MaintenanceFormData } from '../../../types/maintenance';

interface MaintenancePartsManagerProps {
  formData: MaintenanceFormData;
  setFormData: React.Dispatch<React.SetStateAction<MaintenanceFormData>>;
  onAddQuote: (partId: string) => void;
  onUpdateQuote: (partId: string, quoteId: string, field: string, value: string | number) => void;
  onRemoveQuote: (partId: string, quoteId: string) => void;
}

const MaintenancePartsManager = ({
  formData,
  setFormData,
  onAddQuote,
  onUpdateQuote,
  onRemoveQuote
}: MaintenancePartsManagerProps) => {
  const handleAddPart = () => {
    const newPart = {
      id: crypto.randomUUID(),
      name: '',
      priceQuotes: []
    };
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }));
  };

  const handleUpdatePart = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(part => part.id === id ? {
        ...part,
        [field]: value
      } : part)
    }));
  };

  const handleRemovePart = (id: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== id)
    }));
  };

  const handleAddLabor = () => {
    const newLabor = {
      id: crypto.randomUUID(),
      description: '',
      value: 0
    };
    setFormData(prev => ({
      ...prev,
      labor: [...prev.labor, newLabor]
    }));
  };

  const handleUpdateLabor = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor.map(labor => labor.id === id ? {
        ...labor,
        [field]: value
      } : labor)
    }));
  };

  const handleRemoveLabor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor.filter(labor => labor.id !== id)
    }));
  };

  return (
    <PartsAndLaborForm 
      parts={formData.parts} 
      labor={formData.labor} 
      onAddPart={handleAddPart}
      onUpdatePart={handleUpdatePart}
      onRemovePart={handleRemovePart}
      onAddLabor={handleAddLabor}
      onUpdateLabor={handleUpdateLabor}
      onRemoveLabor={handleRemoveLabor}
      onAddQuote={onAddQuote}
      onUpdateQuote={onUpdateQuote}
      onRemoveQuote={onRemoveQuote}
    />
  );
};

export default MaintenancePartsManager;
