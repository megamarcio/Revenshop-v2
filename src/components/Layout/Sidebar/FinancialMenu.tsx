import React from 'react';
import { 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem,
  useSidebar 
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, DollarSign } from 'lucide-react';

interface FinancialMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FinancialMenu: React.FC<FinancialMenuProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useSidebar();
  
  const financialSubmenuItems = [
    { id: 'financial', label: 'Dashboard' },
    { id: 'revenues', label: 'Receitas' },
    { id: 'expenses', label: 'Despesas' },
    { id: 'fluxo-caixa', label: 'Fluxo de Caixa' },
    { id: 'bank-statements', label: 'Extratos' },
    { id: 'software', label: 'Software' },
    { id: 'financial-config', label: 'Configurações' },
  ];

  const isFinancialActive = financialSubmenuItems.some(item => activeTab === item.id);

  return (
    <SidebarMenuItem>
      <Collapsible asChild defaultOpen={isFinancialActive}>
        <div>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              tooltip={state === "collapsed" ? "Financeiro" : undefined}
              isActive={isFinancialActive}
            >
              <DollarSign />
              <span>Financeiro</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {financialSubmenuItems.map((item) => (
                <SidebarMenuSubItem key={item.id}>
                  <SidebarMenuSubButton 
                    asChild
                    isActive={activeTab === item.id}
                  >
                    <button onClick={() => setActiveTab(item.id)}>
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default FinancialMenu;
