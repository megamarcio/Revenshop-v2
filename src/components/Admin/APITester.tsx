import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Users, 
  Car, 
  Calendar, 
  Wrench, 
  MessageCircle, 
  Copy, 
  Play,
  ExternalLink,
  Code
} from 'lucide-react';
import { useRevenshopAPI } from '@/api/rest-api';
import { useToast } from '@/hooks/use-toast';

const APITester = () => {
  const { api, handleError } = useRevenshopAPI();
  const { toast } = useToast();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [customParams, setCustomParams] = useState('');

  const handleApiCall = async (apiCall: () => Promise<any>, description: string) => {
    setLoading(true);
    try {
      const result = await apiCall();
      setResults({ description, data: result, timestamp: new Date().toISOString() });
      toast({
        title: "Sucesso",
        description: `${description} executado com sucesso!`,
      });
    } catch (error) {
      handleError(error as Error);
      setResults({ description, error: (error as Error).message, timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  const generateN8NExample = (endpoint: string, method: string = 'GET') => {
    return `// N8N HTTP Request Node Configuration
{
  "method": "${method}",
  "url": "https://seu-dominio.com/api${endpoint}",
  "headers": {
    "Authorization": "Bearer {{ $json.apiKey }}",
    "Content-Type": "application/json"
  }
}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Testador de API REST
          </CardTitle>
          <CardDescription>
            Teste as funcionalidades da API e veja exemplos de integração com N8N
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vehicles" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Veículos
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Manutenção
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Custom
              </TabsTrigger>
            </TabsList>

            {/* VEÍCULOS */}
            <TabsContent value="vehicles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Buscar Veículos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.getVehicles({ limit: 5 }),
                        'Buscar veículos (limite 5)'
                      )}
                      disabled={loading}
                      className="w-full"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Buscar Veículos
                    </Button>
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.getVehicles({ status: 'forSale', limit: 3 }),
                        'Buscar veículos à venda'
                      )}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      Veículos à Venda
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Buscar por ID</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input 
                      placeholder="ID do veículo"
                      onChange={(e) => setCustomQuery(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.getVehicleById(customQuery),
                        `Buscar veículo ID: ${customQuery}`
                      )}
                      disabled={loading || !customQuery}
                      className="w-full"
                    >
                      Buscar por ID
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Exemplo N8N - Veículos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    <pre>{generateN8NExample('/vehicles?limit=10&status=forSale')}</pre>
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(generateN8NExample('/vehicles?limit=10&status=forSale'))}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Configuração
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CLIENTES */}
            <TabsContent value="customers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Buscar Clientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.getCustomers({ limit: 5 }),
                        'Buscar clientes (limite 5)'
                      )}
                      disabled={loading}
                      className="w-full"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Buscar Clientes
                    </Button>
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.searchCustomers(customQuery),
                        `Buscar clientes: ${customQuery}`
                      )}
                      disabled={loading || !customQuery}
                      variant="outline"
                      className="w-full"
                    >
                      Buscar por Nome/Email
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Buscar por ID</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input 
                      placeholder="ID do cliente"
                      onChange={(e) => setCustomQuery(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.getCustomerById(customQuery),
                        `Buscar cliente ID: ${customQuery}`
                      )}
                      disabled={loading || !customQuery}
                      className="w-full"
                    >
                      Buscar por ID
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* RESERVAS */}
            <TabsContent value="reservations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Buscar Reservas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => handleApiCall(
                      () => api.getReservations({ limit: 5 }),
                      'Buscar reservas (limite 5)'
                    )}
                    disabled={loading}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Buscar Reservas
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* MANUTENÇÃO */}
            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Buscar Manutenções</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => handleApiCall(
                      () => api.getMaintenanceRecords({ limit: 5 }),
                      'Buscar manutenções (limite 5)'
                    )}
                    disabled={loading}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Buscar Manutenções
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WHATSAPP */}
            <TabsContent value="whatsapp" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Grupos WhatsApp</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.getWhatsAppGroups(),
                        'Buscar grupos WhatsApp'
                      )}
                      disabled={loading}
                      className="w-full"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Buscar Grupos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Enviar Mensagem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input 
                      placeholder="Número de telefone"
                      onChange={(e) => setCustomQuery(e.target.value)}
                    />
                    <Textarea 
                      placeholder="Mensagem personalizada"
                      onChange={(e) => setCustomParams(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleApiCall(
                        () => api.sendWhatsAppMessage({
                          type: 'custom_message',
                          recipient: { phone: customQuery },
                          message: customParams
                        }),
                        'Enviar mensagem WhatsApp'
                      )}
                      disabled={loading || !customQuery || !customParams}
                      className="w-full"
                    >
                      Enviar Mensagem
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CUSTOM */}
            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estatísticas do Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => handleApiCall(
                      () => api.getDashboardStats(),
                      'Buscar estatísticas'
                    )}
                    disabled={loading}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Buscar Estatísticas
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* RESULTADOS */}
          {results && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Resultado: {results.description}</span>
                  <Badge variant={results.error ? "destructive" : "default"}>
                    {results.error ? "Erro" : "Sucesso"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {results.timestamp}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-96 overflow-auto">
                  <pre>{JSON.stringify(results.error || results.data, null, 2)}</pre>
                </div>
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(results.error || results.data, null, 2))}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Resultado
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* DOCUMENTAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Documentação da API
          </CardTitle>
          <CardDescription>
            Como integrar com N8N e outros sistemas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Endpoints Principais</h4>
              <ul className="text-sm space-y-1">
                <li><code>GET /vehicles</code> - Listar veículos</li>
                <li><code>GET /vehicles/:id</code> - Buscar veículo por ID</li>
                <li><code>GET /customers</code> - Listar clientes</li>
                <li><code>GET /reservations</code> - Listar reservas</li>
                <li><code>GET /maintenance</code> - Listar manutenções</li>
                <li><code>POST /whatsapp/send</code> - Enviar mensagem</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Parâmetros Comuns</h4>
              <ul className="text-sm space-y-1">
                <li><code>limit</code> - Limite de resultados</li>
                <li><code>offset</code> - Paginação</li>
                <li><code>status</code> - Filtrar por status</li>
                <li><code>q</code> - Busca textual</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Dica para N8N</h4>
            <p className="text-sm text-blue-700">
              Use o node "HTTP Request" no N8N para conectar com esta API. 
              Configure a autenticação via header <code>Authorization: Bearer YOUR_API_KEY</code>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APITester; 