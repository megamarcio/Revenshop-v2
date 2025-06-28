import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Receipt, Search, Upload, Settings } from 'lucide-react';
import TollReconciliation from './TollReconciliation';
import TollImport from './TollImport';
import TollHistory from './TollHistory';

const TollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reconciliation');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedágios</h1>
          <p className="text-muted-foreground">
            Gerencie e concilie os registros de pedágios dos veículos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Receipt className="h-3 w-3" />
            Sistema de Conciliação
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reconciliation" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Conciliação
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importar CSV
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Conciliação de Pedágios
              </CardTitle>
              <CardDescription>
                Busque e concilie pedágios por veículo, placa ou número da tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TollReconciliation />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importar Dados de Pedágio
              </CardTitle>
              <CardDescription>
                Importe registros de pedágio através de arquivo CSV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TollImport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Histórico de Pedágios
              </CardTitle>
              <CardDescription>
                Visualize todos os registros de pedágios importados e conciliados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TollHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TollManagement; 