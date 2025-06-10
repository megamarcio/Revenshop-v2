
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Wrench, Phone, DollarSign, Filter, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaintenanceRecord } from '../../types/maintenance';
import { useMaintenance } from '../../hooks/useMaintenance';
import TechnicalPanelModal from './TechnicalPanelModal';

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
    if (statusFilter === 'open' || statusFilter === 'pending') {
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

  const totalCost = maintenances.reduce((sum, m) => sum + m.total_amount, 0);

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
                  return (
                    <Card key={maintenance.id} className="border-l-4 border-l-revenshop-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusBadge(status)}>
                              {getStatusLabel(status)}
                            </Badge>
                            <span className="text-sm font-medium">
                              {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                            </span>
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

      <TechnicalPanelModal
        isOpen={showTechnicalPanel}
        onClose={() => setShowTechnicalPanel(false)}
        vehicleId={vehicleId}
        vehicleName={vehicleName}
      />
    </>
  );
};

export default MaintenanceViewModal;
