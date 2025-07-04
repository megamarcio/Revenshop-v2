import React from 'react';
import BasicInfoForm from './BasicInfoForm';
import SaleInfoForm from './SaleInfoForm';
import CustomerSaleInfoForm from './CustomerSaleInfoForm';
import AnuncioContainer from './AnuncioContainer';
import FinancingInfoForm from './FinancingInfoForm';
import { VehicleFormData } from '../types/vehicleFormTypes';

interface VehicleFormContentProps {
  formData: VehicleFormData;
  errors: Partial<VehicleFormData>;
  photos: string[];
  videos: string[];
  isEditing: boolean;
  isGeneratingDescription: boolean;
  showFinancingInfo: boolean;
  showSaleInfo: boolean;
  editingVehicle?: any;
  onInputChange: (field: keyof VehicleFormData, value: string) => void;
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  onViewMaintenance: () => void;
  onNewMaintenance?: () => void;
  onToggleFinancing: () => void;
  onToggleSaleInfo: () => void;
  onNavigateToCustomers?: () => void;
  calculateProfitMargin: () => string;
  generateDescription: () => Promise<void>;
}

const VehicleFormContent = ({
  formData,
  errors,
  photos,
  videos,
  isEditing,
  isGeneratingDescription,
  showFinancingInfo,
  showSaleInfo,
  editingVehicle,
  onInputChange,
  setPhotos,
  setVideos,
  onViewMaintenance,
  onNewMaintenance,
  onToggleFinancing,
  onToggleSaleInfo,
  onNavigateToCustomers,
  calculateProfitMargin,
  generateDescription
}: VehicleFormContentProps) => {
  // Criar dados completos do veículo para os placeholders usando dados do formulário atual
  const vehicleDataForPlaceholders = {
    name: formData.name || '',
    year: parseInt(formData.year) || new Date().getFullYear(),
    color: formData.color || '',
    category: formData.category || 'forSale',
    vin: formData.vin || '',
    miles: parseInt(formData.miles) || 0,
    internalCode: formData.internalCode || '',
    model: formData.model || '',
    purchasePrice: parseFloat(formData.purchasePrice) || 0,
    salePrice: parseFloat(formData.salePrice) || 0,
    minNegotiable: parseFloat(formData.minNegotiable) || 0,
    carfaxPrice: parseFloat(formData.carfaxPrice) || 0,
    mmrValue: parseFloat(formData.mmrValue) || 0,
    description: formData.description || '',
    plate: formData.plate || '',
    sunpass: formData.sunpass || '',
    
    // Dados de financiamento
    financingBank: formData.financingBank || '',
    financingType: formData.financingType || '',
    originalFinancedName: formData.originalFinancedName || '',
    purchaseDate: formData.purchaseDate || '',
    dueDate: formData.dueDate || '',
    installmentValue: parseFloat(formData.installmentValue) || 0,
    downPayment: parseFloat(formData.downPayment) || 0,
    financedAmount: parseFloat(formData.financedAmount) || 0,
    totalInstallments: parseInt(formData.totalInstallments) || 0,
    paidInstallments: parseInt(formData.paidInstallments) || 0,
    remainingInstallments: parseInt(formData.remainingInstallments) || 0,
    totalToPay: parseFloat(formData.totalToPay) || 0,
    payoffValue: parseFloat(formData.payoffValue) || 0,
    payoffDate: formData.payoffDate || '',
    interestRate: parseFloat(formData.interestRate) || 0,
    customFinancingBank: formData.customFinancingBank || '',
    
    // Dados de venda
    seller: formData.seller || '',
    finalSalePrice: parseFloat(formData.finalSalePrice) || 0,
    saleDate: formData.saleDate || '',
    saleNotes: formData.saleNotes || '',
    customerName: formData.customerName || '',
    customerPhone: formData.customerPhone || '',
    paymentMethod: formData.paymentMethod || '',
    financingCompany: formData.financingCompany || '',
    checkDetails: formData.checkDetails || '',
    otherPaymentDetails: formData.otherPaymentDetails || '',
    sellerCommission: parseFloat(formData.sellerCommission) || 0,
    
    // Dados de consignação
    vehicleUsage: formData.vehicleUsage || '',
    consignmentStore: formData.consignmentStore || ''
  };

  return (
    <div className="space-y-6">
      <BasicInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
      />

      {/* Container para menus de Venda e Financiamento */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Informações Comerciais</h3>
          <p className="text-sm text-gray-600">Dados de venda e financiamento do veículo</p>
        </div>
        
        <div className="space-y-4">
          <SaleInfoForm
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
            calculateProfitMargin={calculateProfitMargin}
            vehicleId={isEditing ? editingVehicle?.id : undefined}
            isOpen={showSaleInfo}
            onToggle={onToggleSaleInfo}
          />

          <FinancingInfoForm
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
            isOpen={showFinancingInfo}
            onToggle={onToggleFinancing}
          />
        </div>
      </div>

      <CustomerSaleInfoForm
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        onNavigateToCustomers={onNavigateToCustomers}
      />

      <AnuncioContainer
        vehicleId={isEditing ? editingVehicle?.id : undefined}
        photos={photos}
        videos={videos}
        setPhotos={setPhotos}
        setVideos={setVideos}
        description={formData.description}
        onDescriptionChange={(value) => onInputChange('description', value)}
        generateDescription={generateDescription}
        isGeneratingDescription={isGeneratingDescription}
        vehicleData={vehicleDataForPlaceholders}
      />
    </div>
  );
};

export default VehicleFormContent;
