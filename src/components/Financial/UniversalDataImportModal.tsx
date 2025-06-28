import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Upload, Download, AlertCircle, CheckCircle, X, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
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

interface ClassifiedRecord extends ImportRecord {
  id: string;
  parsedAmount: number;
  type: 'receita' | 'despesa';
  categoryId: string | null;
}

interface UniversalDataImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const UniversalDataImportModal: React.FC<UniversalDataImportModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [csvData, setCsvData] = useState('');
  const [parsedData, setParsedData] = useState<ImportRecord[]>([]);
  const [classifiedData, setClassifiedData] = useState<ClassifiedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'classify' | 'import'>('upload');

  const { createRevenue } = useRevenues();
  const { createExpense } = useExpenses();
  const { categories } = useFinancialCategories();

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

  const parseAmount = (amountStr: string): number => {
    const isNegative = amountStr.includes('(') && amountStr.includes(')');
    let cleanAmount = amountStr.replace(/[()]/g, '').trim();
    
    if (cleanAmount.includes(',') && cleanAmount.includes('.')) {
      const lastComma = cleanAmount.lastIndexOf(',');
      const lastDot = cleanAmount.lastIndexOf('.');
      
      if (lastDot > lastComma) {
        cleanAmount = cleanAmount.replace(/,/g, '');
      } else {
        cleanAmount = cleanAmount.replace(/\./g, '').replace(',', '.');
      }
    } else if (cleanAmount.includes(',')) {
      cleanAmount = cleanAmount.replace(',', '.');
    }
    
    const result = parseFloat(cleanAmount) || 0;
    return result;
  };

  const findCategoryId = (categoryName: string, type: 'receita' | 'despesa'): string | null => {
    const targetType = type === 'receita' ? 'receita' : 'despesa';
    const category = categories.find(cat => 
      cat.type === targetType && 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return category?.id || null;
  };

  const handleParse = () => {
    try {
      const records = parseCSV(csvData);
      const validationErrors: string[] = [];

      records.forEach((record, index) => {
        const line = index + 2;
        if (!record.date || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
          validationErrors.push(`Linha ${line}: Data inválida '${record.date}' (deve ser yyyy-mm-dd)`);
        }
        if (!record.amount) {
          validationErrors.push(`Linha ${line}: Valor é obrigatório`);
        }
        if (!record.business || !record.business.trim()) {
          validationErrors.push(`Linha ${line}: Descrição (Business) é obrigatória`);
        }
        if (!['Fixa', 'Variavel'].includes(record.status)) {
          validationErrors.push(`Linha ${line}: Status inválido '${record.status}' (deve ser 'Fixa' ou 'Variavel')`);
        }
      });
      
      setErrors(validationErrors);
      setParsedData(records);

      if (validationErrors.length === 0 && records.length > 0) {
        // Criar dados classificados com tipo padrão (despesa para valores negativos)
        const classified = records.map((record, index) => ({
          ...record,
          id: `import_${index}`,
          parsedAmount: parseAmount(record.amount),
          type: 'despesa' as 'receita' | 'despesa', // Padrão como despesa
          categoryId: null
        }));
        
        setClassifiedData(classified);
        setCurrentStep('classify');
        
        toast({
          title: 'Sucesso',
          description: `${records.length} registros parseados. Agora classifique cada item.`,
        });
      }
    } catch (error) {
      setErrors(['Erro ao parsear CSV: ' + (error as Error).message]);
    }
  };

  const handleClassifyItem = (id: string, type: 'receita' | 'despesa') => {
    setClassifiedData(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            type, 
            categoryId: findCategoryId(item.category, type) 
          }
        : item
    ));
  };

  const handleImportClassified = async () => {
    if (classifiedData.length === 0) return;

    console.log('🚀 Iniciando importação classificada...', classifiedData);

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Testar conectividade
      const { data: testData, error: testError } = await supabase
        .from('financial_categories')
        .select('id, name')
        .limit(1);
      
      if (testError) {
        toast({
          title: 'Erro de Conectividade',
          description: `Erro ao conectar com o banco: ${testError.message}`,
          variant: 'destructive',
        });
        return;
      }

      for (const item of classifiedData) {
        try {
          if (item.type === 'receita') {
            const revenueData = {
              description: item.business,
              amount: item.parsedAmount,
              category_id: item.categoryId,
              type: (item.status.toLowerCase() === 'fixa' ? 'padrao' : 'estimada') as 'padrao' | 'estimada',
              date: item.date,
              is_confirmed: false,
              notes: `Importado - ID: ${item.transactionId}, Conta: ${item.account}, Categoria: ${item.category}`,
            };
            
            await createRevenue(revenueData);
            console.log('✅ Receita criada:', revenueData);
          } else {
            const expenseData = {
              description: item.business,
              amount: item.parsedAmount,
              category_id: item.categoryId,
              type: (item.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
              date: item.date,
              due_date: item.date,
              is_paid: true,
              notes: `Importado - ID: ${item.transactionId}, Conta: ${item.account}, Categoria: ${item.category}`,
            };
            
            await createExpense(expenseData);
            console.log('✅ Despesa criada:', expenseData);
          }
          
          successCount++;
        } catch (createError) {
          console.error('❌ Erro na criação:', createError);
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
    setClassifiedData([]);
    setErrors([]);
    setSelectedFile(null);
    setCurrentStep('upload');
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const downloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const revenueCount = classifiedData.filter(item => item.type === 'receita').length;
  const expenseCount = classifiedData.filter(item => item.type === 'despesa').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Dados Financeiros
            {currentStep === 'classify' && (
              <Badge variant="outline" className="ml-2">
                Etapa 2: Classificar Items
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Etapa 1: Upload */}
          {currentStep === 'upload' && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Formato esperado:</strong> CSV com colunas: Date, Amount, Business, Category, TransactionID, Account, Status
                  <br />
                  <strong>Data:</strong> yyyy-mm-dd | <strong>Amount:</strong> (valor) | <strong>Status:</strong> Fixa ou Variavel
                </AlertDescription>
              </Alert>

              <div className="flex justify-start">
                <Button type="button" variant="outline" onClick={downloadSample} className="gap-2">
                  <Download className="w-4 h-4" />
                  Baixar Modelo CSV
                </Button>
              </div>

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

              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-sm text-muted-foreground bg-white px-2">OU</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvData">Colar Dados CSV</Label>
                <Textarea
                  id="csvData"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Cole aqui os dados CSV..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleParse} disabled={!csvData.trim()}>
                  Analisar e Classificar
                </Button>
                {(csvData || selectedFile) && (
                  <Button onClick={handleReset} variant="outline">
                    Limpar
                  </Button>
                )}
              </div>

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
            </>
          )}

          {/* Etapa 2: Classificação */}
          {currentStep === 'classify' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">Classifique cada item:</h3>
                  <div className="flex gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {revenueCount} Receitas
                    </Badge>
                    <Badge variant="destructive">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {expenseCount} Despesas
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleImportClassified}
                    disabled={isLoading || classifiedData.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Importando...' : 'Importar Classificados'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {classifiedData.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{item.business}</span>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Data: {item.date} | Valor: {item.amount} = ${item.parsedAmount}</div>
                          <div>Categoria: {item.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={item.type === 'receita' ? 'default' : 'outline'}
                          onClick={() => handleClassifyItem(item.id, 'receita')}
                          className={item.type === 'receita' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Receita
                        </Button>
                        <Button
                          size="sm"
                          variant={item.type === 'despesa' ? 'destructive' : 'outline'}
                          onClick={() => handleClassifyItem(item.id, 'despesa')}
                        >
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Despesa
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalDataImportModal;