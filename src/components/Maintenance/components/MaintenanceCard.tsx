import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Wrench, Edit, Trash2, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import { formatCurrency, formatDate, getMaintenanceTypeLabel } from '../utils/maintenanceFormatters';

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  canEditVehicles: boolean;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (maintenance: MaintenanceRecord) => void;
  onReopen?: (maintenance: MaintenanceRecord) => void;
}

const MaintenanceCard = ({
  maintenance,
  canEditVehicles,
  onEdit,
  onDelete,
  onReopen
}: MaintenanceCardProps) => {
  const {
    getMaintenanceStatus,
    getStatusLabel,
    getStatusBadgeStyles
  } = useMaintenanceStatus();

  const status = getMaintenanceStatus(maintenance);
  const isCompleted = status === 'completed';

  const getMaintenanceItemsDisplay = () => {
    if (maintenance.maintenance_items.includes('Outros') && maintenance.custom_maintenance) {
      const otherItems = maintenance.maintenance_items.filter(item => item !== 'Outros');
      const outrosText = `Outros: ${maintenance.custom_maintenance}`;
      
      if (otherItems.length > 0) {
        return `${otherItems.slice(0, 1).join(', ')}, ${outrosText}`;
      }
      return outrosText;
    }
    
    const displayItems = maintenance.maintenance_items.slice(0, 2).join(', ');
    if (maintenance.maintenance_items.length > 2) {
      return `${displayItems}... +${maintenance.maintenance_items.length - 2}`;
    }
    return displayItems;
  };

  const cardBorderClass = maintenance.is_urgent 
    ? "border-l-4 border-l-red-500 bg-red-50" 
    : isCompleted 
    ? "border-l-4 border-l-green-500 bg-green-50"
    : "border-l-4 border-l-revenshop-primary";

  const handleCardClick = () => {
    if (isCompleted && onReopen) {
      onReopen(maintenance);
    } else {
      onEdit(maintenance);
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer h-full ${cardBorderClass}`} onClick={handleCardClick}>
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header - Status e Urgente */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1 flex-wrap">
            <Badge className={`${getStatusBadgeStyles(status)} text-xs px-2 py-1`}>
              {getStatusLabel(status)}
            </Badge>
            {maintenance.is_urgent && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span className="hidden sm:inline">Urgente</span>
              </Badge>
            )}
          </div>
          
          {canEditVehicles && (
            <div className="flex gap-1">
              {isCompleted && onReopen && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onReopen(maintenance);
                  }} 
                  className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  title="Reabrir manutenção"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(maintenance);
                }} 
                className="h-7 w-7 p-0"
                title="Editar manutenção"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(maintenance);
                }} 
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Excluir manutenção"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Veículo e Tipo */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-revenshop-primary text-base">
              {maintenance.vehicle_internal_code}
            </span>
            <span className="text-gray-500 text-xs">
              {getMaintenanceTypeLabel(maintenance.maintenance_type)}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {maintenance.vehicle_name}
          </h3>
        </div>

        {/* Valor */}
        <div className="mb-3">
          <span className="font-bold text-lg text-revenshop-primary">
            {formatCurrency(maintenance.total_amount)}
          </span>
        </div>

        {/* Datas */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span>Criada: {formatDate(maintenance.detection_date)}</span>
          </div>
          
          {maintenance.repair_date ? (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Wrench className="h-3 w-3" />
              <span>Concluída: {formatDate(maintenance.repair_date)}</span>
            </div>
          ) : maintenance.promised_date ? (
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <Clock className="h-3 w-3" />
              <span>Promessa: {formatDate(maintenance.promised_date)}</span>
            </div>
          ) : null}
        </div>

        {/* Mecânico */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Wrench className="h-3 w-3 text-gray-400" />
            <span className="truncate font-medium">{maintenance.mechanic_name}</span>
          </div>
        </div>

        {/* Itens de manutenção */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="text-xs">
            <span className="font-medium text-revenshop-primary">Itens:</span>
            <span className="ml-1 text-gray-700 line-clamp-2">{getMaintenanceItemsDisplay()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCard;
