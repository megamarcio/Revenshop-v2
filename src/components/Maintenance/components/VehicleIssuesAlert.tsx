
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Eye, Wrench, Settings } from 'lucide-react';

interface VehicleIssue {
  id: string;
  name: string;
  internal_code: string;
  issues: string[];
}

interface VehicleIssuesAlertProps {
  vehiclesWithIssues: VehicleIssue[];
  onViewDetails: () => void;
  onViewVehicleMaintenance: (vehicleId: string, vehicleName: string) => void;
}

const VehicleIssuesAlert = ({ 
  vehiclesWithIssues, 
  onViewDetails, 
  onViewVehicleMaintenance 
}: VehicleIssuesAlertProps) => {
  if (vehiclesWithIssues.length === 0) {
    return null;
  }

  // Helper function to determine the type of issue and its icon
  const getIssueTypeInfo = (issue: string) => {
    if (issue.includes('(Trocar)')) {
      return { type: 'critical', icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-300' };
    } else if (issue.includes('(Próximo da Troca)')) {
      return { type: 'warning', icon: Settings, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    } else if (issue.includes('(Manutenção Pendente)')) {
      return { type: 'maintenance', icon: Wrench, color: 'bg-blue-100 text-blue-700 border-blue-300' };
    }
    return { type: 'default', icon: AlertTriangle, color: 'bg-gray-100 text-gray-700 border-gray-300' };
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              Atenção - Veículos Precisam de Manutenção
            </h3>
            <Badge variant="destructive">
              {vehiclesWithIssues.length} veículos
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100"
          >
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </Button>
        </div>
        <div className="space-y-2">
          {vehiclesWithIssues.slice(0, 5).map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-700">{vehicle.internal_code}</span>
                  <span className="text-red-600">- {vehicle.name}</span>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {vehicle.issues.map((issue: string, index: number) => {
                    const { color } = getIssueTypeInfo(issue);
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs ${color}`}
                      >
                        {issue}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewVehicleMaintenance(vehicle.id, `${vehicle.internal_code} - ${vehicle.name}`)}
                className="ml-2 flex items-center gap-1 border-red-300 text-red-700 hover:bg-red-100"
              >
                <Wrench className="h-3 w-3" />
                Ver Manutenção
              </Button>
            </div>
          ))}
          {vehiclesWithIssues.length > 5 && (
            <p className="text-sm text-red-600 mt-2">
              ... e mais {vehiclesWithIssues.length - 5} veículos
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleIssuesAlert;
