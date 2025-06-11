
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { FileText } from 'lucide-react';

interface TitleTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const titleTypeOptions = [
  { 
    value: 'clean-title', 
    label: 'Clean Title',
    tooltip: 'veículo sem histórico de perda total, pronto para financiar e revender facilmente (título limpo)'
  },
  { 
    value: 'salvage-title', 
    label: 'Salvage Title',
    tooltip: 'veículos cujo custo de reparo supera o valor, sinalizando perda total pelo seguro (título de salvamento)'
  },
  { 
    value: 'rebuilt-title', 
    label: 'Rebuilt/Certified Rebuilt Title',
    tooltip: 'antigo Salvage que passou por vistoria e ganhou autorização para circular, mas mantém marcação no documento (título reconstruído)'
  },
  { 
    value: 'junk-title', 
    label: 'Junk Title',
    tooltip: 'só serve para peças ou sucata, sem possibilidade de reparo para uso em via pública (título de sucata)'
  },
  { 
    value: 'flood-damaged-title', 
    label: 'Flood Damaged Title',
    tooltip: 'dano causado por alagamento, normalmente vendido para desmanche ou restauração se possível (título de inundação)'
  },
  { 
    value: 'fire-damage-title', 
    label: 'Fire Damage Title',
    tooltip: 'veículos danificados por incêndio, avaliados caso a caso para reparo ou desmontagem (título de fogo)'
  },
  { 
    value: 'theft-recovery-title', 
    label: 'Theft Recovery Title',
    tooltip: 'carros que foram roubados e recuperados; podem ter danos ou faltas de peças (título de roubo recuperado)'
  },
  { 
    value: 'bonded-title', 
    label: 'Bonded Title',
    tooltip: 'usado quando faltam documentos originais de propriedade; comprador obtém garantia para cobrir disputas futuras (título vinculado)'
  },
  { 
    value: 'buyback-lemon-title', 
    label: 'Buyback/Lemon Law Title',
    tooltip: 'veículos recomprados pelo fabricante por defeitos recorrentes, com marcação "lemon" ou similar (título de recompra)'
  },
  { 
    value: 'certificate-destruction', 
    label: 'Certificate of Destruction',
    tooltip: 'declaração de que o veículo é irreparável, não pode ser registrado para uso em via pública (certificado de destruição)'
  },
];

const TitleTypeSelector = ({ value, onChange, error }: TitleTypeSelectorProps) => {
  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center gap-1">
          <Label htmlFor="titleType">Tipo de Título</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <FileText className="h-4 w-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tipo de Título</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione o tipo do título" />
          </SelectTrigger>
          <SelectContent>
            {titleTypeOptions.map((option) => (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <SelectItem value={option.value}>
                    {option.label}
                  </SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>{option.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </SelectContent>
        </Select>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    </TooltipProvider>
  );
};

export default TitleTypeSelector;
