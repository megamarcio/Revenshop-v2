
import React, { useState } from 'react';
import { Truck, ChevronRight } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const LogisticsMenu = () => {
  const { state } = useSidebar();
  const [open, setOpen] = useState(false);

  // Agora, o filtro por datas aparece só na tela lateral,
  // então removemos daqui todo o conteúdo de filtro/busca.
  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible" open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={state === "collapsed" ? "Consulta Reservas" : undefined}
            className="w-full hover:bg-muted data-[state=open]:bg-muted"
          >
            <Truck className="h-4 w-4" />
            <span className="text-sm px-0 mx-0">Consulta Reservas</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {/* Não há mais filtros no menu, mas poderíamos ter atalhos/tipos aqui futuramente */}
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <div className="flex flex-col w-full gap-2 px-2 pb-2 text-muted-foreground text-xs">
                Inicie uma busca na tela principal.
              </div>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default LogisticsMenu;
