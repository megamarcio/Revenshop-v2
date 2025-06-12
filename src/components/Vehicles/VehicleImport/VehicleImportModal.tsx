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
  campo?: string;
  valor?: any;
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

  // Função para validar e limitar valores numéricos com mais detalhes
  const validateNumericField = (value: string, fieldName: string, maxDigits: number = 10, maxDecimals: number = 2): { isValid: boolean; cleanValue: number | null; error?: string } => {
    if (!value || value === '') {
      return { isValid: true, cleanValue: null };
    }

    // Log do valor original para debug
    console.log(`Validando campo ${fieldName}: valor original = "${value}"`);

    // Converter para string se não for
    const stringValue = String(value).trim();
    
    // Remover espaços e caracteres especiais, mas manter pontos e vírgulas
    const cleanedValue = stringValue.replace(/[^\d.,\-]/g, '');
    
    // Converter vírgula para ponto se necessário
    const normalizedValue = cleanedValue.replace(',', '.');
    
    console.log(`Campo ${fieldName}: valor normalizado = "${normalizedValue}"`);

    const numericValue = parseFloat(normalizedValue);
    
    if (isNaN(numericValue)) {
      const error = `Campo ${fieldName}: "${value}" não é um número válido`;
      console.error(error);
      return { 
        isValid: false, 
        cleanValue: null, 
        error
      };
    }

    // Verificar limites específicos por tipo de campo
    let maxValue: number;
    let fieldDescription: string;

    switch (fieldName) {
      case 'year':
        maxValue = 9999;
        fieldDescription = 'Ano';
        break;
      case 'miles':
        maxValue = 999999;
        fieldDescription = 'Milhas';
        break;
      case 'total_installments':
      case 'paid_installments':
      case 'remaining_installments':
        maxValue = 999;
        fieldDescription = 'Parcelas';
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
        maxValue = 99999999.99; // 8 dígitos antes da vírgula, 2 depois
        fieldDescription = 'Valor monetário';
        break;
      case 'interest_rate':
        maxValue = 999.99; // Taxa de juros até 999.99%
        fieldDescription = 'Taxa de juros';
        break;
      default:
        maxValue = Math.pow(10, maxDigits - maxDecimals) - 0.01;
        fieldDescription = 'Campo numérico';
    }

    console.log(`Campo ${fieldName}: valor = ${numericValue}, máximo permitido = ${maxValue}`);

    if (numericValue > maxValue) {
      const error = `${fieldDescription} ${fieldName}: valor ${numericValue} excede o limite máximo de ${maxValue}`;
      console.error(error);
      return { 
        isValid: false, 
        cleanValue: null, 
        error
      };
    }

    if (numericValue < 0) {
      const error = `${fieldDescription} ${fieldName}: valor negativo (${numericValue}) não é permitido`;
      console.error(error);
      return { 
        isValid: false, 
        cleanValue: null, 
        error
      };
    }

    // Verificar número de casas decimais
    const decimalPlaces = (normalizedValue.split('.')[1] || '').length;
    if (decimalPlaces > maxDecimals) {
      const error = `${fieldDescription} ${fieldName}: valor ${numericValue} tem muitas casas decimais (${decimalPlaces}). Máximo: ${maxDecimals}`;
      console.error(error);
      return { 
        isValid: false, 
        cleanValue: null, 
        error
      };
    }

    // Arredondar para o número correto de casas decimais
    const roundedValue = Math.round(numericValue * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
    
    console.log(`Campo ${fieldName}: valor final = ${roundedValue}`);
    
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
      '=== LOG DETALHADO DE ERROS - IMPORTAÇÃO DE VEÍCULOS ===',
      `Data/Hora: ${new Date().toLocaleString('pt-BR')}`,
      `Arquivo importado: ${file?.name || 'N/A'}`,
      `Total de erros: ${detailedErrors.length}`,
      '',
      '=== ANÁLISE DETALHADA DOS ERROS ===',
      ''
    ];

    detailedErrors.forEach((error, index) => {
      logContent.push(`ERRO #${index + 1}`);
      logContent.push(`Linha: ${error.linha}`);
      logContent.push(`Erro: ${error.erro}`);
      if (error.campo) {
        logContent.push(`Campo problemático: ${error.campo}`);
      }
      if (error.valor !== undefined) {
        logContent.push(`Valor problemático: ${error.valor}`);
      }
      logContent.push(`Timestamp: ${error.timestamp}`);
      if (error.dados) {
        logContent.push(`Dados completos da linha:`);
        Object.entries(error.dados).forEach(([key, value]) => {
          logContent.push(`  ${key}: "${value}"`);
        });
      }
      logContent.push('---');
      logContent.push('');
    });

    logContent.push('');
    logContent.push('=== DICAS PARA CORREÇÃO ===');
    logContent.push('1. Verifique se os valores numéricos não excedem os limites:');
    logContent.push('   - Valores monetários: máximo 99.999.999,99');
    logContent.push('   - Ano: máximo 9999');
    logContent.push('   - Milhas: máximo 999.999');
    logContent.push('   - Parcelas: máximo 999');
    logContent.push('   - Taxa de juros: máximo 999,99%');
    logContent.push('2. Use ponto ou vírgula como separador decimal');
    logContent.push('3. Não use separadores de milhares');
    logContent.push('4. Verifique se não há caracteres especiais nos números');

    const logText = logContent.join('\n');
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `log_detalhado_erros_${timestamp}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const vehicles = [];

    console.log('Cabeçalhos encontrados:', headers);

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const vehicle: any = {};
      const lineNumber = i + 1;

      console.log(`Processando linha ${lineNumber}:`, values);

      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        console.log(`Linha ${lineNumber}, mapeando header "${header}" (index ${index}) para valor "${value}"`);
        
        // Mapear os campos para o formato correto com validação numérica detalhada
        switch (header) {
          case 'year':
          case 'miles':
          case 'total_installments':
          case 'paid_installments':
          case 'remaining_installments':
            const intValidation = validateNumericField(value, header, 10, 0);
            if (!intValidation.isValid && value !== '') {
              vehicle[`${header}_error`] = intValidation.error;
              console.error(`Linha ${lineNumber}, campo ${header}:`, intValidation.error);
            }
            vehicle[header] = intValidation.cleanValue !== null ? intValidation.cleanValue : (value === '' ? '' : value);
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
            const priceValidation = validateNumericField(value, header, 10, 2);
            if (!priceValidation.isValid && value !== '') {
              vehicle[`${header}_error`] = priceValidation.error;
              console.error(`Linha ${lineNumber}, campo ${header}:`, priceValidation.error);
            }
            vehicle[header] = priceValidation.cleanValue !== null ? priceValidation.cleanValue : (value === '' ? '' : value);
            break;
          case 'interest_rate':
            const rateValidation = validateNumericField(value, header, 5, 2);
            if (!rateValidation.isValid && value !== '') {
              vehicle[`${header}_error`] = rateValidation.error;
              console.error(`Linha ${lineNumber}, campo ${header}:`, rateValidation.error);
            }
            vehicle[header] = rateValidation.cleanValue !== null ? rateValidation.cleanValue : (value === '' ? '' : value);
            break;
          default:
            vehicle[header] = value;
        }
      });

      console.log(`Veículo processado da linha ${lineNumber}:`, vehicle);
      vehicles.push(vehicle);
    }

    console.log('Todos os veículos processados:', vehicles);
    return vehicles;
  };

  const logError = (linha: number, erro: string, campo?: string, valor?: any, dados?: any) => {
    // Converter objetos para string legível para evitar [object Object]
    const valorString = typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
    
    const errorLog: ImportError = {
      linha,
      erro,
      campo,
      valor: valorString,
      dados,
      timestamp: new Date().toISOString()
    };
    
    console.error('Erro detalhado:', errorLog);
    setDetailedErrors(prev => [...prev, errorLog]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType === 'csv' || fileType === 'xls' || fileType === 'xlsx') {
        setFile(selectedFile);
        setResults(null);
        setDetailedErrors([]);
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
    setDetailedErrors([]);
    const errors: string[] = [];
    let successCount = 0;

    try {
      console.log('Iniciando importação do arquivo:', file.name);
      const text = await file.text();
      const vehicles = parseCSV(text);

      if (vehicles.length === 0) {
        const errorMsg = 'Nenhum veículo válido encontrado no arquivo';
        logError(0, errorMsg, 'arquivo', file.name);
        throw new Error(errorMsg);
      }

      console.log(`Processando ${vehicles.length} veículos...`);

      for (let i = 0; i < vehicles.length; i++) {
        try {
          const vehicle = vehicles[i];
          const lineNumber = i + 2;
          
          console.log(`Processando veículo ${i + 1}/${vehicles.length} (linha ${lineNumber}):`, vehicle);
          
          // Verificar se há erros de validação numérica
          const fieldErrors = Object.keys(vehicle)
            .filter(key => key.endsWith('_error'))
            .map(key => ({ field: key.replace('_error', ''), error: vehicle[key] }));
          
          if (fieldErrors.length > 0) {
            fieldErrors.forEach(({ field, error }) => {
              const problemValue = vehicle[field];
              logError(lineNumber, error, field, problemValue, vehicle);
              errors.push(`Linha ${lineNumber}, campo ${field}: ${error}`);
            });
            continue;
          }
          
          // Validar campos obrigatórios
          const requiredFields = ['name', 'vin', 'year', 'model', 'internal_code', 'color', 'purchase_price', 'sale_price'];
          const missingFields = requiredFields.filter(field => !vehicle[field] || vehicle[field] === '');
          
          if (missingFields.length > 0) {
            const errorMsg = `Campos obrigatórios em falta: ${missingFields.join(', ')}`;
            logError(lineNumber, errorMsg, 'campos_obrigatorios', missingFields, vehicle);
            errors.push(`Linha ${lineNumber}: ${errorMsg}`);
            continue;
          }

          // Mapear para o formato do formulário - garantindo que todos os valores sejam strings
          const formData = {
            name: String(vehicle.name || ''),
            vin: String(vehicle.vin || ''),
            year: String(vehicle.year || ''),
            model: String(vehicle.model || ''),
            miles: String(vehicle.miles || '0'),
            internalCode: String(vehicle.internal_code || ''),
            color: String(vehicle.color || ''),
            purchasePrice: String(vehicle.purchase_price || ''),
            salePrice: String(vehicle.sale_price || ''),
            minNegotiable: String(vehicle.min_negotiable || ''),
            carfaxPrice: String(vehicle.carfax_price || ''),
            mmrValue: String(vehicle.mmr_value || ''),
            description: String(vehicle.description || ''),
            category: String(vehicle.category || 'forSale'),
            financingBank: String(vehicle.financing_bank || ''),
            financingType: String(vehicle.financing_type || ''),
            originalFinancedName: String(vehicle.original_financed_name || ''),
            purchaseDate: String(vehicle.purchase_date || ''),
            dueDate: String(vehicle.due_date || ''),
            installmentValue: String(vehicle.installment_value || ''),
            downPayment: String(vehicle.down_payment || ''),
            financedAmount: String(vehicle.financed_amount || ''),
            totalInstallments: String(vehicle.total_installments || ''),
            paidInstallments: String(vehicle.paid_installments || ''),
            remainingInstallments: String(vehicle.remaining_installments || ''),
            totalToPay: String(vehicle.total_to_pay || ''),
            payoffValue: String(vehicle.payoff_value || ''),
            payoffDate: String(vehicle.payoff_date || ''),
            interestRate: String(vehicle.interest_rate || ''),
            customFinancingBank: String(vehicle.custom_financing_bank || ''),
            titleTypeId: '',
            titleLocationId: '',
            titleLocationCustom: ''
          };

          console.log(`Tentando criar veículo da linha ${lineNumber}:`, formData);
          await createVehicle(formData);
          successCount++;
          console.log(`Veículo da linha ${lineNumber} criado com sucesso!`);
        } catch (error) {
          const errorMsg = error.message || 'Erro desconhecido ao criar veículo';
          console.error(`Erro ao importar veículo da linha ${i + 2}:`, error);
          logError(i + 2, errorMsg, 'criacao_veiculo', vehicles[i], vehicles[i]);
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

      if (detailedErrors.length > 0) {
        toast({
          title: 'Erros encontrados',
          description: `${detailedErrors.length} erro(s) detalhado(s) encontrado(s). Baixe o log para análise completa.`,
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('Erro geral na importação:', error);
      logError(0, error.message || 'Erro desconhecido durante a importação', 'importacao_geral', error);
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
                      {results.errors.slice(0, 3).map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                      {results.errors.length > 3 && (
                        <li className="text-sm">... e mais {results.errors.length - 3} erro(s)</li>
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
                    O log contém análise completa de cada erro: campo, valor, linha e dicas de correção.
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
                <li>Use valores numéricos para preços (ex: 18000.00) - máximo 99.999.999,99</li>
                <li>Para category use: forSale, sold, rental, maintenance, consigned</li>
                <li>Para financing_type use: comprou-direto ou assumiu-financiamento</li>
                <li>Em caso de erros, baixe o log detalhado que mostra exatamente qual campo e valor está causando problema</li>
                <li>O log inclui dicas específicas para correção de cada tipo de erro</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleImportModal;
