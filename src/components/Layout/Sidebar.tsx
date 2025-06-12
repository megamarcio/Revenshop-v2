
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Car, Users, Settings, User, CreditCard, UserCheck, Gavel, CheckSquare, Calculator, Wrench, Bot, Truck, DollarSign } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppSidebar = ({
  activeTab,
  setActiveTab
}: SidebarProps) => {
  const {
    t
  } = useLanguage();
  const {
    canAccessAdmin,
    canManageUsers,
    canAccessDashboard,
    canAccessAuctions,
    isInternalSeller,
    isAdmin
  } = useAuth();
  const {
    state
  } = useSidebar();
  
  const menuItems = [
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
      id: 'ai-beta',
      label: 'IA (beta)',
      icon: Bot
    },
    ...(canManageUsers ? [{
      id: 'users',
      label: t('users'),
      icon: Users
    }] : []), 
    ...(canAccessAdmin ? [{
      id: 'admin',
      label: 'Configurações',
      icon: Settings
    }] : []), 
    {
      id: 'profile',
      label: t('profile'),
      icon: User
    }
  ];

  const handleLogisticaClick = (submenu: string) => {
    // Placeholder para funcionalidade futura
    console.log(`Logística ${submenu} - Em desenvolvimento`);
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-revenshop-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          {state === "expanded" && <span className="font-semibold text-lg">RevenShop</span>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeTab === item.id} 
                      onClick={() => setActiveTab(item.id)} 
                      tooltip={state === "collapsed" ? item.label : undefined} 
                      className={`w-full ${activeTab === item.id ? 'bg-revenshop-primary text-white hover:bg-revenshop-primary/90' : 'hover:bg-muted'}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm px-0 mx-0">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {/* Menu Financiamento */}
              <SidebarMenuItem>
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={state === "collapsed" ? "Financiamento" : undefined}
                      className="w-full hover:bg-muted data-[state=open]:bg-muted"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm px-0 mx-0">Financiamento</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('bhph')}
                          className={`cursor-pointer ${activeTab === 'bhph' ? 'bg-revenshop-primary text-white' : ''}`}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Buy Here Pay Here</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('financing')}
                          className={`cursor-pointer ${activeTab === 'financing' ? 'bg-revenshop-primary text-white' : ''}`}
                        >
                          <Calculator className="h-4 w-4" />
                          <span>Simulação de Financiamento</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              
              {/* Menu Logística Rental Car */}
              <SidebarMenuItem>
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={state === "collapsed" ? "Logística Rental Car" : undefined}
                      className="w-full hover:bg-muted data-[state=open]:bg-muted"
                    >
                      <Truck className="h-4 w-4" />
                      <span className="text-sm px-0 mx-0">Logística Rental Car</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => handleLogisticaClick('Semana')}
                          className="cursor-pointer opacity-60"
                        >
                          <span>Semana</span>
                          <span className="ml-auto text-xs text-muted-foreground">(em breve)</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => handleLogisticaClick('Dia')}
                          className="cursor-pointer opacity-60"
                        >
                          <span>Dia</span>
                          <span className="ml-auto text-xs text-muted-foreground">(em breve)</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
