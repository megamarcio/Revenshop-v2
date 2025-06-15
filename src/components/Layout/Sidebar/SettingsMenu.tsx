
import React from 'react';
import { Settings, Users, User, ChevronRight, Shield } from 'lucide-react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

interface SettingsMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsMenu = ({ activeTab, setActiveTab }: SettingsMenuProps) => {
  const { t } = useLanguage();
  const { canManageUsers, canAccessAdmin } = useAuth();
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={state === "collapsed" ? "Configurações" : undefined}
            className="w-full hover:bg-muted data-[state=open]:bg-muted"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm px-0 mx-0">Configurações</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {/* Menu Usuários e Permissões simplificado */}
            {canManageUsers && (
              <>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    onClick={() => setActiveTab('users')}
                    className={`cursor-pointer ${activeTab === 'users' ? 'bg-revenshop-primary text-white' : ''}`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Lista de Usuários</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    onClick={() => setActiveTab('permissions')}
                    className={`cursor-pointer ${activeTab === 'permissions' ? 'bg-revenshop-primary text-white' : ''}`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Permissões</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </>
            )}
            
            {/* Menu Perfil */}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('profile')}
                className={`cursor-pointer ${activeTab === 'profile' ? 'bg-revenshop-primary text-white' : ''}`}
              >
                <User className="h-4 w-4" />
                <span>{t('profile')}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            
            {/* Menu Admin (antigo) se o usuário tem acesso */}
            {canAccessAdmin && (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  onClick={() => setActiveTab('admin')}
                  className={`cursor-pointer ${activeTab === 'admin' ? 'bg-revenshop-primary text-white' : ''}`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default SettingsMenu;
