
import { LucideIcon } from 'lucide-react';

export interface TechnicalItem {
  id: string;
  name: string;
  icon: LucideIcon;
  month: string;
  year: string;
  miles?: string;
  status: 'em-dia' | 'precisa-troca' | 'urgente';
  type: 'oil' | 'electrical' | 'filter' | 'suspension' | 'brakes' | 'fluids' | 'tires' | 'tuneup';
  extraInfo?: string;
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
  urgentItems: TechnicalItem[];
  needsAttentionItems: TechnicalItem[];
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
