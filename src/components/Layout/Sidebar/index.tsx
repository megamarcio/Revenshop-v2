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
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { getMenuItems } from './menuItems';
import AppSidebarHeader from './SidebarHeader';
import FinancingMenu from './FinancingMenu';
import FinancialMenu from './FinancialMenu';
import RentalCarMenu from './RentalCarMenu';
import SettingsMenu from './SettingsMenu';
import APP_VERSION from '../../../config/version';

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
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar();

  // Track if the sidebar was collapsed before hover (only on desktop)
  const wasCollapsedOnHover = useRef(false);

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    // No mobile, sempre fecha o sidebar após clicar
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Handlers to expand/collapse on mouse hover (desktop only)
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
                if (isMobile) {
                  setOpenMobile(false);
                }
              }} />
              
              <FinancialMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (isMobile) {
                  setOpenMobile(false);
                }
              }} />
              
              <RentalCarMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (isMobile) {
                  setOpenMobile(false);
                }
              }} />
              
              <SettingsMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (isMobile) {
                  setOpenMobile(false);
                }
              }} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Versão do sistema */}
      <SidebarFooter>
        <div className="flex items-center justify-center w-full px-2 py-2">
          <span className="text-xs text-sidebar-foreground/60 font-mono">
            {APP_VERSION.getFullVersion()}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
