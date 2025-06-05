
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  User,
  CreditCard,
  UserCheck,
  Gavel,
  CheckSquare
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useLanguage();
  const { canAccessAdmin, canManageUsers, user } = useAuth();
  const { unreadTasksCount } = useTasks();

  const menuItems = [
    ...(canAccessAdmin ? [{ id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard }] : []),
    { id: 'vehicles', label: t('vehicles'), icon: Car },
    { id: 'customers', label: t('customers'), icon: UserCheck },
    // Só mostrar leilões para admin e manager
    ...(canAccessAdmin ? [{ id: 'auctions', label: 'Leilões', icon: Gavel }] : []),
    { id: 'bhph', label: 'Buy Here Pay Here', icon: CreditCard },
    { 
      id: 'tasks', 
      label: 'Tarefas', 
      icon: CheckSquare,
      badge: unreadTasksCount > 0 ? unreadTasksCount : undefined
    },
    ...(canManageUsers ? [{ id: 'users', label: t('users'), icon: Users }] : []),
    ...(canAccessAdmin ? [{ id: 'admin', label: t('admin'), icon: Settings }] : []),
    { id: 'profile', label: t('profile'), icon: User }
  ];

  return (
    <aside className="bg-card w-64 min-h-screen border-r border-border shadow-sm">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start space-x-3 h-11 ${
                activeTab === item.id 
                  ? 'bg-revenshop-primary text-white hover:bg-revenshop-primary/90' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
