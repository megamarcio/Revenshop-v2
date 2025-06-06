
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Settings, 
  User,
  CreditCard,
  UserCheck,
  Gavel,
  CheckSquare,
  Calculator
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppSidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useLanguage();
  const { 
    canAccessAdmin, 
    canManageUsers, 
    canAccessDashboard,
    canAccessAuctions,
    isInternalSeller
  } = useAuth();
  const { state } = useSidebar();

  const menuItems = [
    ...(canAccessDashboard ? [{ id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard }] : []),
    { id: 'vehicles', label: t('vehicles'), icon: Car },
    { id: 'customers', label: t('customers'), icon: UserCheck },
    ...(canAccessAuctions ? [{ id: 'auctions', label: 'Leilões', icon: Gavel }] : []),
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'bhph', label: 'Buy Here Pay Here', icon: CreditCard },
    { id: 'financing', label: 'Simulação de Financiamento', icon: Calculator },
    ...(canManageUsers ? [{ id: 'users', label: t('users'), icon: Users }] : []),
    ...(canAccessAdmin ? [{ id: 'admin', label: t('admin'), icon: Settings }] : []),
    { id: 'profile', label: t('profile'), icon: User }
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-revenshop-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          {state === "expanded" && (
            <span className="font-semibold text-lg">RevenShop</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      tooltip={state === "collapsed" ? item.label : undefined}
                      className={`w-full ${
                        activeTab === item.id 
                          ? 'bg-revenshop-primary text-white hover:bg-revenshop-primary/90' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
