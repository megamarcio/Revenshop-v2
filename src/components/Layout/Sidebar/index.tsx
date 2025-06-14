
import React, { useRef, useState } from 'react';
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
import LogisticsMenu from './LogisticsMenu';
import SettingsMenu from './SettingsMenu';
import { Menu } from "lucide-react";

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

  // Estado para fixar o menu expandido
  const [isPinned, setIsPinned] = useState(false);

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    // Após seleção, colapsa o menu automaticamente se não está fixado
    if (state !== "collapsed" && !isPinned) {
      setOpen(false);
    }
  };

  // Handlers to expand/collapse on mouse hover
  const handleMouseEnter = () => {
    if (!isMobile && state === "collapsed" && !isPinned) {
      wasCollapsedOnHover.current = true;
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && wasCollapsedOnHover.current && !isPinned) {
      setOpen(false);
      wasCollapsedOnHover.current = false;
    }
  };

  // Click do botão para manter menu expandido (fixar/desfixar)
  const togglePin = () => {
    setIsPinned((prev) => {
      const newPinned = !prev;
      if (newPinned) {
        setOpen(true); // mantém expandido ao fixar
      }
      return newPinned;
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 px-4 py-2">
        <AppSidebarHeader />
        <button
          title={isPinned ? "Desafixar menu" : "Fixar menu aberto"}
          className={`ml-auto rounded p-1 ${
            isPinned
              ? "bg-blue-500 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-blue-200"
          } transition`}
          onClick={togglePin}
          tabIndex={0}
          aria-label={isPinned ? "Desafixar menu" : "Fixar menu"}
          style={{ fontSize: 20 }}
        >
          <Menu className={isPinned ? "rotate-90" : ""} size={18} />
        </button>
      </div>

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

              {/* Os menus abaixo também devem retrair ao selecionar uma opção */}
              <FinancingMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (state !== "collapsed" && !isPinned) setOpen(false);
              }} />
              <LogisticsMenu />
              <SettingsMenu activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                if (state !== "collapsed" && !isPinned) setOpen(false);
              }} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

