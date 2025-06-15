
import React from 'react';
import { Truck } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

// O menu chama a função recebida via props (ou poderia navegar via router)
const LogisticaMenu = ({ onClick }: { onClick?: () => void }) => {
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={state === "collapsed" ? "Logística" : undefined}
        className="w-full hover:bg-muted"
        isActive={false}
        onClick={onClick}
      >
        <Truck className="h-4 w-4" />
        <span className="text-sm px-0 mx-0">Logística</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default LogisticaMenu;
