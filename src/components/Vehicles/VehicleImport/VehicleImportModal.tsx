
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, AlertCircle, CheckCircle, FileDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useVehicles } from '../../../hooks/useVehicles';

interface VehicleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportError {
  linha: number;
  erro: string;
  dados?: any;
  timestamp: string;
}

const VehicleImportModal = ({ isOpen, onClose, onImportComplete }: VehicleImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [detailedErrors, setDetailedErrors] = useState<ImportError[]>([]);

  const { createVehicle } = useVehicles();

  // Função para validar e limitar valores numéricos
  const validateNumericField = (value: string, fieldName: string, maxDigits: number = 5, maxDecimals: number = 2): { isValid: boolean; cleanValue: number | null; error?: string } => {
    if (!value || value === '') {
      return { isValid: true, cleanValue: null };
    }

    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      return { 
        isValid: false, 
        cleanValue: null, 
        error: `Valor inválido para ${fieldName}: "${value}" não é um número` 
      };
    }

    // Verificar se o valor não excede os limites do banco
    const maxValue = Math.pow(10, maxDigits - maxDecimals) - 0.01;
    
    if (numericValue > maxValue) {
      return { 
        isValid: false, 
        cleanValue: null, 
        error: `Valor muito alto para ${fieldName}: ${numericValue}. Máximo permitido: ${maxValue}` 
      };
    }

    if (numericValue < 0) {
      return { 
        isValid: false, 
        cleanValue: null, 
        error: `Valor negativo não permitido para ${fieldName}: ${numericValue}` 
      };
    }

    // Arredondar para o número correto de casas decimais
    const roundedValue = Math.round(numericValue * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
    
    return { isValid: true, cleanValue: roundedValue };
  };

  const downloadTemplate = () => {
    const headers = [
      'name', 'vin', 'year', 'model', 'miles', 'internal_code', 'color',
      'purchase_price', 'sale_price', 'min_negotiable', 'carfax_price', 'mmr_value',
      'description', 'category', 'financing_bank', 'financing_type',
      'original_financed_name', 'purchase_date', 'due_date', 'installment_value',
      'down_payment', 'financed_amount', 'total_installments', 'paid_installments',
      'remaining_installments', 'total_to_pay', 'payoff_value', 'payoff_date',
      'interest_rate', 'custom_financing_bank'
    ];

    const exampleData = [
      'Honda Civic 2020',
      '1HGBH41JXMN109186',
      '2020',
      'Civic',
      '25000',
      'HC001',
      'Preto',
      '18000.00',
      '22000.00',
      '21000.00',
      '21500.00',
      '20500.00',
      'Veículo em excelente estado',
      'forSale',
      'Banco do Brasil',
      'assumiu-financiamento',
      'João Silva',
      '2023-01-15',
      '2025-12-15',
      '450.00',
      '3000.00',
      '15000.00',
      '36',
      '24',
      '12',
      '16200.00',
      '14500.00',
      '2024-06-30',
      '5.5',
      ''
    ];

    const csvContent = [headers, exampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_importacao_veiculos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadErrorLog = () => {
    if (detailedErrors.length === 0) return;

    const logContent = [
      '=== LOG DE ERROS - IMPORTAÇÃO DE VEÍCULOS ===',
      `Data/Hora: ${new Date().toLocaleString('pt-BR')}`,
      `Arquivo importado: ${file?.name || 'N/A'}`,
      `Total de erros: ${detailedErrors.length}`,
      '',
      '=== DETALHES DOS ERROS ===',
      ''
    ];

    detailedErrors.forEach((error, index) => {
      logContent.push(`ERRO #${index + 1}`);
      logContent.push(`Linha: ${error.linha}`);
      logContent.push(`Erro: ${error.erro}`);
      logContent.push(`Timestamp: ${error.timestamp}`);
      if (error.dados) {
        logContent.push(`Dados da linha: ${JSON.stringify(error.dados, null, 2)}`);
      }
      logContent.push('---');
      logContent.push('');
    });

    const logText = logContent.join('\n');
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `log_erros_importacao_${timestamp}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const vehicles = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const vehicle: any = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        // Mapear os campos para o formato correto com validação numérica
        switch (header) {
          case 'year':
          case 'miles':
          case 'total_installments':
          case 'paid_installments':
          case 'remaining_installments':
            const intValidation = validateNumericField(value, header, 10, 0); // Inteiros até 10 dígitos
            if (!intValidation.isValid) {
              vehicle[`${header}_error`] = intValidation.error;
            }
            vehicle[header] = intValidation.cleanValue || '';
            break;
          case 'purchase_price':
          case 'sale_price':
          case 'min_negotiable':
          case 'carfax_price':
          case 'mmr_value':
          case 'installment_value':
          case 'down_payment':
          case 'financed_amount':
          case 'total_to_pay':
          case 'payoff_value':
            const priceValidation = validateNumericField(value, header, 10, 2); // Até 10 dígitos, 2 decimais
            if (!priceValidation.isValid) {
              vehicle[`${header}_error`] = priceValidation.error;
            }
            vehicle[header] = priceValidation.cleanValue || '';
            break;
          case 'interest_rate':
            const rateValidation = validateNumericField(value, header, 5, 2); // Taxa de juros até 999.99%
            if (!rateValidation.isValid) {
              vehicle[`${header}_error`] = rateValidation.error;
            }
            vehicle[header] = rateValidation.cleanValue || '';
            break;
          default:
            vehicle[header] = value;
        }
      });

      vehicles.push(vehicle);
    }

    return vehicles;
  };

  const logError = (linha: number, erro: string, dados?: any) => {
    const errorLog: ImportError = {
      linha,
      erro,
      dados,
      timestamp: new Date().toISOString()
    };
    
    setDetailedErrors(prev => [...prev, errorLog]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType === 'csv' || fileType === 'xls' || fileType === 'xlsx') {
        setFile(selectedFile);
        setResults(null);
        setDetailedErrors([]); // Limpar erros anteriores
      } else {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione um arquivo CSV ou XLS.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setDetailedErrors([]); // Limpar erros anteriores
    const errors: string[] = [];
    let successCount = 0;

    try {
      const text = await file.text();
      const vehicles = parseCSV(text);

      if (vehicles.length === 0) {
        const errorMsg = 'Nenhum veículo válido encontrado no arquivo';
        logError(0, errorMsg);
        throw new Error(errorMsg);
      }

      for (let i = 0; i < vehicles.length; i++) {
        try {
          const vehicle = vehicles[i];
          const lineNumber = i + 2; // +2 porque começamos na linha 1 e pulamos o header
          
          // Verificar se há erros de validação numérica
          const fieldErrors = Object.keys(vehicle)
            .filter(key => key.endsWith('_error'))
            .map(key => vehicle[key]);
          
          if (fieldErrors.length > 0) {
            const errorMsg = `Erros de validação: ${fieldErrors.join('; ')}`;
            logError(lineNumber, errorMsg, vehicle);
            errors.push(`Linha ${lineNumber}: ${errorMsg}`);
            continue;
          }
          
          // Validar campos obrigatórios
          if (!vehicle.name || !vehicle.vin || !vehicle.year || !vehicle.model || 
              !vehicle.internal_code || !vehicle.color || !vehicle.purchase_price || !vehicle.sale_price) {
            const errorMsg = 'Campos obrigatórios em falta (name, vin, year, model, internal_code, color, purchase_price, sale_price)';
            logError(lineNumber, errorMsg, vehicle);
            errors.push(`Linha ${lineNumber}: ${errorMsg}`);
            continue;
          }

          // Mapear para o formato do formulário
          const formData = {
            name: vehicle.name,
            vin: vehicle.vin,
            year: vehicle.year.toString(),
            model: vehicle.model,
            miles: vehicle.miles.toString(),
            internalCode: vehicle.internal_code,
            color: vehicle.color,
            purchasePrice: vehicle.purchase_price.toString(),
            salePrice: vehicle.sale_price.toString(),
            minNegotiable: vehicle.min_negotiable?.toString() || '',
            carfaxPrice: vehicle.carfax_price?.toString() || '',
            mmrValue: vehicle.mmr_value?.toString() || '',
            description: vehicle.description || '',
            category: vehicle.category || 'forSale',
            financingBank: vehicle.financing_bank || '',
            financingType: vehicle.financing_type || '',
            originalFinancedName: vehicle.original_financed_name || '',
            purchaseDate: vehicle.purchase_date || '',
            dueDate: vehicle.due_date || '',
            installmentValue: vehicle.installment_value?.toString() || '',
            downPayment: vehicle.down_payment?.toString() || '',
            financedAmount: vehicle.financed_amount?.toString() || '',
            totalInstallments: vehicle.total_installments?.toString() || '',
            paidInstallments: vehicle.paid_installments?.toString() || '',
            remainingInstallments: vehicle.remaining_installments?.toString() || '',
            totalToPay: vehicle.total_to_pay?.toString() || '',
            payoffValue: vehicle.payoff_value?.toString() || '',
            payoffDate: vehicle.payoff_date || '',
            interestRate: vehicle.interest_rate?.toString() || '',
            customFinancingBank: vehicle.custom_financing_bank || '',
            titleTypeId: '',
            titleLocationId: '',
            titleLocationCustom: ''
          };

          await createVehicle(formData);
          successCount++;
        } catch (error) {
          const errorMsg = error.message || 'Erro desconhecido ao criar veículo';
          console.error('Erro ao importar veículo:', error);
          logError(i + 2, errorMsg, vehicles[i]);
          errors.push(`Linha ${i + 2}: ${errorMsg}`);
        }

        setProgress(((i + 1) / vehicles.length) * 100);
      }

      setResults({ success: successCount, errors });

      if (successCount > 0) {
        toast({
          title: 'Importação concluída',
          description: `${successCount} veículo(s) importado(s) com sucesso.`,
        });
        onImportComplete();
      }

      // Se houver erros, mostrar opção de download
      if (detailedErrors.length > 0) {
        toast({
          title: 'Erros encontrados',
          description: `${detailedErrors.length} erro(s) encontrado(s). Você pode baixar o log detalhado.`,
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('Erro na importação:', error);
      toast({
        title: 'Erro na importação',
        description: error.message || 'Erro desconhecido durante a importação.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (!importing) {
      setFile(null);
      setResults(null);
      setDetailedErrors([]);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Veículos em Lote</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="space-y-2">
            <Label>Arquivo de Exemplo</Label>
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar Template CSV
            </Button>
            <p className="text-sm text-gray-600">
              Baixe o arquivo de exemplo com todos os campos necessários para importação.
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Selecionar Arquivo</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              disabled={importing}
            />
            {file && (
              <p className="text-sm text-green-600">
                <CheckCircle className="inline mr-1 h-4 w-4" />
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>

          {/* Import Progress */}
          {importing && (
            <div className="space-y-2">
              <Label>Progresso da Importação</Label>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">{Math.round(progress)}% concluído</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importação concluída:</strong> {results.success} veículo(s) importado(s) com sucesso.
                </AlertDescription>
              </Alert>

              {results.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Erros encontrados:</strong>
                    <ul className="mt-2 list-disc list-inside">
                      {results.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                      {results.errors.length > 5 && (
                        <li className="text-sm">... e mais {results.errors.length - 5} erro(s)</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Log Download Button */}
              {detailedErrors.length > 0 && (
                <div className="space-y-2">
                  <Button onClick={downloadErrorLog} variant="outline" className="w-full">
                    <FileDown className="mr-2 h-4 w-4" />
                    Baixar Log Detalhado de Erros ({detailedErrors.length} erros)
                  </Button>
                  <p className="text-sm text-gray-600">
                    O log contém informações detalhadas sobre cada erro encontrado, incluindo linha, dados e timestamp.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {importing ? 'Importando...' : 'Importar Veículos'}
            </Button>
            <Button onClick={handleClose} variant="outline" disabled={importing}>
              {importing ? 'Aguarde...' : 'Cancelar'}
            </Button>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Instruções:</strong>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                <li>Baixe o template CSV para ver o formato correto</li>
                <li>Preencha todos os campos obrigatórios: name, vin, year, model, internal_code, color, purchase_price, sale_price</li>
                <li>Use valores numéricos para preços (ex: 18000.00) - máximo 8 dígitos antes da vírgula</li>
                <li>Para category use: forSale, sold, rental, maintenance, consigned</li>
                <li>Para financing_type use: comprou-direto ou assumiu-financiamento</li>
                <li>Valores muito altos serão rejeitados - verifique os limites nos erros</li>
                <li>Em caso de erros, você pode baixar um log detalhado para análise</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleImportModal;
