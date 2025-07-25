
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { MaintenancePart, MaintenanceLabor } from '../../../types/maintenance';
import PriceQuoteSection from './PriceQuoteSection';

interface PartsAndLaborFormProps {
  parts: MaintenancePart[];
  labor: MaintenanceLabor[];
  onAddPart: () => void;
  onUpdatePart: (id: string, field: keyof MaintenancePart, value: string | number) => void;
  onRemovePart: (id: string) => void;
  onAddLabor: () => void;
  onUpdateLabor: (id: string, field: keyof MaintenanceLabor, value: string | number) => void;
  onRemoveLabor: (id: string) => void;
  onAddQuote: (partId: string) => void;
  onUpdateQuote: (partId: string, quoteId: string, field: string, value: string | number | boolean) => void;
  onRemoveQuote: (partId: string, quoteId: string) => void;
}

const PartsAndLaborForm = ({
  parts,
  labor,
  onAddPart,
  onUpdatePart,
  onRemovePart,
  onAddLabor,
  onUpdateLabor,
  onRemoveLabor,
  onAddQuote,
  onUpdateQuote,
  onRemoveQuote
}: PartsAndLaborFormProps) => {
  // Orçamento total de todas as cotações (compradas + não compradas)
  const calculateQuotesTotal = () => {
    return parts.reduce((sum, part) => {
      const partQuotesTotal = part.priceQuotes?.reduce((partSum, quote) => partSum + (quote.estimatedPrice || 0), 0) || 0;
      return sum + partQuotesTotal;
    }, 0);
  };

  // Valor das peças compradas (apenas cotações marcadas como purchased)
  const calculatePurchasedQuotesTotal = () => {
    return parts.reduce((sum, part) => {
      const purchasedQuotesTotal = part.priceQuotes?.reduce((partSum, quote) => {
        return partSum + (quote.purchased ? (quote.estimatedPrice || 0) : 0);
      }, 0) || 0;
      return sum + purchasedQuotesTotal;
    }, 0);
  };

  const calculateLaborTotal = () => {
    return labor.reduce((sum, labor) => sum + (labor.value || 0), 0);
  };

  // Valor Total Real = Peças Compradas (cotações marcadas) + Mão de Obra
  const calculateGrandTotal = () => {
    return calculatePurchasedQuotesTotal() + calculateLaborTotal();
  };

  return (
    <>
      {/* Peças */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Peças</Label>
          <Button type="button" onClick={onAddPart} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Peça
          </Button>
        </div>
        
        {parts.map(part => (
          <div key={part.id} className="space-y-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Nome da Peça</Label>
                <Input 
                  value={part.name} 
                  onChange={e => onUpdatePart(part.id, 'name', e.target.value)} 
                  placeholder="Ex: Filtro de óleo" 
                />
              </div>
              <Button 
                type="button" 
                onClick={() => onRemovePart(part.id)} 
                size="sm" 
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <PriceQuoteSection
              partId={part.id}
              partName={part.name || 'Peça sem nome'}
              quotes={part.priceQuotes || []}
              onAddQuote={onAddQuote}
              onUpdateQuote={onUpdateQuote}
              onRemoveQuote={onRemoveQuote}
            />
          </div>
        ))}
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
        {labor.map(laborItem => (
          <div key={laborItem.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Descrição do Serviço</Label>
              <Input 
                value={laborItem.description} 
                onChange={e => onUpdateLabor(laborItem.id, 'description', e.target.value)} 
                placeholder="Ex: Instalação do filtro" 
              />
            </div>
            <div className="w-32">
              <Label>Valor ($)</Label>
              <Input 
                type="number" 
                value={laborItem.value || ''} 
                onChange={e => onUpdateLabor(laborItem.id, 'value', parseFloat(e.target.value) || 0)} 
                placeholder=""
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <Button 
              type="button" 
              onClick={() => onRemoveLabor(laborItem.id)} 
              size="sm" 
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Mão de Obra:</span>
            <span className="font-medium">
              $ {calculateLaborTotal().toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-blue-700">
            <span>Orçamento de Peças:</span>
            <span className="font-medium">
              $ {calculateQuotesTotal().toFixed(2)}
            </span>
          </div>

          {calculatePurchasedQuotesTotal() > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Peças Compradas:</span>
              <span className="font-medium">
                $ {calculatePurchasedQuotesTotal().toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-revenshop-primary font-semibold col-span-2 border-t pt-2">
            <span>Valor Total Real:</span>
            <span>$ {calculateGrandTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="text-xs text-gray-600 mt-2 space-y-1">
          <p>* Orçamento de Peças: soma de todas as cotações coletadas</p>
          <p>* Valor Total Real: Peças Compradas + Mão de Obra</p>
        </div>
      </div>
    </>
  );
};

export default PartsAndLaborForm;
