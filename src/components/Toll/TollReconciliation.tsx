import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Car, Calendar, Tag, MapPin, DollarSign, CheckCircle, Clock, Receipt } from 'lucide-react';
import { useTollManagement, TollFilters } from '@/hooks/useTollManagement';
import { useVehicles } from '@/hooks/useVehicles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TollReconciliation: React.FC = () => {
  const [filters, setFilters] = useState<TollFilters>({});
  const [searchMethod, setSearchMethod] = useState<'vehicle' | 'plate' | 'tag'>('vehicle');
  const [manualPlate, setManualPlate] = useState('');
  const [manualTag, setManualTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { vehicles } = useVehicles();
  const { useTollRecords, reconcileTollRecord } = useTollManagement();
  const { data: tollRecords = [], isLoading, refetch } = useTollRecords(filters);

  const handleSearch = () => {
    const newFilters: TollFilters = {};

    if (searchMethod === 'vehicle' && filters.vehicle_id) {
      newFilters.vehicle_id = filters.vehicle_id;
    } else if (searchMethod === 'plate' && manualPlate) {
      newFilters.vehicle_plate = manualPlate;
    } else if (searchMethod === 'tag' && manualTag) {
      newFilters.toll_tag = manualTag;
    }

    if (startDate) {
      newFilters.start_date = startDate;
    }
    if (endDate) {
      newFilters.end_date = endDate;
    }

    setFilters(newFilters);
  };

  const handleReconcile = async (recordId: string) => {
    try {
      await reconcileTollRecord.mutateAsync(recordId);
      refetch();
    } catch (error) {
      console.error('Erro ao conciliar:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getSelectedVehicle = () => {
    if (searchMethod === 'vehicle' && filters.vehicle_id) {
      return vehicles.find(v => v.id === filters.vehicle_id);
    }
    return null;
  };

  const selectedVehicle = getSelectedVehicle();

  return (
    <div className="space-y-6">
      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtros de Busca
          </CardTitle>
          <CardDescription>
            Selecione os critérios para buscar registros de pedágio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Método de Busca */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Método de Busca</Label>
              <Select value={searchMethod} onValueChange={(value: 'vehicle' | 'plate' | 'tag') => setSearchMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicle">Por Veículo</SelectItem>
                  <SelectItem value="plate">Por Placa</SelectItem>
                  <SelectItem value="tag">Por Tag</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo de Busca Dinâmico */}
            {searchMethod === 'vehicle' && (
              <div>
                <Label>Veículo</Label>
                <Select value={filters.vehicle_id || ''} onValueChange={(value) => setFilters({ ...filters, vehicle_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          <span>{vehicle.name}</span>
                          <Badge variant="outline">{vehicle.plate}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {searchMethod === 'plate' && (
              <div>
                <Label>Placa do Veículo</Label>
                <Input
                  placeholder="Ex: ABC-1234"
                  value={manualPlate}
                  onChange={(e) => setManualPlate(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {searchMethod === 'tag' && (
              <div>
                <Label>Número da Tag</Label>
                <Input
                  placeholder="Ex: TAG123456"
                  value={manualTag}
                  onChange={(e) => setManualTag(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data Inicial</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Data Final</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Botão de Busca */}
          <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Buscando...' : 'Buscar Pedágios'}
          </Button>
        </CardContent>
      </Card>

      {/* Informações do Veículo Selecionado */}
      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Veículo Selecionado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Nome</Label>
                <p className="font-medium">{selectedVehicle.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Placa</Label>
                <Badge variant="outline">{selectedVehicle.plate}</Badge>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Código Interno</Label>
                <p className="text-sm">{selectedVehicle.internal_code}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {tollRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Registros de Pedágio ({tollRecords.length})
            </CardTitle>
            <CardDescription>
              Registros encontrados com base nos filtros aplicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tollRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(record.toll_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {record.vehicle ? (
                            <>
                              <div className="font-medium">{record.vehicle.name}</div>
                              <Badge variant="outline" className="text-xs">
                                {record.vehicle.plate}
                              </Badge>
                            </>
                          ) : (
                            <div className="text-muted-foreground">
                              {record.vehicle_plate || 'Não identificado'}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{record.toll_location || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            {formatCurrency(record.toll_amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.toll_tag ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {record.toll_tag}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.is_reconciled ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Conciliado
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!record.is_reconciled && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReconcile(record.id)}
                            disabled={reconcileTollRecord.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Conciliar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {tollRecords.length === 0 && !isLoading && Object.keys(filters).length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum registro encontrado</h3>
            <p className="text-muted-foreground text-center">
              Não foram encontrados registros de pedágio com os filtros aplicados.
              <br />
              Tente ajustar os critérios de busca.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TollReconciliation; 