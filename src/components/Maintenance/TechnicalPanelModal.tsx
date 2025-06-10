
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings2, Droplets, Battery, Wind, Filter, Wrench, Target, Disc, Zap } from 'lucide-react';

interface TechnicalPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
}

const TechnicalPanelModal = ({ isOpen, onClose, vehicleId, vehicleName }: TechnicalPanelModalProps) => {
  // Mock data - em produção viria do banco de dados
  const technicalData = {
    oilEngine: { month: '10', year: '2024', miles: '45,230' },
    mainBattery: { month: '08', year: '2023' },
    auxBattery: { month: '08', year: '2023' },
    wiperBlades: { month: '06', year: '2024' },
    cabinFilter: { month: '05', year: '2024' },
    airFilter: { month: '05', year: '2024' },
    alternator: { month: '03', year: '2023', miles: '42,100' },
    alignment: { month: '09', year: '2024', miles: '44,800' },
    balancing: { month: '09', year: '2024', miles: '44,800' },
    coolant: { month: '07', year: '2024', miles: '43,500' },
    brakePads: { month: '04', year: '2024', miles: '43,000' },
    brakeDiscs: { month: '04', year: '2024', miles: '43,000' },
    transmissionOil: { month: '01', year: '2024', miles: '41,500' },
    tireFR: { month: '02', year: '2024' },
    tireFL: { month: '02', year: '2024' },
    tireRR: { month: '02', year: '2024' },
    tireRL: { month: '02', year: '2024' },
    tireType: '205/55 R16'
  };

  // Prevenir fechamento automático do modal pai
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        event.stopPropagation();
      };

      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const formatDate = (month: string, year: string) => `${month}/${year}`;
  const formatDateWithMiles = (month: string, year: string, miles: string) => `${month}/${year} - ${miles} mi`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[80vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-revenshop-primary" />
            Painel Técnico - {vehicleName || 'Veículo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Óleo do Motor - Em destaque */}
          <Card className="border-revenshop-primary border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-revenshop-primary">
                <Droplets className="h-5 w-5" />
                Óleo Motor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {formatDateWithMiles(technicalData.oilEngine.month, technicalData.oilEngine.year, technicalData.oilEngine.miles)}
              </div>
            </CardContent>
          </Card>

          {/* Sistema Elétrico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Sistema Elétrico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  <span>Bateria Principal:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{formatDate(technicalData.mainBattery.month, technicalData.mainBattery.year)}</span>
                  <Badge variant="secondary" className="text-xs">Duração média 2 a 3 anos</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  <span>Bateria Auxiliar:</span>
                </div>
                <span>{formatDate(technicalData.auxBattery.month, technicalData.auxBattery.year)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  <span>Alternador:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.alternator.month, technicalData.alternator.year, technicalData.alternator.miles)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Filtros e Limpeza */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros e Limpeza
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4" />
                  <span>Paleta Limpador:</span>
                </div>
                <span>{formatDate(technicalData.wiperBlades.month, technicalData.wiperBlades.year)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtro de Cabine:</span>
                </div>
                <span>{formatDate(technicalData.cabinFilter.month, technicalData.cabinFilter.year)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtro de Ar:</span>
                </div>
                <span>{formatDate(technicalData.airFilter.month, technicalData.airFilter.year)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Suspensão e Direção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Suspensão e Direção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Alinhamento:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.alignment.month, technicalData.alignment.year, technicalData.alignment.miles)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Balanceamento:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.balancing.month, technicalData.balancing.year, technicalData.balancing.miles)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sistema de Freios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc className="h-5 w-5" />
                Sistema de Freios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Disc className="h-4 w-4" />
                  <span>Pastilhas:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.brakePads.month, technicalData.brakePads.year, technicalData.brakePads.miles)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Disc className="h-4 w-4" />
                  <span>Disco de Freio:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.brakeDiscs.month, technicalData.brakeDiscs.year, technicalData.brakeDiscs.miles)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fluidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Fluidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  <span>Coolant:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.coolant.month, technicalData.coolant.year, technicalData.coolant.miles)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  <span>Óleo Transmissão:</span>
                </div>
                <span>{formatDateWithMiles(technicalData.transmissionOil.month, technicalData.transmissionOil.year, technicalData.transmissionOil.miles)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pneus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pneus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pneu FR (Front Right):</span>
                    <span>{formatDate(technicalData.tireFR.month, technicalData.tireFR.year)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pneu FL (Front Left):</span>
                    <span>{formatDate(technicalData.tireFL.month, technicalData.tireFL.year)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pneu RR (Rear Right):</span>
                    <span>{formatDate(technicalData.tireRR.month, technicalData.tireRR.year)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pneu RL (Rear Left):</span>
                    <span>{formatDate(technicalData.tireRL.month, technicalData.tireRL.year)}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tipo de Pneu:</span>
                  <Badge variant="outline" className="font-mono">{technicalData.tireType}</Badge>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p className="font-medium mb-1">Legenda do formato:</p>
                  <p><span className="font-semibold">205</span> = largura do pneu em milímetros</p>
                  <p><span className="font-semibold">55</span> = perfil (altura como % da largura)</p>
                  <p><span className="font-semibold">R16</span> = tipo radial e o aro (16 polegadas)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalPanelModal;
