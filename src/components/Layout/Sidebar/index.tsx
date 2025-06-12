
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AppSidebarHeader from './SidebarHeader';
import SettingsMenu from './SettingsMenu';
import FinancingMenu from './FinancingMenu';
import LogisticsMenu from './LogisticsMenu';
import { getMenuItems } from './menuItems';

interface AppSidebarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const AppSidebar = ({ onNavigate, activeSection }: AppSidebarProps) => {
  const { t } = useLanguage();
  const { state } = useSidebar();
  const { 
    canAccessDashboard, 
    canAccessAuctions, 
    isAdmin, 
    isInternalSeller 
  } = useAuth();

  const menuItems = getMenuItems(
    t, 
    canAccessDashboard, 
    canAccessAuctions, 
    isAdmin, 
    isInternalSeller
  );

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={state === "collapsed" ? t(item.label as any) : undefined}
                    onClick={() => onNavigate(item.id)}
                    isActive={activeSection === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{typeof item.label === 'string' ? item.label : t(item.label)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <LogisticsMenu />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <FinancingMenu activeTab={activeSection} setActiveTab={onNavigate} />
        <SettingsMenu activeTab={activeSection} setActiveTab={onNavigate} />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
