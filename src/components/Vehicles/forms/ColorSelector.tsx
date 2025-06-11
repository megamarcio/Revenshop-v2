
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const carColors = [
  { value: 'azul', label: 'Azul', color: '#0066CC' },
  { value: 'azul-escuro', label: 'Azul Escuro', color: '#003366' },
  { value: 'azul-metalico', label: 'Azul Metálico', color: '#4A90E2' },
  { value: 'branco', label: 'Branco', color: '#FFFFFF' },
  { value: 'branco-perola', label: 'Branco Pérola', color: '#F8F8FF' },
  { value: 'cinza', label: 'Cinza', color: '#808080' },
  { value: 'cinza-escuro', label: 'Cinza Escuro', color: '#404040' },
  { value: 'dourado', label: 'Dourado', color: '#FFD700' },
  { value: 'laranja', label: 'Laranja', color: '#FF6600' },
  { value: 'marrom', label: 'Marrom', color: '#8B4513' },
  { value: 'prata', label: 'Prata', color: '#C0C0C0' },
  { value: 'preto', label: 'Preto', color: '#000000' },
  { value: 'roxo', label: 'Roxo', color: '#800080' },
  { value: 'verde', label: 'Verde', color: '#008000' },
  { value: 'verde-escuro', label: 'Verde Escuro', color: '#006400' },
  { value: 'vermelho', label: 'Vermelho', color: '#CC0000' },
  { value: 'vermelho-escuro', label: 'Vermelho Escuro', color: '#800000' },
  { value: 'vinho', label: 'Vinho', color: '#722F37' },
];

const ColorSelector = ({ value, onChange, error }: ColorSelectorProps) => {
  return (
    <div>
      <Label htmlFor="color">Cor *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Selecione a cor" />
        </SelectTrigger>
        <SelectContent>
          {carColors.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300" 
                  style={{ 
                    backgroundColor: color.color,
                    border: color.color === '#FFFFFF' || color.color === '#F8F8FF' ? '1px solid #ccc' : 'none'
                  }}
                />
                {color.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default ColorSelector;
