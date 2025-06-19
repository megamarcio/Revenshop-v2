
import React, { useRef, useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { getMenuItems } from './menuItems';
import AppSidebarHeader from './SidebarHeader';
import FinancingMenu from './FinancingMenu';
import FinancialMenu from './FinancialMenu';
import RentalCarMenu from './RentalCarMenu';
import SettingsMenu from './SettingsMenu';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AUTOHIDE_ENABLED_LOCALSTORAGE_KEY = "sidebar:autoHideEnabled";

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

  // Inverte: agora salva se o auto ocultar está ativado!
  const [autoHideEnabled, setAutoHideEnabled] = useState(
    () => localStorage.getItem(AUTOHIDE_ENABLED_LOCALSTORAGE_KEY) === "true"
  );

  useEffect(() => {
    localStorage.setItem(AUTOHIDE_ENABLED_LOCALSTORAGE_KEY, autoHideEnabled ? "true" : "false");
  }, [autoHideEnabled]);

  // Simplified menu item click handler
  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    // No mobile, sempre fecha o sidebar após clicar
    if (isMobile) {
      setOpenMobile(false);
    } else if (autoHideEnabled && state !== "collapsed") {
      setOpen(false);
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

              {/* Simplified menu handlers */}
              <FinancingMenu activeTab={activeTab} setActiveTab={handleMenuItemClick} />
              <FinancialMenu activeTab={activeTab} setActiveTab={handleMenuItemClick} />
              <RentalCarMenu activeTab={activeTab} setActiveTab={handleMenuItemClick} />
              <SettingsMenu activeTab={activeTab} setActiveTab={handleMenuItemClick} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: switch sozinho, minúsculo, para ativar auto ocultar - apenas no desktop */}
      {!isMobile && (
        <SidebarFooter>
          <div className="flex items-center justify-center w-full px-1 py-[6px]">
            <Switch
              checked={autoHideEnabled}
              onCheckedChange={setAutoHideEnabled}
              aria-label="Ativar auto-ocultar sidebar"
              className="h-5 w-8"
            />
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
