
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { getMenuItems } from './menuItems';
import AppSidebarHeader from './SidebarHeader';
import FinancingMenu from './FinancingMenu';
import LogisticsMenu from './LogisticsMenu';
import SettingsMenu from './SettingsMenu';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppSidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useLanguage();
  const {
    canAccessDashboard,
    canAccessAuctions,
    isInternalSeller,
    isAdmin
  } = useAuth();
  const { state, setOpen } = useSidebar();
  
  const menuItems = getMenuItems(t, canAccessDashboard, canAccessAuctions, isAdmin, isInternalSeller);

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    // Após seleção, colapsa o menu automaticamente
    if (state !== "collapsed") {
      setOpen(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      
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
                      onClick={() => handleMenuItemClick(item.id)} 
                      tooltip={state === "collapsed" ? item.label : undefined}
                    >
                      <Icon />
                      <span className="text-sm px-0 mx-0">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {/* Os menus abaixo também devem retrair ao selecionar uma opção */}
              <FinancingMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (state !== "collapsed") setOpen(false);
              }} />
              <LogisticsMenu />
              <SettingsMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (state !== "collapsed") setOpen(false);
              }} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

