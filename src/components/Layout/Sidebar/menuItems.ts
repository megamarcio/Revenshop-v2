
import { LayoutDashboard, Car, UserCheck, Gavel, CheckSquare, Wrench, Bot, ClipboardList } from 'lucide-react';
import { TranslationKey } from '../../../types/language';

export interface MenuItem {
  id: string;
  label: string | TranslationKey;
  icon: React.ComponentType;
}

export const getMenuItems = (
  t: (key: TranslationKey) => string,
  canAccessDashboard: boolean,
  canAccessAuctions: boolean,
  isAdmin: boolean,
  isInternalSeller: boolean
): MenuItem[] => [
  ...(canAccessDashboard ? [{
    id: 'dashboard',
    label: t('dashboard'),
    icon: LayoutDashboard
  }] : []), 
  {
    id: 'vehicles',
    label: t('vehicles'),
    icon: Car
  }, 
  {
    id: 'customers',
    label: t('customers'),
    icon: UserCheck
  }, 
  ...(canAccessAuctions ? [{
    id: 'auctions',
    label: 'Leilões',
    icon: Gavel
  }] : []), 
  {
    id: 'tasks',
    label: 'Tarefas',
    icon: CheckSquare
  }, 
  ...(isAdmin || isInternalSeller ? [{
    id: 'maintenance',
    label: 'Manutenção',
    icon: Wrench
  }] : []), 
  {
    id: 'acompanhar-reservas',
    label: 'Acompanhar Reservas',
    icon: ClipboardList
  },
  {
    id: 'ai-beta',
    label: 'IA (beta)',
    icon: Bot
  }
];
