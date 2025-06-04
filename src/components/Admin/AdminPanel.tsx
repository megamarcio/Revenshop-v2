import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import BHPHSettings from './BHPHSettings';
import { 
  Settings, 
  Users, 
  Database, 
  Shield, 
  Activity,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  CreditCard
} from 'lucide-react';

// Mock data para demonstração
const systemStats = {
  totalUsers: 15,
  activeUsers: 12,
  totalVehicles: 247,
  soldVehicles: 89,
  systemUptime: '99.9%',
  lastBackup: '2024-01-15 03:00:00'
};

const recentActivities = [
  { id: '1', user: 'João Silva', action: 'Adicionou veículo', timestamp: '2024-01-15 14:30', type: 'success' },
  { id: '2', user: 'Maria Santos', action: 'Vendeu veículo', timestamp: '2024-01-15 13:45', type: 'success' },
  { id: '3', user: 'Sistema', action: 'Backup automático', timestamp: '2024-01-15 03:00', type: 'info' },
  { id: '4', user: 'Admin', action: 'Criou usuário', timestamp: '2024-01-14 16:20', type: 'warning' },
  { id: '5', user: 'Pedro Costa', action: 'Login falhado', timestamp: '2024-01-14 15:10', type: 'error' }
];

interface AdminPanelProps {
  onNavigateToUsers?: () => void;
}

const AdminPanel = ({ onNavigateToUsers }: AdminPanelProps) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">Acesso Negado</h2>
            <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta área.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBackup = async () => {
    setIsLoading(true);
    try {
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: t('success'),
        description: 'Backup realizado com sucesso!',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erro ao realizar backup.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemMaintenance = async () => {
    setIsLoading(true);
    try {
      // Simular manutenção
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: t('success'),
        description: 'Manutenção do sistema executada com sucesso!',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erro na manutenção do sistema.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('admin')}</h1>
        <p className="text-gray-600 mt-1">Painel de administração do sistema</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="bhph">BHPH</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {systemStats.activeUsers} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalVehicles}</div>
                <p className="text-xs text-muted-foreground">
                  {systemStats.soldVehicles} vendidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime do Sistema</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
                <p className="text-xs text-muted-foreground">
                  Últimas 24h
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getActivityBadgeColor(activity.type)}>
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Acesse a seção completa de gerenciamento de usuários do sistema.
              </p>
              <Button 
                variant="outline"
                onClick={onNavigateToUsers}
              >
                <Users className="h-4 w-4 mr-2" />
                Ir para Usuários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bhph" className="space-y-6">
          <BHPHSettings />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Último backup: {new Date(systemStats.lastBackup).toLocaleString('pt-BR')}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleBackup} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Fazendo Backup...' : 'Fazer Backup'}
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Restaurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manutenção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Execute tarefas de manutenção do sistema
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleSystemMaintenance}
                    disabled={isLoading}
                    variant="outline" 
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isLoading ? 'Executando...' : 'Executar Manutenção'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações Avançadas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getActivityIcon(activity.type)}
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-600">-</span>
                        <span className="text-gray-600">{activity.action}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <Button variant="outline">
                  Carregar mais logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
