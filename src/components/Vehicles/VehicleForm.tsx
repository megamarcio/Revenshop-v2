
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Car, X, Save } from 'lucide-react';
import BasicInfoForm from './forms/BasicInfoForm';
import FinancialInfoForm from './forms/FinancialInfoForm';
import SaleInfoForm from './forms/SaleInfoForm';
import MediaUploadForm from './forms/MediaUploadForm';
import DescriptionForm from './forms/DescriptionForm';

interface VehicleFormData {
  name: string;
  vin: string;
  year: string;
  model: string;
  plate: string;
  internalCode: string;
  color: string;
  caNote: string;
  titleInfo?: string;
  purchasePrice: string;
  salePrice: string;
  minNegotiable: string;
  carfaxPrice: string;
  mmrValue: string;
  description: string;
  category: 'forSale' | 'sold';
  seller?: string;
  finalSalePrice?: string;
  saleDate?: string;
  saleNotes?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  financingCompany?: string;
  checkDetails?: string;
  otherPaymentDetails?: string;
  sellerCommission?: string;
  titleStatus?: string;
}

interface VehicleFormProps {
  onClose: () => void;
  onSave: (vehicle: any) => void;
  editingVehicle?: any;
}

const VehicleForm = ({ onClose, onSave, editingVehicle }: VehicleFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<VehicleFormData>({
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    plate: editingVehicle?.plate || '',
    internalCode: editingVehicle?.internalCode || '',
    color: editingVehicle?.color || '',
    caNote: editingVehicle?.caNote?.toString() || '',
    titleInfo: editingVehicle?.titleInfo || '',
    purchasePrice: editingVehicle?.purchasePrice?.toString() || '',
    salePrice: editingVehicle?.salePrice?.toString() || '',
    minNegotiable: editingVehicle?.minNegotiable?.toString() || '',
    carfaxPrice: editingVehicle?.carfaxPrice?.toString() || '',
    mmrValue: editingVehicle?.mmrValue?.toString() || '',
    description: editingVehicle?.description || '',
    category: editingVehicle?.category || 'forSale',
    seller: editingVehicle?.seller || '',
    finalSalePrice: editingVehicle?.finalSalePrice?.toString() || '',
    saleDate: editingVehicle?.saleDate || '',
    saleNotes: editingVehicle?.saleNotes || '',
    customerName: editingVehicle?.customerName || '',
    customerPhone: editingVehicle?.customerPhone || '',
    paymentMethod: editingVehicle?.paymentMethod || '',
    financingCompany: editingVehicle?.financingCompany || '',
    checkDetails: editingVehicle?.checkDetails || '',
    otherPaymentDetails: editingVehicle?.otherPaymentDetails || '',
    sellerCommission: editingVehicle?.sellerCommission?.toString() || '',
    titleStatus: editingVehicle?.titleStatus || ''
  });

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [video, setVideo] = useState<string>(editingVehicle?.video || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'purchasePrice' || field === 'salePrice') {
      const purchase = field === 'purchasePrice' ? parseFloat(value) : parseFloat(formData.purchasePrice);
      const sale = field === 'salePrice' ? parseFloat(value) : parseFloat(formData.salePrice);
      
      if (purchase > 0 && sale > 0) {
        const margin = (sale / purchase).toFixed(2);
        console.log(`Margem de lucro calculada: ${margin}x`);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Partial<VehicleFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.vin.trim()) newErrors.vin = 'VIN é obrigatório';
    if (!formData.year.trim()) newErrors.year = 'Ano é obrigatório';
    if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
    if (!formData.plate.trim()) newErrors.plate = 'Milhas são obrigatórias';
    if (!formData.internalCode.trim()) newErrors.internalCode = 'Código interno é obrigatório';
    if (!formData.color.trim()) newErrors.color = 'Cor é obrigatória';
    if (!formData.purchasePrice.trim()) newErrors.purchasePrice = 'Valor de compra é obrigatório';
    if (!formData.salePrice.trim()) newErrors.salePrice = 'Valor de venda é obrigatório';

    const miles = parseInt(formData.plate);
    if (isNaN(miles) || miles < 0 || miles > 500000) {
      newErrors.plate = 'Milhas devem estar entre 0 e 500,000';
    }

    const caNote = parseInt(formData.caNote);
    if (isNaN(caNote) || caNote < 0 || caNote > 50 || caNote % 5 !== 0) {
      newErrors.caNote = 'Nota CA deve ser múltiplo de 5 entre 0 e 50';
    }

    if (formData.category === 'sold') {
      if (!formData.customerName?.trim()) newErrors.customerName = 'Nome do cliente é obrigatório';
      if (!formData.customerPhone?.trim()) newErrors.customerPhone = 'Telefone do cliente é obrigatório';
      if (!formData.saleDate?.trim()) newErrors.saleDate = 'Data da venda é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateProfitMargin = () => {
    const purchase = parseFloat(formData.purchasePrice);
    const sale = parseFloat(formData.salePrice);
    if (purchase > 0 && sale > 0) {
      return (sale / purchase).toFixed(2);
    }
    return '0.00';
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const generateDescription = () => {
    const year = formData.year;
    const name = formData.name;
    const color = formData.color;
    const price = formatCurrency(formData.salePrice);
    const vin = formData.vin;
    const titleStatus = formData.titleStatus || 'CLEAN TITLE';
    
    const description = `🚗 ${year} ${name} – ${titleStatus.toUpperCase()} 🚗

📍 Located in Orlando, FL
💰 Price: ${price}

✅ Only xxxx miles
✅ Clean Title – No Accidents
✅ Non-smoker
✅ Runs and drives like new!
✅ Up to 35 MPG – Super Fuel Efficient

🛠️ Recent Maintenance Done:
• Fresh oil change
• Good tires
• Brake pads replaced
• Cold A/C just serviced

🧰 Features:
• Backup Camera
• Bluetooth & USB
• Touchscreen Display
• Sport Mode
• Alloy Wheels
• Cruise Control
• Keyless Entry

📋 VIN ${vin}
💼 Financing available
🧽 Clean inside & out – Ready to go!
💵 You're Welcome

⚠️ Serious buyers only. Test drives by appointment.
📲 Send a message now.`;

    setFormData(prev => ({ ...prev, description }));
    toast({
      title: 'Sucesso',
      description: 'Descrição gerada automaticamente!',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erro',
        description: 'Por favor, corrija os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        caNote: parseInt(formData.caNote),
        purchasePrice: parseFloat(formData.purchasePrice),
        salePrice: parseFloat(formData.salePrice),
        profitMargin: parseFloat(calculateProfitMargin()),
        minNegotiable: parseFloat(formData.minNegotiable || '0'),
        carfaxPrice: parseFloat(formData.carfaxPrice || '0'),
        mmrValue: parseFloat(formData.mmrValue || '0'),
        finalSalePrice: formData.finalSalePrice ? parseFloat(formData.finalSalePrice) : undefined,
        sellerCommission: formData.sellerCommission ? parseFloat(formData.sellerCommission) : undefined,
        photos,
        video: video || undefined,
        id: editingVehicle?.id || Date.now().toString()
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(vehicleData);
      toast({
        title: 'Sucesso',
        description: `Veículo ${editingVehicle ? 'atualizado' : 'cadastrado'} com sucesso!`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar veículo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-revenshop-primary" />
            <CardTitle>{editingVehicle ? 'Editar Veículo' : 'Adicionar Veículo'}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicInfoForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <FinancialInfoForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              calculateProfitMargin={calculateProfitMargin}
            />

            <SaleInfoForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <MediaUploadForm
              photos={photos}
              video={video}
              setPhotos={setPhotos}
              setVideo={setVideo}
            />

            <DescriptionForm
              description={formData.description}
              onDescriptionChange={(value) => handleInputChange('description', value)}
              generateDescription={generateDescription}
            />

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Salvando...' : editingVehicle ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleForm;
