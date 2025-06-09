
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useVehicles } from '../../hooks/useVehicles';
import { MaintenanceFormData, MaintenancePart, MaintenanceLabor, MAINTENANCE_ITEMS } from '../../types/maintenance';
import VehicleMaintenanceSelector from './VehicleMaintenanceSelector';

interface MaintenanceFormProps {
  onClose: () => void;
  editingMaintenance?: any;
}

const MaintenanceForm = ({ onClose, editingMaintenance }: MaintenanceFormProps) => {
  const { vehicles } = useVehicles();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicle_id: '',
    detection_date: '',
    repair_date: '',
    maintenance_type: 'preventive',
    maintenance_items: [],
    custom_maintenance: '',
    details: '',
    mechanic_name: '',
    mechanic_phone: '',
    parts: [],
    labor: [],
    receipt_urls: []
  });

  const [detectionDate, setDetectionDate] = useState<Date>();
  const [repairDate, setRepairDate] = useState<Date>();

  useEffect(() => {
    if (editingMaintenance) {
      setFormData({
        vehicle_id: editingMaintenance.vehicle_id || '',
        detection_date: editingMaintenance.detection_date || '',
        repair_date: editingMaintenance.repair_date || '',
        maintenance_type: editingMaintenance.maintenance_type || 'preventive',
        maintenance_items: editingMaintenance.maintenance_items || [],
        custom_maintenance: editingMaintenance.custom_maintenance || '',
        details: editingMaintenance.details || '',
        mechanic_name: editingMaintenance.mechanic_name || '',
        mechanic_phone: editingMaintenance.mechanic_phone || '',
        parts: editingMaintenance.parts || [],
        labor: editingMaintenance.labor || [],
        receipt_urls: editingMaintenance.receipt_urls || []
      });
      
      if (editingMaintenance.detection_date) {
        setDetectionDate(new Date(editingMaintenance.detection_date));
      }
      if (editingMaintenance.repair_date) {
        setRepairDate(new Date(editingMaintenance.repair_date));
      }
    }
  }, [editingMaintenance]);

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);

  const handleMaintenanceItemChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      maintenance_items: checked 
        ? [...prev.maintenance_items, item]
        : prev.maintenance_items.filter(i => i !== item)
    }));
  };

  const addPart = () => {
    const newPart: MaintenancePart = {
      id: Date.now().toString(),
      name: '',
      value: 0
    };
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }));
  };

  const updatePart = (id: string, field: keyof MaintenancePart, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === id ? { ...part, [field]: value } : part
      )
    }));
  };

  const removePart = (id: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== id)
    }));
  };

  const addLabor = () => {
    const newLabor: MaintenanceLabor = {
      id: Date.now().toString(),
      description: '',
      value: 0
    };
    setFormData(prev => ({
      ...prev,
      labor: [...prev.labor, newLabor]
    }));
  };

  const updateLabor = (id: string, field: keyof MaintenanceLabor, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor.map(labor => 
        labor.id === id ? { ...labor, [field]: value } : labor
      )
    }));
  };

  const removeLabor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      labor: prev.labor.filter(labor => labor.id !== id)
    }));
  };

  const calculateTotal = () => {
    const partsTotal = formData.parts.reduce((sum, part) => sum + (part.value || 0), 0);
    const laborTotal = formData.labor.reduce((sum, labor) => sum + (labor.value || 0), 0);
    return partsTotal + laborTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicle_id) {
      toast({
        title: 'Erro',
        description: 'Selecione um veículo',
        variant: 'destructive'
      });
      return;
    }

    if (!detectionDate || !repairDate) {
      toast({
        title: 'Erro',
        description: 'Informe as datas de detecção e reparo',
        variant: 'destructive'
      });
      return;
    }

    if (formData.maintenance_items.length === 0 && !formData.custom_maintenance) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um item de manutenção',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const maintenanceData = {
        ...formData,
        detection_date: format(detectionDate, 'yyyy-MM-dd'),
        repair_date: format(repairDate, 'yyyy-MM-dd'),
        total_amount: calculateTotal(),
        vehicle_name: selectedVehicle?.name || '',
        vehicle_internal_code: selectedVehicle?.internal_code || ''
      };

      // Here would be the API call to save the maintenance record
      console.log('Saving maintenance:', maintenanceData);
      
      toast({
        title: 'Sucesso',
        description: 'Manutenção salva com sucesso!'
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar manutenção',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const currentItems = MAINTENANCE_ITEMS[formData.maintenance_type];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleMaintenanceSelector
            selectedVehicleId={formData.vehicle_id}
            onVehicleChange={(vehicleId) => setFormData(prev => ({ ...prev, vehicle_id: vehicleId }))}
          />

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Detecção do Problema</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {detectionDate ? format(detectionDate, 'dd/MM/yyyy') : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={detectionDate}
                    onSelect={setDetectionDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data do Reparo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {repairDate ? format(repairDate, 'dd/MM/yyyy') : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={repairDate}
                    onSelect={setRepairDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tipo de Manutenção */}
          <div className="space-y-2">
            <Label>Tipo de Manutenção</Label>
            <Select value={formData.maintenance_type} onValueChange={(value: any) => 
              setFormData(prev => ({ ...prev, maintenance_type: value, maintenance_items: [] }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">🛠️ Manutenção Periódica (Preventiva)</SelectItem>
                <SelectItem value="corrective">🔧 Manutenção Corretiva</SelectItem>
                <SelectItem value="bodyshop">🧽 Bodyshop (Funilaria e Pintura)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Itens de Manutenção */}
          <div className="space-y-2">
            <Label>Itens de Manutenção</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
              {currentItems.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={formData.maintenance_items.includes(item)}
                    onCheckedChange={(checked) => handleMaintenanceItemChange(item, checked as boolean)}
                  />
                  <Label htmlFor={item} className="text-sm">{item}</Label>
                </div>
              ))}
            </div>
            
            {formData.maintenance_items.includes('Outros') && (
              <div className="space-y-2 mt-4">
                <Label>Especificar Outros</Label>
                <Input
                  value={formData.custom_maintenance}
                  onChange={(e) => setFormData(prev => ({ ...prev, custom_maintenance: e.target.value }))}
                  placeholder="Descreva a manutenção específica..."
                />
              </div>
            )}
          </div>

          {/* Detalhes da Manutenção */}
          <div className="space-y-2">
            <Label>Detalhes da Manutenção</Label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Descreva os detalhes da manutenção realizada..."
              rows={3}
            />
          </div>

          {/* Informações do Mecânico */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Mecânico</Label>
              <Input
                value={formData.mechanic_name}
                onChange={(e) => setFormData(prev => ({ ...prev, mechanic_name: e.target.value }))}
                placeholder="Nome completo do mecânico"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone do Mecânico</Label>
              <Input
                value={formData.mechanic_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, mechanic_phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Peças */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Peças Utilizadas</Label>
              <Button type="button" onClick={addPart} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Peça
              </Button>
            </div>
            {formData.parts.map((part) => (
              <div key={part.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Nome da Peça</Label>
                  <Input
                    value={part.name}
                    onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                    placeholder="Ex: Filtro de óleo"
                  />
                </div>
                <div className="w-32">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={part.value}
                    onChange={(e) => updatePart(part.id, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                  />
                </div>
                <Button type="button" onClick={() => removePart(part.id)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Mão de Obra */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Mão de Obra</Label>
              <Button type="button" onClick={addLabor} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </div>
            {formData.labor.map((labor) => (
              <div key={labor.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Descrição do Serviço</Label>
                  <Input
                    value={labor.description}
                    onChange={(e) => updateLabor(labor.id, 'description', e.target.value)}
                    placeholder="Ex: Instalação do filtro"
                  />
                </div>
                <div className="w-32">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={labor.value}
                    onChange={(e) => updateLabor(labor.id, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                  />
                </div>
                <Button type="button" onClick={() => removeLabor(labor.id)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Valor Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Valor Total:</span>
              <span className="text-2xl font-bold text-revenshop-primary">
                R$ {calculateTotal().toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Upload de Recibos */}
          <div className="space-y-2">
            <Label>Recibos e Comprovantes</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Clique para fazer upload ou arraste os arquivos aqui
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, JPG, PNG até 10MB cada
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Manutenção'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceForm;
