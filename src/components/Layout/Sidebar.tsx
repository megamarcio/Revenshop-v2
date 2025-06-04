
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  User,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'vehicles', label: t('vehicles'), icon: Car },
    { id: 'bhph', label: 'Buy Here Pay Here', icon: CreditCard },
    ...(isAdmin ? [{ id: 'users', label: t('users'), icon: Users }] : []),
    ...(isAdmin ? [{ id: 'admin', label: t('admin'), icon: Settings }] : []),
    { id: 'profile', label: t('profile'), icon: User }
  ];

  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200 shadow-sm">
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
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
