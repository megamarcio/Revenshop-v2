import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Wrench, Phone, Edit, Trash2, Clock } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import { formatCurrency, formatDate, getMaintenanceTypeLabel } from '../utils/maintenanceFormatters';
interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  canEditVehicles: boolean;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (maintenance: MaintenanceRecord) => void;
}
const MaintenanceCard = ({
  maintenance,
  canEditVehicles,
  onEdit,
  onDelete
}: MaintenanceCardProps) => {
  const {
    getMaintenanceStatus,
    getStatusLabel,
    getStatusBadgeStyles
  } = useMaintenanceStatus();
  const status = getMaintenanceStatus(maintenance);
  return <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-revenshop-primary relative">
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
            {canEditVehicles && <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(maintenance)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(maintenance)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>}
          </div>
        </div>

        <div className="ml-24 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Criado em:</span>
              <span>{formatDate(maintenance.detection_date)}</span>
            </div>
            {maintenance.promised_date && <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600">Prometida:</span>
                <span>{formatDate(maintenance.promised_date)}</span>
              </div>}
            {maintenance.repair_date && <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Reparo:</span>
                <span>{formatDate(maintenance.repair_date)}</span>
              </div>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Mecânico:</span>
              <span>{maintenance.mechanic_name}</span>
            </div>
            
          </div>

          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-600">Itens:</span>
              <span className="ml-2">{maintenance.maintenance_items.slice(0, 2).join(', ')}</span>
              {maintenance.maintenance_items.length > 2 && <span className="text-gray-500">... +{maintenance.maintenance_items.length - 2}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default MaintenanceCard;