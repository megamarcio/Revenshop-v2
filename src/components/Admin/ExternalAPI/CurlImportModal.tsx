import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CurlImportData } from '@/types/externalApi';

interface CurlImportModalProps {
  onImport: (data: CurlImportData) => void;
  children: React.ReactNode;
}

export const CurlImportModal: React.FC<CurlImportModalProps> = ({ onImport, children }) => {
  const [open, setOpen] = useState(false);
  const [curlCommand, setCurlCommand] = useState('');
  const [parsedData, setParsedData] = useState<CurlImportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseCurlCommand = (command: string): CurlImportData | null => {
    try {
      // Remover quebras de linha e espaços extras
      const cleanCommand = command.replace(/\s+/g, ' ').trim();
      
      // Verificar se é um comando cURL válido
      if (!cleanCommand.startsWith('curl')) {
        throw new Error('Comando deve começar com "curl"');
      }

      // Extrair URL
      const urlMatch = cleanCommand.match(/"([^"]+)"/);
      if (!urlMatch) {
        throw new Error('URL não encontrada no comando cURL');
      }
      const url = urlMatch[1];

      // Extrair método HTTP
      const methodMatch = cleanCommand.match(/-X\s+(\w+)/);
      const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';

      // Extrair headers
      const headers: Record<string, string> = {};
      const headerMatches = cleanCommand.matchAll(/-H\s+"([^"]+):\s*([^"]+)"/g);
      for (const match of headerMatches) {
        headers[match[1]] = match[2];
      }

      // Extrair body
      const bodyMatch = cleanCommand.match(/-d\s+['"`]([^'"`]+)['"`]/);
      const body = bodyMatch ? bodyMatch[1] : undefined;

      return {
        url,
        method,
        headers,
        body
      };
    } catch (err) {
      throw new Error(`Erro ao analisar comando cURL: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const handleParse = () => {
    if (!curlCommand.trim()) {
      setError('Digite um comando cURL válido');
      return;
    }

    try {
      const data = parseCurlCommand(curlCommand);
      setParsedData(data);
      setError(null);
      toast({
        title: 'Sucesso',
        description: 'Comando cURL analisado com sucesso!'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar comando';
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
    console.log('handleImport chamado no CurlImportModal');
    if (!parsedData) {
      setError('Nenhum dado válido para importar');
      return;
    }

    console.log('Chamando onImport com:', parsedData);
    onImport(parsedData);
    setOpen(false);
    setCurlCommand('');
    setParsedData(null);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'Comando copiado para a área de transferência!'
    });
  };

  const generateCurlFromData = (data: CurlImportData): string => {
    let curl = 'curl';
    
    if (data.method !== 'GET') {
      curl += ` -X ${data.method}`;
    }
    
    curl += ` "${data.url}"`;
    
    Object.entries(data.headers).forEach(([name, value]) => {
      curl += ` -H "${name}: ${value}"`;
    });
    
    if (data.body) {
      curl += ` -d '${data.body}'`;
    }
    
    return curl;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar API via cURL
          </DialogTitle>
          <DialogDescription>
            Cole um comando cURL para importar automaticamente os dados da API
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input do comando cURL */}
          <Card>
            <CardHeader>
              <CardTitle>Comando cURL</CardTitle>
              <CardDescription>
                Cole aqui o comando cURL que você quer importar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Cole aqui o comando cURL..."
                value={curlCommand}
                onChange={(e) => setCurlCommand(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleParse} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Analisar cURL
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurlCommand('')}
                  disabled={!curlCommand}
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
                    onClick={() => copyToClipboard(generateCurlFromData(parsedData))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar cURL
                  </Button>
                </CardTitle>
                <CardDescription>
                  Confirme os dados extraídos do comando cURL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL */}
                <div>
                  <Label>URL</Label>
                  <Input value={parsedData.url} readOnly className="font-mono text-sm" />
                </div>

                {/* Método */}
                <div>
                  <Label>Método HTTP</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={parsedData.method === 'GET' ? 'default' : 'secondary'}>
                      {parsedData.method}
                    </Badge>
                  </div>
                </div>

                {/* Headers */}
                {Object.keys(parsedData.headers).length > 0 && (
                  <div>
                    <Label>Headers</Label>
                    <div className="space-y-2">
                      {Object.entries(parsedData.headers).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Badge variant="outline" className="text-xs">
                            {name}
                          </Badge>
                          <span className="text-sm font-mono flex-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body */}
                {parsedData.body && (
                  <div>
                    <Label>Body</Label>
                    <Textarea
                      value={parsedData.body}
                      readOnly
                      className="font-mono text-sm min-h-[80px]"
                    />
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