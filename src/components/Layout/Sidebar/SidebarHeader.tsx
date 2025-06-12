
import React from 'react';
import { SidebarHeader, useSidebar } from '@/components/ui/sidebar';

const AppSidebarHeader = () => {
  const { state } = useSidebar();

  return (
    <SidebarHeader className="p-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-revenshop-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        {state === "expanded" && <span className="font-semibold text-lg">RevenShop</span>}
      </div>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
