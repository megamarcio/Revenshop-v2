import React from 'react';
import { Car, Search, List, Truck, ChevronRight } from 'lucide-react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface RentalCarMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const RentalCarMenu = ({ activeTab, setActiveTab }: RentalCarMenuProps) => {
  const { state } = useSidebar();
  
  const isAnySubMenuActive = ['acompanhar-reservas', 'lista-reservas', 'logistica'].includes(activeTab);

  return (
    <Collapsible defaultOpen={isAnySubMenuActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={state === "collapsed" ? "Rental Car" : undefined}
            className="w-full hover:bg-muted"
            isActive={isAnySubMenuActive}
          >
            <Car className="h-4 w-4" />
            <span className="text-sm px-0 mx-0">Rental Car</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('acompanhar-reservas')}
                isActive={activeTab === 'acompanhar-reservas'}
              >
                <Search className="h-4 w-4" />
                <span>Acompanhar Reservas</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('lista-reservas')}
                isActive={activeTab === 'lista-reservas'}
              >
                <List className="h-4 w-4" />
                <span>Lista de Reservas</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('logistica')}
                isActive={activeTab === 'logistica'}
              >
                <Truck className="h-4 w-4" />
                <span>Logística</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default RentalCarMenu;
