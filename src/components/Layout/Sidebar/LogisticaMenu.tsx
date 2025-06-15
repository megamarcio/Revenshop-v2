
import React from 'react';
import { Truck } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

const LogisticaMenu = () => {
  const { state } = useSidebar();

  // Ações simples de clique podem ser adicionadas depois
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={state === "collapsed" ? "Logística" : undefined}
        className="w-full hover:bg-muted"
        isActive={false}
      >
        <Truck className="h-4 w-4" />
        <span className="text-sm px-0 mx-0">Logística</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default LogisticaMenu;
