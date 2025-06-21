import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';
import { MaintenanceRecord } from '../../../types/maintenance';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import { formatCurrency, formatDate, getMaintenanceTypeLabel } from '../utils/maintenanceFormatters';

interface MaintenanceCompactTableProps {
  maintenances: MaintenanceRecord[];
  canEditVehicles: boolean;
  onEdit: (maintenance: MaintenanceRecord) => void;
  onDelete: (maintenance: MaintenanceRecord) => void;
  onReopen?: (maintenance: MaintenanceRecord) => void;
}

const MaintenanceCompactTable = ({
  maintenances,
  canEditVehicles,
  onEdit,
  onDelete,
  onReopen
}: MaintenanceCompactTableProps) => {
  const {
    getMaintenanceStatus,
    getStatusLabel,
    getStatusBadgeStyles
  } = useMaintenanceStatus();

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold whitespace-nowrap">Status</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap">Código</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap hidden sm:table-cell">Veículo</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap hidden md:table-cell">Tipo</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap">Valor</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap hidden sm:table-cell">Criado</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap hidden lg:table-cell">Promessa</TableHead>
              <TableHead className="text-xs font-semibold whitespace-nowrap hidden md:table-cell">Mecânico</TableHead>
              {canEditVehicles && <TableHead className="text-xs font-semibold whitespace-nowrap">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenances.map((maintenance) => {
              const status = getMaintenanceStatus(maintenance);
              const isCompleted = status === 'completed';
              return (
                <TableRow 
                  key={maintenance.id} 
                  className={`hover:bg-muted/25 text-xs ${maintenance.is_urgent ? 'bg-red-50' : ''} ${isCompleted ? 'bg-green-50' : ''}`}
                >
                  <TableCell className="py-2">
                    <div className="flex gap-1 flex-wrap">
                      <Badge className={`${getStatusBadgeStyles(status)} text-[10px] px-1 py-0`}>
                        {getStatusLabel(status)}
                      </Badge>
                      {maintenance.is_urgent && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-1 py-0">
                          <AlertTriangle className="h-2 w-2 mr-1" />
                          <span className="hidden sm:inline">Urgente</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 font-semibold text-revenshop-primary whitespace-nowrap">
                    {maintenance.vehicle_internal_code}
                  </TableCell>
                  <TableCell className="py-2 max-w-32 truncate hidden sm:table-cell" title={maintenance.vehicle_name}>
                    {maintenance.vehicle_name}
                  </TableCell>
                  <TableCell className="py-2 hidden md:table-cell">
                    {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                  </TableCell>
                  <TableCell className="py-2 font-semibold text-revenshop-primary whitespace-nowrap">
                    {formatCurrency(maintenance.total_amount)}
                  </TableCell>
                  <TableCell className="py-2 hidden sm:table-cell">
                    {formatDate(maintenance.detection_date)}
                  </TableCell>
                  <TableCell className="py-2 hidden lg:table-cell">
                    {maintenance.repair_date ? (
                      <span className="text-green-600">Concluída: {formatDate(maintenance.repair_date)}</span>
                    ) : maintenance.promised_date ? (
                      formatDate(maintenance.promised_date)
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="py-2 max-w-24 truncate hidden md:table-cell" title={maintenance.mechanic_name}>
                    {maintenance.mechanic_name}
                  </TableCell>
                  {canEditVehicles && (
                    <TableCell className="py-2">
                      <div className="flex gap-1">
                        {isCompleted && onReopen && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onReopen(maintenance)}
                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Reabrir manutenção"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(maintenance)}
                          className="h-6 w-6 p-0"
                          title="Editar manutenção"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(maintenance)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Excluir manutenção"
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
    </div>
  );
};

export default MaintenanceCompactTable;
