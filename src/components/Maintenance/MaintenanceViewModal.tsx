
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Wrench, Phone, DollarSign, Filter, Settings2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaintenanceRecord } from '../../types/maintenance';
import { useMaintenance } from '../../hooks/useMaintenance';
import TechnicalPanelRedesigned from './TechnicalPanel/TechnicalPanelRedesigned';

interface MaintenanceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const MaintenanceViewModal = ({ isOpen, onClose, vehicleId, vehicleName }: MaintenanceViewModalProps) => {
  const { maintenances, loading } = useMaintenance(vehicleId);
  const [statusFilter, setStatusFilter] = useState<'open' | 'pending' | 'completed' | 'all'>('open');
  const [showTechnicalPanel, setShowTechnicalPanel] = useState(false);

  const getMaintenanceStatus = (maintenance: MaintenanceRecord) => {
    const today = new Date();
    const repairDate = new Date(maintenance.repair_date);
    const promisedDate = maintenance.promised_date ? new Date(maintenance.promised_date) : null;
    
    if (repairDate < today) return 'completed';
    if (promisedDate && promisedDate < today && !maintenance.repair_date) return 'overdue';
    if (promisedDate && !maintenance.repair_date) return 'pending';
    return 'open';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Em Aberto';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencida';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'overdue': return 'bg-red-100 text-red-800';
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
      return status === 'open' || status === 'pending' || status === 'overdue';
    }
    return status === statusFilter;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalCost = maintenances.reduce((sum, m) => sum + m.total_amount, 0);
  const overdueMaintenances = maintenances.filter(m => getMaintenanceStatus(m) === 'overdue');
  const pendingMaintenances = maintenances.filter(m => getMaintenanceStatus(m) === 'pending');

  const handleTechnicalPanelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Opening Technical Panel');
    setShowTechnicalPanel(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-revenshop-primary" />
              Manutenções - {vehicleName || 'Veículo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Alertas de Destaque */}
            {(overdueMaintenances.length > 0 || pendingMaintenances.length > 0) && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Atenção Necessária</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {overdueMaintenances.length > 0 && (
                    <div className="bg-red-100 border border-red-300 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-500 text-white">
                          {overdueMaintenances.length}
                        </Badge>
                        <span className="font-medium text-red-800">Manutenções Vencidas</span>
                      </div>
                      <div className="text-sm text-red-700">
                        Requerem ação imediata
                      </div>
                    </div>
                  )}
                  {pendingMaintenances.length > 0 && (
                    <div className="bg-orange-100 border border-orange-300 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-500 text-white">
                          {pendingMaintenances.length}
                        </Badge>
                        <span className="font-medium text-orange-800">Manutenções Pendentes</span>
                      </div>
                      <div className="text-sm text-orange-700">
                        Com data prometida agendada
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filtros e Resumo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Em Aberto e Pendentes</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                    <SelectItem value="all">Todas</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTechnicalPanelClick}
                  className="flex items-center gap-2"
                  type="button"
                >
                  <Settings2 className="h-4 w-4" />
                  Painel Técnico
                  {(overdueMaintenances.length > 0 || pendingMaintenances.length > 0) && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {overdueMaintenances.length + pendingMaintenances.length}
                    </Badge>
                  )}
                </Button>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Custo Total: </span>
                <span className="font-bold text-revenshop-primary">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            {/* Lista de Manutenções */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Carregando manutenções...</p>
                </div>
              ) : filteredMaintenances.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Nenhuma manutenção encontrada</p>
                </div>
              ) : (
                filteredMaintenances.map((maintenance) => {
                  const status = getMaintenanceStatus(maintenance);
                  const isHighPriority = status === 'overdue' || status === 'pending';
                  
                  return (
                    <Card 
                      key={maintenance.id} 
                      className={`border-l-4 ${
                        status === 'overdue' 
                          ? 'border-l-red-500 bg-red-50/30' 
                          : status === 'pending'
                          ? 'border-l-orange-500 bg-orange-50/30'
                          : 'border-l-revenshop-primary'
                      } ${isHighPriority ? 'shadow-md' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusBadge(status)}>
                              {getStatusLabel(status)}
                            </Badge>
                            <span className="text-sm font-medium">
                              {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                            </span>
                            {isHighPriority && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <span className="font-bold text-revenshop-primary">
                            {formatCurrency(maintenance.total_amount)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Detecção:</span>
                              <span>{format(new Date(maintenance.detection_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                            </div>
                            {maintenance.promised_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className={`h-4 w-4 ${status === 'overdue' ? 'text-red-500' : 'text-orange-500'}`} />
                                <span className="text-gray-600">Prometida:</span>
                                <span className={status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                                  {format(new Date(maintenance.promised_date), 'dd/MM/yyyy', { locale: ptBR })}
                                </span>
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
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm">
                            <span className="text-gray-600">Itens:</span>
                            <span className="ml-2">{maintenance.maintenance_items.join(', ')}</span>
                          </div>
                          {maintenance.details && (
                            <div className="text-sm mt-1">
                              <span className="text-gray-600">Detalhes:</span>
                              <span className="ml-2">{maintenance.details}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TechnicalPanelRedesigned
        isOpen={showTechnicalPanel}
        onClose={() => setShowTechnicalPanel(false)}
        vehicleId={vehicleId}
        vehicleName={vehicleName}
      />
    </>
  );
};

export default MaintenanceViewModal;
