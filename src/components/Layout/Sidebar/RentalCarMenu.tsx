
import React, { useState } from 'react';
import { Car, Search, List, Truck, ChevronDown } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  
  const rentalCarSubmenuItems = [
    { id: 'acompanhar-reservas', label: 'Acompanhar Reservas', icon: Search },
    { id: 'lista-reservas', label: 'Lista de Reservas', icon: List },
    { id: 'logistica', label: 'Logística', icon: Truck },
  ];

  const isRentalCarActive = rentalCarSubmenuItems.some(item => activeTab === item.id);

  // Auto-open when a submenu is active
  React.useEffect(() => {
    if (isRentalCarActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isRentalCarActive, isOpen]);

  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={state === "collapsed" ? "Rental Car" : undefined}
            isActive={isRentalCarActive}
          >
            <Car className="h-4 w-4" />
            <span>Rental Car</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {rentalCarSubmenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuSubItem key={item.id}>
                  <SidebarMenuSubButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default RentalCarMenu;
