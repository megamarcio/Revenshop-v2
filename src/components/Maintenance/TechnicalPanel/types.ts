
import { LucideIcon } from 'lucide-react';

export interface TechnicalItem {
  id: string;
  vehicle_id: string;
  name: string;
  type: string;
  status: 'em-dia' | 'proximo-troca' | 'trocar';
  month?: string;
  year?: string;
  miles?: string;
  extraInfo?: string;
  tireBrand?: string;
  next_change?: string;
  created_at: string;
  updated_at: string;
}

export interface TechnicalPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

export interface EditableItemRowProps {
  item: TechnicalItem;
  isEditing: boolean;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
}

export interface AlertSectionProps {
  trocarItems: TechnicalItem[];
  proximoTrocaItems: TechnicalItem[];
}

export interface TechnicalSectionProps {
  title: string;
  icon: LucideIcon;
  items: TechnicalItem[];
  editingItem: string | null;
  onEdit: (itemId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (itemId: string, updates: Partial<TechnicalItem>) => void;
  isHighlight?: boolean;
  className?: string;
}

export const TIRE_BRANDS = [
  'Michelin',
  'Bridgestone',
  'Pirelli',
  'Continental',
  'Goodyear',
  'Yokohama',
  'Dunlop',
  'Hankook',
  'Douglas',
  'Outros'
];
