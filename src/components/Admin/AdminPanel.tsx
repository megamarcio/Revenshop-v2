
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, DollarSign, TrendingUp } from 'lucide-react';
import BHPHSettings from './BHPHSettings';

interface AdminPanelProps {
  onNavigateToUsers: () => void;
}

const AdminPanel = ({ onNavigateToUsers }: AdminPanelProps) => {
  const { canAccessAdmin, canEditBHPHSettings } = useAuth();

  if (!canAccessAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-600">Acesso Negado</h2>
            <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta área.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
        <p className="text-gray-600 mt-1">Configurações e gestão do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onNavigateToUsers}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerenciar Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">usuários ativos</p>
            <Button variant="outline" size="sm" className="mt-2">
              Ver usuários
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">configurações ativas</p>
            <Button variant="outline" size="sm" className="mt-2" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">relatórios gerados</p>
            <Button variant="outline" size="sm" className="mt-2" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>
      </div>

      {canEditBHPHSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Configurações Buy Here Pay Here</span>
            </CardTitle>
            <CardDescription>
              Configure as taxas e percentuais padrão para financiamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BHPHSettings />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPanel;
