
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
  const { state } = useSidebar();
  
  const menuItems = getMenuItems(t, canAccessDashboard, canAccessAuctions, isAdmin, isInternalSeller);

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
                      onClick={() => setActiveTab(item.id)} 
                      tooltip={state === "collapsed" ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm px-0 mx-0">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              <FinancingMenu activeTab={activeTab} setActiveTab={setActiveTab} />
              <LogisticsMenu />
              <SettingsMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
