import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Car, 
  Upload, 
  X, 
  Plus, 
  Save, 
  Copy,
  Image,
  Video,
  Calculator
} from 'lucide-react';

interface VehicleFormData {
  name: string;
  vin: string;
  year: string;
  model: string;
  plate: string;
  internalCode: string;
  color: string;
  caNote: string;
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
    customerPhone: editingVehicle?.customerPhone || ''
  });

  const [photos, setPhotos] = useState<string[]>(editingVehicle?.photos || []);
  const [video, setVideo] = useState<string>(editingVehicle?.video || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({});

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Auto-calculate profit margin
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
    if (!formData.plate.trim()) newErrors.plate = 'Placa é obrigatória';
    if (!formData.internalCode.trim()) newErrors.internalCode = 'Código interno é obrigatório';
    if (!formData.color.trim()) newErrors.color = 'Cor é obrigatória';
    if (!formData.purchasePrice.trim()) newErrors.purchasePrice = 'Valor de compra é obrigatório';
    if (!formData.salePrice.trim()) newErrors.salePrice = 'Valor de venda é obrigatório';

    // Validate CA Note (0-50)
    const caNote = parseInt(formData.caNote);
    if (isNaN(caNote) || caNote < 0 || caNote > 50) {
      newErrors.caNote = 'Nota CA deve estar entre 0 e 50';
    }

    // Validate sold vehicle fields
    if (formData.category === 'sold') {
      if (!formData.customerName?.trim()) newErrors.customerName = 'Nome do cliente é obrigatório';
      if (!formData.customerPhone?.trim()) newErrors.customerPhone = 'Telefone do cliente é obrigatório';
      if (!formData.saleDate?.trim()) newErrors.saleDate = 'Data da venda é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length < 10) {
      // Simular upload - em produção seria feito upload real
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && photos.length < 10) {
            setPhotos(prev => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    if (isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const generateDescription = () => {
    const year = formData.year;
    const name = formData.name;
    const color = formData.color;
    const price = formatCurrency(formData.salePrice);
    
    const description = `${name} ${year}
🚗 Cor: ${color}
💰 Preço: ${price}
📱 Entre em contato para mais informações!

#carros #seminovos #${formData.model.toLowerCase()} #venda`;

    setFormData(prev => ({ ...prev, description }));
    toast({
      title: 'Sucesso',
      description: 'Descrição gerada automaticamente!',
    });
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(formData.description);
    toast({
      title: 'Copiado!',
      description: 'Descrição copiada para a área de transferência.',
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
        photos,
        video: video || undefined,
        id: editingVehicle?.id || Date.now().toString()
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      
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
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Veículo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Honda Civic EXL 2.0"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN (Número de Chassi) *</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="Ex: 1HGCV1F30JA123456"
                  className={errors.vin ? 'border-red-500' : ''}
                />
                {errors.vin && <p className="text-sm text-red-500">{errors.vin}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="Ex: 2020"
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Ex: Civic"
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">Placa *</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) => handleInputChange('plate', e.target.value)}
                  placeholder="Ex: ABC-1234"
                  className={errors.plate ? 'border-red-500' : ''}
                />
                {errors.plate && <p className="text-sm text-red-500">{errors.plate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalCode">Código Interno *</Label>
                <Input
                  id="internalCode"
                  value={formData.internalCode}
                  onChange={(e) => handleInputChange('internalCode', e.target.value)}
                  placeholder="Ex: HC001"
                  className={errors.internalCode ? 'border-red-500' : ''}
                />
                {errors.internalCode && <p className="text-sm text-red-500">{errors.internalCode}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Ex: Preto"
                  className={errors.color ? 'border-red-500' : ''}
                />
                {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caNote">Nota CA (0-50) *</Label>
                <Input
                  id="caNote"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.caNote}
                  onChange={(e) => handleInputChange('caNote', e.target.value)}
                  placeholder="Ex: 42"
                  className={errors.caNote ? 'border-red-500' : ''}
                />
                {errors.caNote && <p className="text-sm text-red-500">{errors.caNote}</p>}
              </div>
            </div>

            {/* Valores Financeiros */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Informações Financeiras</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Valor de Compra (R$) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    placeholder="Ex: 55000"
                    className={errors.purchasePrice ? 'border-red-500' : ''}
                  />
                  {errors.purchasePrice && <p className="text-sm text-red-500">{errors.purchasePrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice">Valor de Venda (R$) *</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    placeholder="Ex: 68000"
                    className={errors.salePrice ? 'border-red-500' : ''}
                  />
                  {errors.salePrice && <p className="text-sm text-red-500">{errors.salePrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Margem de Lucro</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-lg font-bold text-green-600">
                      {calculateProfitMargin()}x
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minNegotiable">Valor Mín. Negociável (R$)</Label>
                  <Input
                    id="minNegotiable"
                    type="number"
                    step="0.01"
                    value={formData.minNegotiable}
                    onChange={(e) => handleInputChange('minNegotiable', e.target.value)}
                    placeholder="Ex: 65000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carfaxPrice">Valor Carfax (R$)</Label>
                  <Input
                    id="carfaxPrice"
                    type="number"
                    step="0.01"
                    value={formData.carfaxPrice}
                    onChange={(e) => handleInputChange('carfaxPrice', e.target.value)}
                    placeholder="Ex: 67000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mmrValue">Valor MMR (R$)</Label>
                  <Input
                    id="mmrValue"
                    type="number"
                    step="0.01"
                    value={formData.mmrValue}
                    onChange={(e) => handleInputChange('mmrValue', e.target.value)}
                    placeholder="Ex: 66000"
                  />
                </div>
              </div>
            </div>

            {/* Status e Vendedor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status de Venda</h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={formData.category === 'forSale' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('category', 'forSale')}
                  >
                    À Venda
                  </Button>
                  <Button
                    type="button"
                    variant={formData.category === 'sold' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('category', 'sold')}
                  >
                    Vendido
                  </Button>
                </div>

                {formData.category === 'sold' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">Informações da Venda</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="saleDate">Data da Venda *</Label>
                        <Input
                          id="saleDate"
                          type="date"
                          value={formData.saleDate}
                          onChange={(e) => handleInputChange('saleDate', e.target.value)}
                          className={errors.saleDate ? 'border-red-500' : ''}
                        />
                        {errors.saleDate && <p className="text-sm text-red-500">{errors.saleDate}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="finalSalePrice">Valor Final de Venda (R$)</Label>
                        <Input
                          id="finalSalePrice"
                          type="number"
                          step="0.01"
                          value={formData.finalSalePrice}
                          onChange={(e) => handleInputChange('finalSalePrice', e.target.value)}
                          placeholder="Ex: 66500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerName">Nome do Cliente *</Label>
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange('customerName', e.target.value)}
                          placeholder="Ex: João Silva"
                          className={errors.customerName ? 'border-red-500' : ''}
                        />
                        {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Telefone do Cliente *</Label>
                        <Input
                          id="customerPhone"
                          value={formData.customerPhone}
                          onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                          placeholder="Ex: (11) 99999-9999"
                          className={errors.customerPhone ? 'border-red-500' : ''}
                        />
                        {errors.customerPhone && <p className="text-sm text-red-500">{errors.customerPhone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seller">Nome do Vendedor</Label>
                        <Input
                          id="seller"
                          value={formData.seller}
                          onChange={(e) => handleInputChange('seller', e.target.value)}
                          placeholder="Ex: Maria Santos"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="saleNotes">Observações da Venda</Label>
                      <Textarea
                        id="saleNotes"
                        value={formData.saleNotes}
                        onChange={(e) => handleInputChange('saleNotes', e.target.value)}
                        placeholder="Ex: Cliente pagou à vista, entrega agendada para..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload de Fotos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Fotos ({photos.length}/10)</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {photos.length < 10 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-revenshop-primary">
                    <Plus className="h-6 w-6 text-gray-400" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Upload de Vídeo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Vídeo</span>
              </h3>
              
              {video ? (
                <div className="relative">
                  <video
                    src={video}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setVideo('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-revenshop-primary">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-600">Clique para adicionar vídeo</span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Descrição para Anúncio</h3>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                  >
                    Gerar Automática
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyDescription}
                    disabled={!formData.description}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição detalhada do veículo, pronta para copiar e colar nos anúncios..."
                className="min-h-32"
              />
            </div>

            {/* Botões de Ação */}
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
