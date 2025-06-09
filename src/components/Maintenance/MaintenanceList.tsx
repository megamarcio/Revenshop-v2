
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Wrench, Car, Phone, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaintenanceListProps {
  onEdit: (maintenance: any) => void;
}

// Mock data for demonstration
const mockMaintenances = [
  {
    id: '1',
    vehicle_name: 'Honda Civic',
    vehicle_internal_code: 'HC001',
    detection_date: '2024-01-10',
    repair_date: '2024-01-12',
    maintenance_type: 'preventive',
    maintenance_items: ['Troca de óleo', 'Filtro de óleo'],
    mechanic_name: 'João Silva',
    mechanic_phone: '(11) 99999-9999',
    total_amount: 350.00,
    details: 'Manutenção preventiva realizada conforme programação'
  },
  {
    id: '2',
    vehicle_name: 'Toyota Corolla',
    vehicle_internal_code: 'TC002',
    detection_date: '2024-01-15',
    repair_date: '2024-01-16',
    maintenance_type: 'corrective',
    maintenance_items: ['Bateria descarregada'],
    mechanic_name: 'Carlos Santos',
    mechanic_phone: '(11) 88888-8888',
    total_amount: 280.00,
    details: 'Substituição da bateria que apresentou defeito'
  }
];

const MaintenanceList = ({ onEdit }: MaintenanceListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getMaintenanceTypeLabel = (type: string) => {
    switch (type) {
      case 'preventive': return '🛠️ Preventiva';
      case 'corrective': return '🔧 Corretiva';
      case 'bodyshop': return '🧽 Bodyshop';
      default: return type;
    }
  };

  const getMaintenanceTypeBadge = (type: string) => {
    switch (type) {
      case 'preventive': return 'bg-green-100 text-green-800';
      case 'corrective': return 'bg-red-100 text-red-800';
      case 'bodyshop': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMaintenances = mockMaintenances.filter(maintenance => {
    const matchesSearch = 
      maintenance.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.vehicle_internal_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.mechanic_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || maintenance.maintenance_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por veículo, código ou mecânico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="preventive">🛠️ Preventiva</SelectItem>
            <SelectItem value="corrective">🔧 Corretiva</SelectItem>
            <SelectItem value="bodyshop">🧽 Bodyshop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Manutenções */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMaintenances.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhuma manutenção encontrada
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Cadastre a primeira manutenção para começar'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMaintenances.map((maintenance) => (
            <Card key={maintenance.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onEdit(maintenance)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-revenshop-primary" />
                    <span className="text-revenshop-primary font-bold">
                      {maintenance.vehicle_internal_code}
                    </span>
                    <span>- {maintenance.vehicle_name}</span>
                  </CardTitle>
                  <Badge className={getMaintenanceTypeBadge(maintenance.maintenance_type)}>
                    {getMaintenanceTypeLabel(maintenance.maintenance_type)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Detecção:</span>
                      <span className="font-medium">
                        {format(new Date(maintenance.detection_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Reparo:</span>
                      <span className="font-medium">
                        {format(new Date(maintenance.repair_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Mecânico:</span>
                      <span className="font-medium">{maintenance.mechanic_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{maintenance.mechanic_phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-revenshop-primary text-lg">
                        R$ {maintenance.total_amount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
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
          ))
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;
