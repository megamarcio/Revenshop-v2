
import React from 'react';
import { DollarSign, CreditCard, Calculator, ChevronDown } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FinancingMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FinancingMenu = ({
  activeTab,
  setActiveTab
}: FinancingMenuProps) => {
  const { state } = useSidebar();
  
  const financingSubmenuItems = [
    { id: 'bhph', label: 'Buy Here Pay Here', icon: CreditCard },
    { id: 'financing', label: 'Simulação de Financiamento', icon: Calculator },
  ];

  const isFinancingActive = financingSubmenuItems.some(item => activeTab === item.id);

  return (
    <SidebarMenuItem>
      <Collapsible open={isFinancingActive} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={state === "collapsed" ? "Simulação" : undefined} 
            isActive={isFinancingActive}
          >
            <DollarSign className="h-4 w-4" />
            <span>Simulação</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {financingSubmenuItems.map((item) => {
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

export default FinancingMenu;
