import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useRevenues } from '@/hooks/useRevenues';
import { useExpenses } from '@/hooks/useExpenses';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ImportRecord {
  date: string;
  amount: string;
  business: string;
  category: string;
  transactionId: string;
  account: string;
  status: 'Fixa' | 'Variavel';
}

interface DataImportModalProps {
  type: 'receitas' | 'despesas';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DataImportModal: React.FC<DataImportModalProps> = ({
  type,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [csvData, setCsvData] = useState('');
  const [parsedData, setParsedData] = useState<ImportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { createRevenue } = useRevenues();
  const { createExpense } = useExpenses();
  const { categories } = useFinancialCategories();
  
  // Verificar configuração do Supabase
  const isSupabaseConfigured = () => {
    // Verificar se o cliente Supabase está disponível
    const isConfigured = !!supabase;
    console.log('🔧 Supabase config check:', { isConfigured, client: !!supabase });
    return isConfigured;
  };

  const sampleData = `Date,Amount,Business,Category,TransactionID,Account,Status
2025-06-02,(3.99),PAYPAL DES:INST XFER ID:GOOGLE MARCELLO,Software,v9EYEeZVRZHKAjnNpq1yuNjN3OE4L7I0KM6xO,Marcio R3 Account,Fixa
2025-06-02,(2311.00),Zelle payment to Rolling kobby,Parcela Financiamentos,0JkKkPNDZNUPde984DmNiB8BPy3EAnFvOeQZg,Marcio R3 Account,Variavel
2025-06-02,(800.00),Zelle payment to MB SOLUTION PRIME LLC,Funcionarios,jrjqjmao8aH7jOa0LJp8TbebV6OLBNFj5ZKgg,Marcio R3 Account,Fixa`;

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const parseCSV = (csvText: string): ImportRecord[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const records: ImportRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        console.warn(`Linha ${i + 1} possui ${values.length} colunas, esperado ${headers.length}`);
        console.warn(`Valores: ${JSON.stringify(values)}`);
        continue;
      }

      records.push({
        date: values[0],
        amount: values[1],
        business: values[2],
        category: values[3],
        transactionId: values[4],
        account: values[5],
        status: values[6] as 'Fixa' | 'Variavel'
      });
    }

    return records;
  };

  const validateData = (records: ImportRecord[]): string[] => {
    const errors: string[] = [];

    records.forEach((record, index) => {
      const line = index + 2; // +2 porque começamos da linha 2 (após header)

      // Validar data
      if (!record.date || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
        errors.push(`Linha ${line}: Data inválida '${record.date}' (deve ser yyyy-mm-dd)`);
      }

      // Validar valor
      if (!record.amount) {
        errors.push(`Linha ${line}: Valor é obrigatório`);
      } else {
        // Testar se consegue parsear o valor
        const testAmount = parseAmount(record.amount);
        if (isNaN(testAmount) || testAmount === 0) {
          errors.push(`Linha ${line}: Valor inválido '${record.amount}' (deve ser um número)`);
        }
      }

      // Validar business
      if (!record.business || !record.business.trim()) {
        errors.push(`Linha ${line}: Descrição (Business) é obrigatória`);
      }

      // Validar status
      if (!record.status || !['Fixa', 'Variavel'].includes(record.status)) {
        errors.push(`Linha ${line}: Status inválido '${record.status}' (deve ser 'Fixa' ou 'Variavel')`);
      }

      // Debug: mostrar dados parseados
      console.log(`Linha ${line}:`, {
        date: record.date,
        amount: record.amount,
        business: record.business,
        category: record.category,
        transactionId: record.transactionId,
        account: record.account,
        status: record.status
      });
    });

    return errors;
  };

  const parseAmount = (amountStr: string): number => {
    // Verificar se tem parênteses (indica valor negativo no formato contábil)
    const isNegative = amountStr.includes('(') && amountStr.includes(')');
    
    // Remove parênteses e espaços
    let cleanAmount = amountStr.replace(/[()]/g, '').trim();
    
    // Detectar formato baseado na posição da vírgula e ponto
    if (cleanAmount.includes(',') && cleanAmount.includes('.')) {
      // Verificar qual vem por último para determinar o separador decimal
      const lastComma = cleanAmount.lastIndexOf(',');
      const lastDot = cleanAmount.lastIndexOf('.');
      
      if (lastDot > lastComma) {
        // Formato americano: 1,234.56 - vírgula = milhares, ponto = decimal
        cleanAmount = cleanAmount.replace(/,/g, '');
      } else {
        // Formato brasileiro: 1.234,56 - ponto = milhares, vírgula = decimal
        cleanAmount = cleanAmount.replace(/\./g, '').replace(',', '.');
      }
    } else if (cleanAmount.includes(',')) {
      // Só vírgula - assumir formato brasileiro (vírgula = decimal)
      cleanAmount = cleanAmount.replace(',', '.');
    }
    // Se só tem ponto, manter como está (formato americano)
    
    const result = parseFloat(cleanAmount) || 0;
    
    // Se estava entre parênteses, manter como positivo para despesas (já são valores de saída)
    console.log(`💱 parseAmount: '${amountStr}' -> '${cleanAmount}' -> ${result} ${isNegative ? '(era negativo)' : ''}`);
    return result;
  };

  const findCategoryId = (categoryName: string): string | null => {
    // Busca opcional por categoria existente (pode retornar null)
    const targetType = type === 'receitas' ? 'receita' : 'despesa';
    const category = categories.find(cat => 
      cat.type === targetType && 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return category?.id || null;
  };

  const handleParse = () => {
    try {
      const records = parseCSV(csvData);
      const validationErrors = validateData(records);
      
      setErrors(validationErrors);
      setParsedData(records);

      if (validationErrors.length === 0) {
        toast({
          title: 'Sucesso',
          description: `${records.length} registros parseados com sucesso`,
        });
      }
    } catch (error) {
      setErrors(['Erro ao parsear CSV: ' + (error as Error).message]);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0 || errors.length > 0) return;

    console.log('🚀 Iniciando importação...', { type, parsedData });
    console.log('📋 Hooks disponíveis:', { createRevenue: !!createRevenue, createExpense: !!createExpense });
    console.log('🔧 Supabase configurado:', isSupabaseConfigured());
    
    // Testar conectividade com Supabase
    try {
      console.log('🔍 Testando conectividade com Supabase...');
      const { data: testData, error: testError } = await supabase
        .from('financial_categories')
        .select('id, name')
        .limit(1);
      
      if (testError) {
        console.error('❌ Erro no teste de conectividade:', testError);
        toast({
          title: 'Erro de Conectividade',
          description: `Erro ao conectar com o banco: ${testError.message}`,
          variant: 'destructive',
        });
        return;
      }
      
      console.log('✅ Conectividade OK:', testData);
    } catch (connectError) {
      console.error('💥 Erro fatal de conectividade:', connectError);
      toast({
        title: 'Erro Fatal',
        description: 'Não foi possível conectar com o banco de dados',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const record of parsedData) {
        console.log('🔄 Iniciando processamento do registro:', record);
        
        try {
          const amount = parseAmount(record.amount);
          const categoryId = findCategoryId(record.category); // Opcional

          console.log('📊 Processando registro:', {
            record,
            amount,
            categoryId,
            type
          });

          try {
            if (type === 'receitas') {
              const revenueData = {
                description: record.business,
                amount: amount,
                category_id: categoryId, // Pode ser null
                type: (record.status.toLowerCase() === 'fixa' ? 'padrao' : 'estimada') as 'padrao' | 'estimada',
                date: record.date,
                is_confirmed: false,
                notes: `Importado - ID: ${record.transactionId}, Conta: ${record.account}`,
                import_category: record.category, // AGORA SALVANDO CATEGORIA DE IMPORTAÇÃO
              };
              console.log('💰 Criando receita:', revenueData);
              console.log('💰 Hook createRevenue:', createRevenue);
              console.log('💰 Chamando createRevenue...');
              
              try {
                const result = await createRevenue(revenueData);
                console.log('💰 Resultado da criação:', result);
                console.log('✅ Receita criada com sucesso!');
              } catch (createRevenueError) {
                console.error('💥 ERRO ESPECÍFICO NA CRIAÇÃO DA RECEITA:', {
                  error: createRevenueError,
                  message: createRevenueError instanceof Error ? createRevenueError.message : 'Erro desconhecido',
                  stack: createRevenueError instanceof Error ? createRevenueError.stack : undefined,
                  revenueData
                });
                throw createRevenueError; // Re-throw para ser capturado pelo catch externo
              }
            } else {
              const expenseData = {
                description: record.business,
                amount: amount,
                category_id: categoryId, // Pode ser null
                type: (record.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
                date: record.date,
                due_date: record.date,
                is_paid: true, // Como já foi processado, consideramos como pago
                notes: `Importado - ID: ${record.transactionId}, Conta: ${record.account}`,
                import_category: record.category, // AGORA SALVANDO CATEGORIA DE IMPORTAÇÃO
              };
              console.log('💸 Criando despesa:', expenseData);
              console.log('💸 Hook createExpense:', createExpense);
              console.log('💸 Chamando createExpense...');
              
              try {
                const result = await createExpense(expenseData);
                console.log('💸 Resultado da criação:', result);
                console.log('✅ Despesa criada com sucesso!');
              } catch (createExpenseError) {
                console.error('💥 ERRO ESPECÍFICO NA CRIAÇÃO DA DESPESA:', {
                  error: createExpenseError,
                  message: createExpenseError instanceof Error ? createExpenseError.message : 'Erro desconhecido',
                  stack: createExpenseError instanceof Error ? createExpenseError.stack : undefined,
                  expenseData
                });
                throw createExpenseError; // Re-throw para ser capturado pelo catch externo
              }
            }
            
            successCount++;
            console.log('✅ Registro importado com sucesso');
            
          } catch (createError) {
            console.error('❌ Erro específico na criação:', {
              record,
              createError: createError instanceof Error ? createError.message : createError,
              stack: createError instanceof Error ? createError.stack : undefined,
              type
            });
            errorCount++;
          }
          
        } catch (parseError) {
          console.error('❌ Erro no parsing/processamento:', {
            record,
            parseError: parseError instanceof Error ? parseError.message : parseError,
            stack: parseError instanceof Error ? parseError.stack : undefined
          });
          errorCount++;
        }
      }

      console.log('📈 Resultado final:', { successCount, errorCount });

      toast({
        title: 'Importação Concluída',
        description: `${successCount} registros importados com sucesso. ${errorCount} erros.`,
        variant: errorCount > 0 ? 'destructive' : 'default',
      });

      if (successCount > 0) {
        // Verificar se os dados foram realmente salvos
        console.log('🔍 Verificando dados salvos...');
        try {
          const { data: savedData, error: checkError } = await supabase
            .from(type === 'receitas' ? 'revenues' : 'expenses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(successCount);
          
          if (checkError) {
            console.error('❌ Erro ao verificar dados salvos:', checkError);
          } else {
            console.log('✅ Dados salvos confirmados:', savedData);
          }
        } catch (verifyError) {
          console.error('💥 Erro na verificação:', verifyError);
        }
        
        onSuccess?.();
        onOpenChange(false);
        handleReset();
      }
    } catch (error) {
      console.error('💥 Erro geral na importação:', error);
      toast({
        title: 'Erro na Importação',
        description: 'Erro geral durante a importação',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setCsvData('');
    setParsedData([]);
    setErrors([]);
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const downloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelo_${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar {type === 'receitas' ? 'Receitas' : 'Despesas'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instruções */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Formato esperado:</strong> CSV separado por vírgula com as colunas: 
              Date, Amount, Business, Category, TransactionID, Account, Status
              <br />
              <strong>Data:</strong> yyyy-mm-dd | <strong>Amount:</strong> (valor) | <strong>Status:</strong> Fixa ou Variavel
              <br />
              <strong>Category:</strong> Será salvo no campo "Categoria Importação" para rastreamento
            </AlertDescription>
          </Alert>

          {/* Botão para baixar modelo */}
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={downloadSample}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Modelo CSV
            </Button>
          </div>

          {/* Upload de Arquivo */}
          <div className="space-y-2">
            <Label htmlFor="fileUpload">Arquivo CSV</Label>
            <div className="flex items-center gap-4">
              <Input
                id="fileUpload"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="flex-1"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Separador OU */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-muted-foreground bg-white px-2">OU</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Textarea para colar dados */}
          <div className="space-y-2">
            <Label htmlFor="csvData">Colar Dados CSV</Label>
            <Textarea
              id="csvData"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Cole aqui os dados CSV manualmente (alternativa ao upload)..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!csvData.trim()}>
              Analisar Dados
            </Button>
            {(csvData || selectedFile) && (
              <Button
                onClick={handleReset}
                variant="outline"
              >
                Limpar
              </Button>
            )}
            <Button
              onClick={handleImport}
              disabled={parsedData.length === 0 || errors.length > 0 || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Importando...' : 'Importar Dados'}
            </Button>
          </div>

          {/* Erros */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erros encontrados:</strong>
                <ul className="list-disc list-inside mt-2">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview dos dados */}
          {parsedData.length > 0 && errors.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">
                  {parsedData.length} registros prontos para importação
                </span>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Data</th>
                      <th className="p-2 text-left">Valor</th>
                      <th className="p-2 text-left">Descrição</th>
                      <th className="p-2 text-left">Categoria</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 10).map((record, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{record.amount}</td>
                        <td className="p-2 max-w-xs truncate">{record.business}</td>
                        <td className="p-2">{record.category}</td>
                        <td className="p-2">
                          <Badge variant={record.status === 'Fixa' ? 'default' : 'secondary'}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 10 && (
                  <div className="p-2 text-center text-muted-foreground border-t">
                    ... e mais {parsedData.length - 10} registros
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataImportModal; 