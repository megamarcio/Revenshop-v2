import React, { useRef } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { getMenuItems } from './menuItems';
import AppSidebarHeader from './SidebarHeader';
import FinancingMenu from './FinancingMenu';
import LogisticaMenu from './LogisticaMenu';
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
  const { state, setOpen, isMobile } = useSidebar();

  // Track if the sidebar was collapsed before hover (only on desktop)
  const wasCollapsedOnHover = useRef(false);

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    // Após seleção, colapsa o menu automaticamente
    if (state !== "collapsed") {
      setOpen(false);
    }
  };

  // Handlers to expand/collapse on mouse hover
  const handleMouseEnter = () => {
    if (!isMobile && state === "collapsed") {
      wasCollapsedOnHover.current = true;
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && wasCollapsedOnHover.current) {
      setOpen(false);
      wasCollapsedOnHover.current = false;
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AppSidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems(t, canAccessDashboard, canAccessAuctions, isAdmin, isInternalSeller).map(item => {
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

              {/* Outros menus */}
              <FinancingMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (state !== "collapsed") setOpen(false);
              }} />
              <LogisticaMenu />
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
