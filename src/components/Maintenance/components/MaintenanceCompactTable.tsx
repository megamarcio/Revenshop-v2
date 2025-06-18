
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import { formatCurrency, formatDate, getMaintenanceTypeLabel } from '../utils/maintenanceFormatters';

interface MaintenanceCompactTableProps {
  maintenances: MaintenanceRecord[];
  canEditVehicles: boolean;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (maintenance: MaintenanceRecord) => void;
}

const MaintenanceCompactTable = ({
  maintenances,
  canEditVehicles,
  onEdit,
  onDelete
}: MaintenanceCompactTableProps) => {
  const {
    getMaintenanceStatus,
    getStatusLabel,
    getStatusBadgeStyles
  } = useMaintenanceStatus();

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold">Status</TableHead>
            <TableHead className="text-xs font-semibold">Código</TableHead>
            <TableHead className="text-xs font-semibold">Veículo</TableHead>
            <TableHead className="text-xs font-semibold">Tipo</TableHead>
            <TableHead className="text-xs font-semibold">Valor</TableHead>
            <TableHead className="text-xs font-semibold">Criado</TableHead>
            <TableHead className="text-xs font-semibold">Promessa</TableHead>
            <TableHead className="text-xs font-semibold">Mecânico</TableHead>
            {canEditVehicles && <TableHead className="text-xs font-semibold">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((maintenance) => {
            const status = getMaintenanceStatus(maintenance);
            return (
              <TableRow 
                key={maintenance.id} 
                className={`hover:bg-muted/25 text-xs ${maintenance.is_urgent ? 'bg-red-50' : ''}`}
              >
                <TableCell className="py-2">
                  <div className="flex gap-1 flex-wrap">
                    <Badge className={`${getStatusBadgeStyles(status)} text-[10px] px-1 py-0`}>
                      {getStatusLabel(status)}
                    </Badge>
                    {maintenance.is_urgent && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-1 py-0">
                        <AlertTriangle className="h-2 w-2 mr-1" />
                        Urgente
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-2 font-semibold text-revenshop-primary">
                  {maintenance.vehicle_internal_code}
                </TableCell>
                <TableCell className="py-2 max-w-32 truncate" title={maintenance.vehicle_name}>
                  {maintenance.vehicle_name}
                </TableCell>
                <TableCell className="py-2">
                  {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                </TableCell>
                <TableCell className="py-2 font-semibold text-revenshop-primary">
                  {formatCurrency(maintenance.total_amount)}
                </TableCell>
                <TableCell className="py-2">
                  {formatDate(maintenance.detection_date)}
                </TableCell>
                <TableCell className="py-2">
                  {maintenance.promised_date ? formatDate(maintenance.promised_date) : 'N/A'}
                </TableCell>
                <TableCell className="py-2 max-w-24 truncate" title={maintenance.mechanic_name}>
                  {maintenance.mechanic_name}
                </TableCell>
                {canEditVehicles && (
                  <TableCell className="py-2">
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(maintenance)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(maintenance)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceCompactTable;
