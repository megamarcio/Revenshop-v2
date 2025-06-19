
import React, { useState } from 'react';
import { 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem,
  useSidebar 
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, DollarSign, TrendingUp, TrendingDown, FileText, Settings, Monitor, Repeat } from 'lucide-react';

interface FinancialMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FinancialMenu: React.FC<FinancialMenuProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  
  const financialSubmenuItems = [
    { id: 'financial', label: 'Dashboard', icon: DollarSign },
    { id: 'revenues', label: 'Receitas', icon: TrendingUp },
    { id: 'expenses', label: 'Despesas', icon: TrendingDown },
    { id: 'fixed-expenses', label: 'Despesas Fixas', icon: Repeat },
    { id: 'bank-statements', label: 'Extratos', icon: FileText },
    { id: 'software', label: 'Software', icon: Monitor },
    { id: 'financial-config', label: 'Configurações', icon: Settings },
  ];

  const isFinancialActive = financialSubmenuItems.some(item => activeTab === item.id);

  // Auto-open when a submenu is active
  React.useEffect(() => {
    if (isFinancialActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isFinancialActive, isOpen]);

  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={state === "collapsed" ? "Financeiro" : undefined}
            isActive={isFinancialActive}
          >
            <DollarSign className="h-4 w-4" />
            <span>Financeiro</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {financialSubmenuItems.map((item) => {
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

export default FinancialMenu;
