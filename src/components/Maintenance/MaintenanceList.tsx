import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Wrench, Phone, DollarSign, Filter, Trash2, Edit, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaintenanceRecord } from '../../types/maintenance';
import { useMaintenance } from '../../hooks/useMaintenance/index';
import { useAuth } from '../../contexts/AuthContext';

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
}

const MaintenanceList = ({ onEdit }: MaintenanceListProps) => {
  const { maintenances, loading, deleteMaintenance } = useMaintenance();
  const { canEditVehicles } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'completed' | 'all'>('open');

  const getMaintenanceStatus = (maintenance: MaintenanceRecord) => {
    const today = new Date();
    const repairDate = maintenance.repair_date ? new Date(maintenance.repair_date) : null;
    const promisedDate = maintenance.promised_date ? new Date(maintenance.promised_date) : null;
    
    // Concluída: com data de reparo
    if (repairDate) return 'completed';
    
    // Pendente: com data prometida mas sem data de reparo
    if (promisedDate && !repairDate) return 'pending';
    
    // Em aberto: sem data prometida e sem data de reparo
    return 'open';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Em Aberto';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'open': 
        return 'bg-yellow-500 hover:bg-yellow-600 text-white border-0';
      case 'pending': 
        return 'bg-orange-500 hover:bg-orange-600 text-white border-0';
      case 'completed': 
        return 'bg-green-500 hover:bg-green-600 text-white border-0';
      default: 
        return 'bg-gray-500 hover:bg-gray-600 text-white border-0';
    }
  };

  const getMaintenanceTypeLabel = (type: string) => {
    switch (type) {
      case 'preventive': return '🛠️ Preventiva';
      case 'corrective': return '🔧 Corretiva';
      case 'bodyshop': return '🧽 Bodyshop';
      default: return type;
    }
  };

  // Ordenar por código interno do veículo e depois por data de detecção
  const sortedMaintenances = [...maintenances].sort((a, b) => {
    // Primeiro por código interno do veículo
    const codeComparison = a.vehicle_internal_code.localeCompare(b.vehicle_internal_code);
    if (codeComparison !== 0) return codeComparison;
    
    // Depois por data de detecção (mais antiga primeiro)
    return new Date(a.detection_date).getTime() - new Date(b.detection_date).getTime();
  });

  const filteredMaintenances = sortedMaintenances.filter(maintenance => {
    const status = getMaintenanceStatus(maintenance);
    if (statusFilter === 'all') return true;
    if (statusFilter === 'open') {
      return status === 'open' || status === 'pending';
    }
    return status === statusFilter;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDelete = async (maintenance: MaintenanceRecord) => {
    if (window.confirm(`Tem certeza que deseja excluir a manutenção do veículo ${maintenance.vehicle_internal_code} - ${maintenance.vehicle_name}?`)) {
      await deleteMaintenance(maintenance.id!);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 relative">
        {/* Legenda dos Status no canto superior esquerdo */}
        <div className="fixed top-20 left-6 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white shadow-md border border-gray-300 hover:bg-gray-50">
                <Info className="h-4 w-4 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-4 bg-white border shadow-lg">
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Legenda dos Status:</h4>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span><strong>Em Aberto:</strong> Sem data prometida</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span><strong>Pendente:</strong> Com data prometida</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span><strong>Concluída:</strong> Com data de reparo</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Em Aberto e Pendentes</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            Ordenadas por código do veículo e data de detecção
          </div>
        </div>

        {/* Lista de Manutenções */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando manutenções...</p>
            </div>
          ) : filteredMaintenances.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma manutenção encontrada
                </h3>
                <p className="text-gray-500">
                  {statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Cadastre a primeira manutenção para começar'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMaintenances.map((maintenance) => {
              const status = getMaintenanceStatus(maintenance);
              return (
                <Card key={maintenance.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-revenshop-primary relative">
                  <CardContent className="p-4">
                    {/* Status no canto superior esquerdo do card */}
                    <div className="absolute top-3 left-3">
                      <Badge className={getStatusBadgeStyles(status)}>
                        {getStatusLabel(status)}
                      </Badge>
                    </div>

                    <div className="ml-24 flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-revenshop-primary">
                          {maintenance.vehicle_internal_code}
                        </span>
                        <span className="text-gray-700">- {maintenance.vehicle_name}</span>
                        <span className="text-sm">
                          {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-revenshop-primary text-lg">
                          {formatCurrency(maintenance.total_amount)}
                        </span>
                        {canEditVehicles && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(maintenance)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(maintenance)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-24 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Detecção:</span>
                          <span>{format(new Date(maintenance.detection_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                        {maintenance.promised_date && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-gray-600">Prometida:</span>
                            <span>{format(new Date(maintenance.promised_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                        )}
                        {maintenance.repair_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">Reparo:</span>
                            <span>{format(new Date(maintenance.repair_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Mecânico:</span>
                          <span>{maintenance.mechanic_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{maintenance.mechanic_phone}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-600">Itens:</span>
                          <span className="ml-2">{maintenance.maintenance_items.slice(0, 2).join(', ')}</span>
                          {maintenance.maintenance_items.length > 2 && (
                            <span className="text-gray-500">... +{maintenance.maintenance_items.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MaintenanceList;
