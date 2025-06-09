
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Wrench, Phone, DollarSign, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaintenanceRecord } from '../../types/maintenance';
import { useMaintenance } from '../../hooks/useMaintenance';

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
}

const MaintenanceList = ({ onEdit }: MaintenanceListProps) => {
  const { maintenances, loading } = useMaintenance();
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'completed' | 'all'>('open');

  const getMaintenanceStatus = (maintenance: MaintenanceRecord) => {
    const today = new Date();
    const repairDate = new Date(maintenance.repair_date);
    const detectionDate = new Date(maintenance.detection_date);
    
    if (repairDate < today) return 'completed';
    if (detectionDate <= today && repairDate >= today) return 'pending';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredMaintenances = maintenances.filter(maintenance => {
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

  return (
    <div className="space-y-6">
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
              <Card key={maintenance.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-revenshop-primary" onClick={() => onEdit(maintenance)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(status)}>
                        {getStatusLabel(status)}
                      </Badge>
                      <span className="font-bold text-revenshop-primary">
                        {maintenance.vehicle_internal_code}
                      </span>
                      <span className="text-gray-700">- {maintenance.vehicle_name}</span>
                      <span className="text-sm">
                        {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                      </span>
                    </div>
                    <span className="font-bold text-revenshop-primary text-lg">
                      {formatCurrency(maintenance.total_amount)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Detecção:</span>
                        <span>{format(new Date(maintenance.detection_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Reparo:</span>
                        <span>{format(new Date(maintenance.repair_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
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
  );
};

export default MaintenanceList;
