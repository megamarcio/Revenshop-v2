import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle, CheckCircle, Clock, Download, Sun, Zap } from 'lucide-react';
import { useTollManagement, CSVTollRecord } from '@/hooks/useTollManagement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos de formato de importação
type ImportFormat = 'generic' | 'sunpass' | 'epass';

interface ImportFormatConfig {
  id: ImportFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
  website?: string;
  status: 'active' | 'coming_soon';
}

const IMPORT_FORMATS: ImportFormatConfig[] = [
  {
    id: 'generic',
    name: 'Formato Genérico',
    description: 'Formato padrão CSV com colunas básicas',
    icon: <FileText className="h-4 w-4" />,
    status: 'active'
  },
  {
    id: 'sunpass',
    name: 'SunPass',
    description: 'Formato oficial do SunPass da Flórida',
    icon: <Sun className="h-4 w-4" />,
    website: 'http://www.sunpass.com/',
    status: 'active'
  },
  {
    id: 'epass',
    name: 'E-Pass',
    description: 'Formato E-Pass (em breve)',
    icon: <Zap className="h-4 w-4" />,
    status: 'coming_soon'
  }
];

// Parser genérico para CSV
const parseGenericCSV = (csvText: string) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
  }
  
  return { data };
};

// Parser específico para SunPass
const parseSunPassCSV = (csvText: string) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split('\t').map(h => h.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      // SunPass usa separação por tab
      const values = lines[i].split('\t').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
  }
  
  return { data };
};

// Mapeamento de dados genérico
const mapGenericData = (data: Record<string, string>[]): CSVTollRecord[] => {
  return data.map((row: Record<string, string>) => ({
    vehicle_plate: row.placa || row.vehicle_plate || row.Placa || '',
    toll_tag: row.tag || row.toll_tag || row.Tag || row.numero_tag || '',
    toll_location: row.local || row.toll_location || row.Local || row.praca || '',
    toll_amount: parseFloat(row.valor || row.toll_amount || row.Valor || '0'),
    toll_date: row.data || row.toll_date || row.Data || row.data_hora || '',
    transaction_id: row.transacao || row.transaction_id || row.Transacao || '',
    operator_name: row.operadora || row.operator_name || row.Operadora || '',
    lane_number: row.pista || row.lane_number || row.Pista || '',
    vehicle_class: row.classe || row.vehicle_class || row.Classe || '',
    payment_method: row.pagamento || row.payment_method || row.Pagamento || '',
  }));
};

// Mapeamento específico para SunPass
const mapSunPassData = (data: Record<string, string>[]): CSVTollRecord[] => {
  return data.map((row: Record<string, string>) => {
    // Combinar data e hora da transação
    const transactionDate = row['TRANSACTION DATE'] || '';
    const transactionTime = row['TRANSACTION TIME'] || '';
    const fullDateTime = transactionDate && transactionTime ? 
      `${transactionDate} ${transactionTime}` : transactionDate;

    // Extrair placa do campo TRANSPONDER/LICENSE PLATE
    const transponderField = row['TRANSPONDER/LICENSE PLATE'] || '';
    const plateMatch = transponderField.match(/([A-Z0-9]{3,8})/);
    const extractedPlate = plateMatch ? plateMatch[1] : '';

    // Valor do débito (valor positivo)
    const debitValue = row['DEBIT(-)'] || '0';
    const amount = parseFloat(debitValue.replace('$', '').replace(',', '')) || 0;

    return {
      vehicle_plate: extractedPlate,
      toll_tag: transponderField,
      toll_location: row['DESCRIPTION / PLAZA NAME'] || '',
      toll_amount: amount,
      toll_date: fullDateTime,
      transaction_id: row['TRANSACTION NUMBER'] || '',
      operator_name: row['AGENCY NAME'] || 'SunPass',
      lane_number: row['LANE'] || '',
      vehicle_class: row['AXLE'] ? `${row['AXLE']} eixos` : '',
      payment_method: 'TAG',
    };
  });
};

const TollImport: React.FC = () => {
  const [csvData, setCsvData] = useState<CSVTollRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<ImportFormat>('generic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importTollRecords, useTollImports } = useTollManagement();
  const { data: imports = [] } = useTollImports();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Por favor, selecione um arquivo CSV.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        let results;
        let mappedData: CSVTollRecord[];

        // Processar baseado no formato selecionado
        switch (selectedFormat) {
          case 'sunpass':
            results = parseSunPassCSV(csvText);
            mappedData = mapSunPassData(results.data);
            break;
          case 'epass':
            // TODO: Implementar parser E-Pass quando disponível
            alert('Formato E-Pass ainda não está disponível. Em breve!');
            setIsProcessing(false);
            return;
          default:
            results = parseGenericCSV(csvText);
            mappedData = mapGenericData(results.data);
            break;
        }

        setCsvData(mappedData);
        setUploadProgress(100);
      } catch (error) {
        console.error('Erro ao processar CSV:', error);
        alert('Erro ao processar o arquivo CSV. Verifique o formato.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      alert('Erro ao ler o arquivo CSV.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (csvData.length === 0) return;

    try {
      await importTollRecords.mutateAsync({
        filename: `${selectedFormat.toUpperCase()}_${fileName}`,
        records: csvData,
      });
      
      // Limpar dados após importação
      setCsvData([]);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro na importação:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Concluído
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Processando
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Falhou
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
    }
  };

  const downloadTemplate = () => {
    let template = '';
    let filename = '';

    switch (selectedFormat) {
      case 'sunpass':
        template = `POSTED DATE	TRANSACTION DATE	TRANSACTION TIME	TRANSACTION NUMBER	TRANSPONDER/LICENSE PLATE	AGENCY NAME	LANE	AXLE	DESCRIPTION / PLAZA NAME	DEBIT(-)	CREDIT(+)	BALANCE
6/22/2025	6/22/2025	3:16:01 PM	4508309810	1.29143E+11 Florida Turnpike Enterprise	60S	2	SR91 THREE LAKES MAIN SB MP236	$4.13	$106.80
6/22/2025	6/22/2025	2:16:34 PM	4508250508	7514690110 Florida Turnpike Enterprise	10	2	SR417 OSCEOLA PKWY NB MP7	$0.56	$110.93
6/22/2025	6/22/2025	1:49:30 PM	4508250681	6073931010 Florida Turnpike Enterprise	2S	2	SR528 BCHLINE WEST MAIN WB MP6	$2.17	$111.51`;
        filename = 'template_sunpass.csv';
        break;
      case 'epass':
        template = `# E-Pass template - Em breve`;
        filename = 'template_epass.csv';
        break;
      default:
        template = `placa,tag,local,valor,data,transacao,operadora,pista,classe,pagamento
ABC-1234,TAG123456,Praça de Pedágio SP-001,12.50,2024-01-15 14:30:00,TXN789,AutoBAn,01,Categoria 1,TAG`;
        filename = 'template_generico.csv';
        break;
    }

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormatInfo = () => {
    const format = IMPORT_FORMATS.find(f => f.id === selectedFormat);
    if (!format) return null;

    switch (selectedFormat) {
      case 'sunpass':
        return (
          <Alert>
            <Sun className="h-4 w-4" />
            <AlertDescription>
              <strong>Formato SunPass:</strong> Arquivo de extrato do SunPass com separação por TAB. 
              Colunas esperadas: POSTED DATE, TRANSACTION DATE, TRANSACTION TIME, TRANSACTION NUMBER, 
              TRANSPONDER/LICENSE PLATE, AGENCY NAME, LANE, AXLE, DESCRIPTION / PLAZA NAME, DEBIT(-), CREDIT(+), BALANCE.
              {format.website && (
                <a href={format.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                  Acessar {format.name}
                </a>
              )}
            </AlertDescription>
          </Alert>
        );
      case 'epass':
        return (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Formato E-Pass:</strong> Em breve! Este formato ainda está sendo desenvolvido.
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Formato Genérico:</strong> O arquivo CSV deve conter as colunas: placa, tag, local, valor, data, transacao, operadora, pista, classe, pagamento.
              Use o template como exemplo.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Formato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Formato de Importação
          </CardTitle>
          <CardDescription>
            Selecione o formato do arquivo que você deseja importar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {IMPORT_FORMATS.map((format) => (
              <Card 
                key={format.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFormat === format.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : format.status === 'coming_soon' 
                      ? 'opacity-60 cursor-not-allowed' 
                      : ''
                }`}
                onClick={() => format.status === 'active' && setSelectedFormat(format.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {format.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{format.name}</h3>
                        {format.status === 'coming_soon' && (
                          <Badge variant="secondary" className="text-xs">
                            Em Breve
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format.description}
                      </p>
                      {format.website && selectedFormat === format.id && (
                        <a 
                          href={format.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                        >
                          Acessar site oficial →
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getFormatInfo()}
        </CardContent>
      </Card>

      {/* Upload de Arquivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload de Arquivo CSV
          </CardTitle>
          <CardDescription>
            Importe registros de pedágio no formato {IMPORT_FORMATS.find(f => f.id === selectedFormat)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="csv-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Apenas arquivos CSV (MAX. 10MB)
                </p>
              </div>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processando arquivo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={downloadTemplate} 
              className="flex items-center gap-2"
              disabled={selectedFormat === 'epass'}
            >
              <Download className="h-4 w-4" />
              Baixar Template {IMPORT_FORMATS.find(f => f.id === selectedFormat)?.name}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview dos Dados */}
      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Preview dos Dados ({csvData.length} registros)
            </CardTitle>
            <CardDescription>
              Arquivo: {fileName} - Formato: {IMPORT_FORMATS.find(f => f.id === selectedFormat)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Transação</TableHead>
                    <TableHead>Operadora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(0, 10).map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{record.vehicle_plate || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="max-w-32 truncate" title={record.toll_tag}>
                        {record.toll_tag || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-40 truncate" title={record.toll_location}>
                        {record.toll_location || 'N/A'}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {formatCurrency(record.toll_amount)}
                      </TableCell>
                      <TableCell>{formatDate(record.toll_date)}</TableCell>
                      <TableCell>{record.transaction_id || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {record.operator_name || 'N/A'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {csvData.length > 10 && (
              <p className="text-sm text-muted-foreground mt-2">
                Mostrando 10 de {csvData.length} registros
              </p>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Formato selecionado: <strong>{IMPORT_FORMATS.find(f => f.id === selectedFormat)?.name}</strong>
              </div>
              <Button
                onClick={handleImport}
                disabled={importTollRecords.isPending}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {importTollRecords.isPending ? 'Importando...' : 'Importar Registros'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Importações */}
      {imports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico de Importações
            </CardTitle>
            <CardDescription>
              Últimas importações realizadas com diferentes formatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Processados</TableHead>
                    <TableHead>Falharam</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imports.map((importRecord) => (
                    <TableRow key={importRecord.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{importRecord.filename}</span>
                          {importRecord.filename.includes('SUNPASS_') && (
                            <Badge variant="outline" className="w-fit mt-1">
                              <Sun className="h-3 w-3 mr-1" />
                              SunPass
                            </Badge>
                          )}
                          {importRecord.filename.includes('EPASS_') && (
                            <Badge variant="outline" className="w-fit mt-1">
                              <Zap className="h-3 w-3 mr-1" />
                              E-Pass
                            </Badge>
                          )}
                          {!importRecord.filename.includes('SUNPASS_') && !importRecord.filename.includes('EPASS_') && (
                            <Badge variant="outline" className="w-fit mt-1">
                              <FileText className="h-3 w-3 mr-1" />
                              Genérico
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(importRecord.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {importRecord.total_records}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          {importRecord.processed_records}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {importRecord.failed_records > 0 ? (
                          <Badge variant="destructive">
                            {importRecord.failed_records}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(importRecord.import_status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TollImport; 