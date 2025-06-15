
import React from 'react';
import { Truck, ChevronRight } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const LogisticsMenu = () => {
  const { state } = useSidebar();

  const handleLogisticaClick = (submenu: string) => {
    // Placeholder para funcionalidade futura
    console.log(`Logística ${submenu} - Em desenvolvimento`);
  };

  return (
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
  );
};

export default LogisticsMenu;
