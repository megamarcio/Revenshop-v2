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
  
  console.log('VehicleForm - editingVehicle received:', editingVehicle);
  
  // Determinar se é edição (tem ID válido) ou criação/duplicação (sem ID)
  const isEditing = editingVehicle && editingVehicle.id;
  
  const [formData, setFormData] = useState<VehicleFormData>({
    name: editingVehicle?.name || '',
    vin: editingVehicle?.vin || '',
    year: editingVehicle?.year?.toString() || '',
    model: editingVehicle?.model || '',
    plate: editingVehicle?.miles?.toString() || editingVehicle?.plate || '',
    internalCode: editingVehicle?.internal_code || editingVehicle?.internalCode || '',
    color: editingVehicle?.color || '',
    caNote: editingVehicle?.ca_note?.toString() || editingVehicle?.caNote?.toString() || '',
    titleInfo: editingVehicle?.titleInfo || '',
    purchasePrice: editingVehicle?.purchase_price?.toString() || editingVehicle?.purchasePrice?.toString() || '',
    salePrice: editingVehicle?.sale_price?.toString() || editingVehicle?.salePrice?.toString() || '',
    minNegotiable: editingVehicle?.min_negotiable?.toString() || editingVehicle?.minNegotiable?.toString() || '',
    carfaxPrice: editingVehicle?.carfax_price?.toString() || editingVehicle?.carfaxPrice?.toString() || '',
    mmrValue: editingVehicle?.mmr_value?.toString() || editingVehicle?.mmrValue?.toString() || '',
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
    titleStatus: editingVehicle?.title_status || editingVehicle?.titleStatus || ''
  });

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [video, setVideo] = useState<string>(editingVehicle?.video || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  console.log('VehicleForm - isEditing:', isEditing);
  console.log('VehicleForm - formData initialized:', formData);

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
    const miles = formData.plate; // Miles are stored in the plate field
    
    // Format title information
    let titleInfo = 'Clean Title';
    if (formData.titleInfo) {
      const parts = formData.titleInfo.split('-');
      if (parts.length >= 3) {
        const titleType = parts[0] === 'clean-title' ? 'Clean Title' : 'Rebuilt';
        const status = parts.slice(-2).join(' ');
        const statusFormatted = status === 'em-maos' ? 'In Hands' : 
                               status === 'em-transito' ? 'In Transit' : status;
        titleInfo = `${titleType} - ${statusFormatted}`;
      }
    }
    
    const description = `🚗 ${year} ${name} – ${titleInfo} 🚗

📍 Located in Orlando, FL
💰 Price: ${price}

✅ Only ${miles} miles
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

    // Validar número de fotos para evitar timeouts
    if (photos.length > 8) {
      const confirmed = window.confirm(
        `Você está tentando salvar ${photos.length} fotos. Isso pode tornar o processo mais lento. Deseja continuar?`
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        caNote: parseInt(formData.caNote),
        purchasePrice: parseFloat(formData.purchasePrice),
        salePrice: parseFloat(formData.salePrice),
        minNegotiable: parseFloat(formData.minNegotiable || '0'),
        carfaxPrice: parseFloat(formData.carfaxPrice || '0'),
        mmrValue: parseFloat(formData.mmrValue || '0'),
        finalSalePrice: formData.finalSalePrice ? parseFloat(formData.finalSalePrice) : undefined,
        sellerCommission: formData.sellerCommission ? parseFloat(formData.sellerCommission) : undefined,
        photos: photos,
        video: video || undefined,
        // Não incluir ID para duplicações (quando isEditing é false)
        ...(isEditing && { id: editingVehicle.id })
      };

      console.log('VehicleForm - submitting vehicleData:', vehicleData);
      console.log('VehicleForm - operation type:', isEditing ? 'update' : 'create');

      // Mostrar loading com timeout estimado baseado no número de fotos
      const estimatedTime = Math.max(5, photos.length * 2);
      if (photos.length > 5) {
        toast({
          title: 'Processando...',
          description: `Salvando ${photos.length} fotos. Isso pode levar até ${estimatedTime} segundos.`,
        });
      }

      await onSave(vehicleData);
      toast({
        title: 'Sucesso',
        description: `Veículo ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
      });
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      // Erro já foi tratado no hook useVehicles
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
            <CardTitle>{isEditing ? 'Editar Veículo' : 'Adicionar Veículo'}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
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
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 
                  `${isEditing ? 'Atualizando' : 'Salvando'}...` : 
                  isEditing ? 'Atualizar' : 'Salvar'
                }
              </Button>
            </div>
            
            {isLoading && photos.length > 5 && (
              <div className="text-center text-sm text-gray-600">
                <p>Processando {photos.length} fotos... Isso pode levar alguns minutos.</p>
                <p>Por favor, não feche esta janela.</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleForm;
