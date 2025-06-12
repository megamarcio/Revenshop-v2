
import React from 'react';
import { DollarSign, CreditCard, Calculator, ChevronRight } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FinancingMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FinancingMenu = ({ activeTab, setActiveTab }: FinancingMenuProps) => {
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={state === "collapsed" ? "Financiamento" : undefined}
            className="w-full hover:bg-muted data-[state=open]:bg-muted"
          >
            <DollarSign className="h-4 w-4" />
            <span className="text-sm px-0 mx-0">Financiamento</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('bhph')}
                className={`cursor-pointer ${activeTab === 'bhph' ? 'bg-revenshop-primary text-white' : ''}`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Here Pay Here</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('financing')}
                className={`cursor-pointer ${activeTab === 'financing' ? 'bg-revenshop-primary text-white' : ''}`}
              >
                <Calculator className="h-4 w-4" />
                <span>Simulação de Financiamento</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default FinancingMenu;
