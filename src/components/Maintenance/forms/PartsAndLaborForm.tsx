import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { MaintenancePart, MaintenanceLabor } from '../../../types/maintenance';
interface PartsAndLaborFormProps {
  parts: MaintenancePart[];
  labor: MaintenanceLabor[];
  onAddPart: () => void;
  onUpdatePart: (id: string, field: keyof MaintenancePart, value: string | number) => void;
  onRemovePart: (id: string) => void;
  onAddLabor: () => void;
  onUpdateLabor: (id: string, field: keyof MaintenanceLabor, value: string | number) => void;
  onRemoveLabor: (id: string) => void;
}
const PartsAndLaborForm = ({
  parts,
  labor,
  onAddPart,
  onUpdatePart,
  onRemovePart,
  onAddLabor,
  onUpdateLabor,
  onRemoveLabor
}: PartsAndLaborFormProps) => {
  const calculateTotal = () => {
    const partsTotal = parts.reduce((sum, part) => sum + (part.value || 0), 0);
    const laborTotal = labor.reduce((sum, labor) => sum + (labor.value || 0), 0);
    return partsTotal + laborTotal;
  };
  return <>
      {/* Peças */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Peças Utilizadas</Label>
          <Button type="button" onClick={onAddPart} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Peça
          </Button>
        </div>
        {parts.map(part => <div key={part.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Nome da Peça</Label>
              <Input value={part.name} onChange={e => onUpdatePart(part.id, 'name', e.target.value)} placeholder="Ex: Filtro de óleo" />
            </div>
            <div className="w-32">
              <Label>Valor (R$)</Label>
              <Input type="number" value={part.value} onChange={e => onUpdatePart(part.id, 'value', parseFloat(e.target.value) || 0)} placeholder="0,00" />
            </div>
            <Button type="button" onClick={() => onRemovePart(part.id)} size="sm" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>)}
      </div>

      {/* Mão de Obra */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Mão de Obra</Label>
          <Button type="button" onClick={onAddLabor} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Serviço
          </Button>
        </div>
        {labor.map(laborItem => <div key={laborItem.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Descrição do Serviço</Label>
              <Input value={laborItem.description} onChange={e => onUpdateLabor(laborItem.id, 'description', e.target.value)} placeholder="Ex: Instalação do filtro" />
            </div>
            <div className="w-32">
              <Label>Valor (R$)</Label>
              <Input type="number" value={laborItem.value} onChange={e => onUpdateLabor(laborItem.id, 'value', parseFloat(e.target.value) || 0)} placeholder="0,00" />
            </div>
            <Button type="button" onClick={() => onRemoveLabor(laborItem.id)} size="sm" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>)}
      </div>

      {/* Valor Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Valor Total:</span>
          <span className="text-revenshop-primary text-xl font-bold text-left">
            R$ {calculateTotal().toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </>;
};
export default PartsAndLaborForm;