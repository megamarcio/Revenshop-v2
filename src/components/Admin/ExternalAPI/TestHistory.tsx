import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Download,
  Brain,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ExternalAPI, ExternalAPITestHistory } from '@/types/externalApi';

interface TestHistoryProps {
  api: ExternalAPI;
  history: ExternalAPITestHistory[];
  onClose: () => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({ api, history = [], onClose }) => {
  // Verificação defensiva para api
  if (!api) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Histórico de Testes</h2>
            <p className="text-muted-foreground">API não encontrada</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Erro ao carregar API</h3>
            <p className="text-muted-foreground">
              Não foi possível carregar as informações da API selecionada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const safeHistory = Array.isArray(history) ? history : [];
  const [selectedTest, setSelectedTest] = useState<ExternalAPITestHistory | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'Conteúdo copiado para a área de transferência!'
    });
  };

  const downloadTestData = (test: ExternalAPITestHistory) => {
    const data = {
      api: api?.name || 'API Desconhecida',
      test_date: test.created_at,
      url: test.request_url,
      method: test.request_method,
      status: test.response_status,
      success: test.is_success,
      response_time: test.response_time_ms,
      headers: test.request_headers,
      body: test.request_body,
      response: test.response_body,
      error: test.error_message,
      ai_analysis: test.ai_analysis,
      ai_suggestions: test.ai_suggestions,
      curl_command: test.curl_command
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-${api?.name || 'api'}-${new Date(test.created_at).toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (test: ExternalAPITestHistory) => {
    if (test.is_success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (test.response_status >= 400 && test.response_status < 500) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (test: ExternalAPITestHistory) => {
    if (test.is_success) {
      return <Badge variant="default" className="bg-green-500">Sucesso</Badge>;
    } else if (test.response_status >= 400 && test.response_status < 500) {
      return <Badge variant="secondary" className="bg-yellow-500">Erro Cliente</Badge>;
    } else {
      return <Badge variant="destructive">Erro Servidor</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const successfulTests = safeHistory.filter(test => test.is_success);
  const failedTests = safeHistory.filter(test => !test.is_success);
  const testsWithAI = safeHistory.filter(test => test.ai_analysis);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Testes</h2>
          <p className="text-muted-foreground">
            {api?.name || 'API Desconhecida'} - {safeHistory.length} testes realizados
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{safeHistory.length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sucessos</p>
                <p className="text-2xl font-bold text-green-600">{successfulTests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Falhas</p>
                <p className="text-2xl font-bold text-red-600">{failedTests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Análises IA</p>
                <p className="text-2xl font-bold text-blue-600">{testsWithAI.length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Testes */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({safeHistory.length})</TabsTrigger>
          <TabsTrigger value="success">Sucessos ({successfulTests.length})</TabsTrigger>
          <TabsTrigger value="failed">Falhas ({failedTests.length})</TabsTrigger>
          <TabsTrigger value="ai">Com IA ({testsWithAI.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {safeHistory.map((test) => (
            <TestHistoryItem
              key={test.id}
              test={test}
              api={api}
              onSelect={setSelectedTest}
              onCopy={copyToClipboard}
              onDownload={downloadTestData}
              getStatusIcon={getStatusIcon}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="success" className="space-y-4">
          {successfulTests.map((test) => (
            <TestHistoryItem
              key={test.id}
              test={test}
              api={api}
              onSelect={setSelectedTest}
              onCopy={copyToClipboard}
              onDownload={downloadTestData}
              getStatusIcon={getStatusIcon}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          {failedTests.map((test) => (
            <TestHistoryItem
              key={test.id}
              test={test}
              api={api}
              onSelect={setSelectedTest}
              onCopy={copyToClipboard}
              onDownload={downloadTestData}
              getStatusIcon={getStatusIcon}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          {testsWithAI.map((test) => (
            <TestHistoryItem
              key={test.id}
              test={test}
              api={api}
              onSelect={setSelectedTest}
              onCopy={copyToClipboard}
              onDownload={downloadTestData}
              getStatusIcon={getStatusIcon}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      {selectedTest && (
        <TestDetailsModal
          test={selectedTest}
          api={api}
          onClose={() => setSelectedTest(null)}
          onCopy={copyToClipboard}
          onDownload={downloadTestData}
        />
      )}
    </div>
  );
};

// Componente de Item do Histórico
interface TestHistoryItemProps {
  test: ExternalAPITestHistory;
  api: ExternalAPI;
  onSelect: (test: ExternalAPITestHistory) => void;
  onCopy: (text: string) => void;
  onDownload: (test: ExternalAPITestHistory) => void;
  getStatusIcon: (test: ExternalAPITestHistory) => React.ReactNode;
  getStatusBadge: (test: ExternalAPITestHistory) => React.ReactNode;
  formatDate: (date: string) => string;
}

const TestHistoryItem: React.FC<TestHistoryItemProps> = ({
  test,
  api,
  onSelect,
  onCopy,
  onDownload,
  getStatusIcon,
  getStatusBadge,
  formatDate
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(test)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(test)}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{test.request_method}</span>
                <span className="text-sm text-muted-foreground font-mono">{test.request_url}</span>
                {getStatusBadge(test)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatDate(test.created_at)}</span>
                <span>{test.response_time_ms}ms</span>
                <span>Status: {test.response_status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {test.ai_analysis && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                IA
              </Badge>
            )}
            {test.curl_command && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(test.curl_command!);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(test);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Modal de Detalhes do Teste
interface TestDetailsModalProps {
  test: ExternalAPITestHistory;
  api: ExternalAPI;
  onClose: () => void;
  onCopy: (text: string) => void;
  onDownload: (test: ExternalAPITestHistory) => void;
}

const TestDetailsModal: React.FC<TestDetailsModalProps> = ({
  test,
  api,
  onClose,
  onCopy,
  onDownload
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detalhes do Teste</h3>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Informações do Teste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Método:</span> {test.request_method}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {test.response_status}
                </div>
                <div>
                  <span className="font-medium">Tempo de Resposta:</span> {test.response_time_ms}ms
                </div>
                <div>
                  <span className="font-medium">Sucesso:</span> {test.is_success ? 'Sim' : 'Não'}
                </div>
              </div>
              <div>
                <span className="font-medium">URL:</span>
                <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{test.request_url}</p>
              </div>
            </CardContent>
          </Card>

          {/* Headers */}
          {test.request_headers && Object.keys(test.request_headers).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Headers da Requisição</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {JSON.stringify(test.request_headers, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Body da Requisição */}
          {test.request_body && (
            <Card>
              <CardHeader>
                <CardTitle>Body da Requisição</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {test.request_body}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Resposta */}
          <Card>
            <CardHeader>
              <CardTitle>Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-x-auto max-h-64">
                {test.response_body}
              </pre>
            </CardContent>
          </Card>

          {/* Análise de IA */}
          {test.ai_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Análise de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Análise:</h4>
                  <p className="text-sm bg-muted p-3 rounded">{test.ai_analysis}</p>
                </div>
                
                {test.ai_suggestions && (
                  <div>
                    <h4 className="font-medium mb-2">Sugestões:</h4>
                    <ul className="text-sm space-y-1">
                      {test.ai_suggestions.split('\n').map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Comando cURL */}
          {test.curl_command && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Comando cURL
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(test.curl_command!)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {test.curl_command}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onDownload(test)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar JSON
            </Button>
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 