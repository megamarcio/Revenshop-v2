import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MAINTENANCE_ITEMS } from '../../../types/maintenance';
import MaintenanceScrollContainer from '../components/MaintenanceScrollContainer';
import { useIsMobile } from '@/hooks/use-mobile';

interface MaintenanceItemsSelectorProps {
  maintenanceType: 'preventive' | 'corrective' | 'bodyshop';
  maintenanceItems: string[];
  customMaintenance: string;
  onMaintenanceTypeChange: (value: 'preventive' | 'corrective' | 'bodyshop') => void;
  onMaintenanceItemChange: (item: string, checked: boolean) => void;
  onCustomMaintenanceChange: (value: string) => void;
}

const MaintenanceItemsSelector = ({
  maintenanceType,
  maintenanceItems,
  customMaintenance,
  onMaintenanceTypeChange,
  onMaintenanceItemChange,
  onCustomMaintenanceChange
}: MaintenanceItemsSelectorProps) => {
  const currentItems = MAINTENANCE_ITEMS[maintenanceType];
  const isMobile = useIsMobile();
  const selectedItem = maintenanceItems[0] || '';

  return <>
      {/* Tipo de Manutenção */}
      <div className="space-y-2 rounded-xl">
        <Label>Tipo de Manutenção</Label>
        <Select value={maintenanceType} onValueChange={onMaintenanceTypeChange}>
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
      <div className="space-y-2 rounded-xl">
        <Label>Itens de Manutenção</Label>
        {isMobile ? (
          <Select
            value={selectedItem}
            onValueChange={item => {
              // Só permite um item selecionado por vez
              onMaintenanceItemChange(item, true);
              // Remove outros itens
              currentItems.forEach(i => {
                if (i !== item && maintenanceItems.includes(i)) {
                  onMaintenanceItemChange(i, false);
                }
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um item" />
            </SelectTrigger>
            <SelectContent>
              {currentItems.map(item => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <MaintenanceScrollContainer maxHeight="max-h-60" className="px-[16px]">
            <div className="grid grid-cols-2 gap-2">
              {currentItems.map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={item} 
                    checked={maintenanceItems.includes(item)} 
                    onCheckedChange={checked => onMaintenanceItemChange(item, checked as boolean)} 
                  />
                  <Label htmlFor={item} className="text-sm">{item}</Label>
                </div>
              ))}
            </div>
          </MaintenanceScrollContainer>
        )}
        {maintenanceItems.includes('Outros') && (
          <div className="space-y-2 mt-4">
            <Label>Especificar Outros</Label>
            <Input 
              value={customMaintenance} 
              onChange={e => onCustomMaintenanceChange(e.target.value)} 
              placeholder="Descreva a manutenção específica..." 
            />
          </div>
        )}
      </div>
    </>;
};

export default MaintenanceItemsSelector;