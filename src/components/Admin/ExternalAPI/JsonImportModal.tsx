import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { JsonImportData } from '@/types/externalApi';

interface JsonImportModalProps {
  onImport: (data: JsonImportData) => void;
  children: React.ReactNode;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({ onImport, children }) => {
  const [open, setOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [parsedData, setParsedData] = useState<JsonImportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseJsonContent = (content: string): JsonImportData => {
    try {
      const data = JSON.parse(content);
      
      // Validar estrutura mínima
      if (!data.name || !data.base_url) {
        throw new Error('JSON deve conter "name" e "base_url"');
      }

      // Validar endpoints se existirem
      if (data.endpoints && !Array.isArray(data.endpoints)) {
        throw new Error('Campo "endpoints" deve ser um array');
      }

      return {
        name: data.name,
        description: data.description || '',
        base_url: data.base_url,
        endpoints: data.endpoints || []
      };
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error('JSON inválido');
      }
      throw err;
    }
  };

  const handleParse = () => {
    if (!jsonContent.trim()) {
      setError('Digite um JSON válido');
      return;
    }

    try {
      const data = parseJsonContent(jsonContent);
      setParsedData(data);
      setError(null);
      toast({
        title: 'Sucesso',
        description: 'JSON analisado com sucesso!'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar JSON';
      setError(errorMessage);
      setParsedData(null);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleImport = () => {
    if (!parsedData) {
      setError('Nenhum dado válido para importar');
      return;
    }

    onImport(parsedData);
    setOpen(false);
    setJsonContent('');
    setParsedData(null);
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonContent(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'JSON copiado para a área de transferência!'
    });
  };

  const generateSampleJson = (): string => {
    return JSON.stringify({
      name: "API Exemplo",
      description: "Descrição da API",
      base_url: "https://api.exemplo.com/v1",
      endpoints: [
        {
          name: "Listar Usuários",
          path: "/users",
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        },
        {
          name: "Criar Usuário",
          path: "/users",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      ]
    }, null, 2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar API via JSON
          </DialogTitle>
          <DialogDescription>
            Cole um JSON ou faça upload de um arquivo para importar a configuração da API
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input do JSON */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração JSON</CardTitle>
              <CardDescription>
                Cole aqui o JSON da configuração da API ou faça upload de um arquivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setJsonContent(generateSampleJson())}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exemplo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Arquivo
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <Textarea
                placeholder="Cole aqui o JSON da configuração da API..."
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleParse} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Analisar JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setJsonContent('')}
                  disabled={!jsonContent}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Dados analisados */}
          {parsedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Dados Analisados
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar JSON
                  </Button>
                </CardTitle>
                <CardDescription>
                  Confirme os dados extraídos do JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nome */}
                <div>
                  <Label>Nome da API</Label>
                  <Input value={parsedData.name} readOnly />
                </div>

                {/* Descrição */}
                {parsedData.description && (
                  <div>
                    <Label>Descrição</Label>
                    <Input value={parsedData.description} readOnly />
                  </div>
                )}

                {/* URL Base */}
                <div>
                  <Label>URL Base</Label>
                  <Input value={parsedData.base_url} readOnly className="font-mono text-sm" />
                </div>

                {/* Endpoints */}
                {parsedData.endpoints.length > 0 && (
                  <div>
                    <Label>Endpoints ({parsedData.endpoints.length})</Label>
                    <div className="space-y-2">
                      {parsedData.endpoints.map((endpoint, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{endpoint.method}</Badge>
                            <span className="font-medium">{endpoint.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {endpoint.path}
                          </div>
                          {endpoint.headers && Object.keys(endpoint.headers).length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Headers: {Object.keys(endpoint.headers).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botão de importar */}
                <Button onClick={handleImport} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar API
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 