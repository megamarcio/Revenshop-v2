import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  RefreshCw,
  Copy,
  Edit,
  Wand2,
  Save,
  Trash2,
  Eye,
  Plus
} from 'lucide-react';
import { useRevenues } from '@/hooks/useRevenues';
import { useExpenses } from '@/hooks/useExpenses';
import { useExpenseForecasts } from '@/hooks/useExpenseForecasts';
import { useRevenueForecasts } from '@/hooks/useRevenueForecasts';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { useImportData, ImportDataRecord, CreateImportDataRecord } from '@/hooks/useImportData';
import { useAISummary } from '@/hooks/useAISummary';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  destination: 'pontual' | 'previsao';
  categoryId: string | null;
  replicationMonths?: number;
  dueDay?: number;
  aiSummary?: string;
  editedBusiness?: string;
}

const DataImportPage: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [parsedData, setParsedData] = useState<ImportRecord[]>([]);
  const [classifiedData, setClassifiedData] = useState<ClassifiedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'classify' | 'import'>('upload');
  const [editingRecord, setEditingRecord] = useState<ClassifiedRecord | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const { createRevenue } = useRevenues();
  const { createExpense } = useExpenses();
  const { createExpense: createExpenseForecast } = useExpenseForecasts();
  const { createRevenue: createRevenueForecast } = useRevenueForecasts();
  const { categories } = useFinancialCategories();
  // Hook real para dados de importação
  const {
    records: pendingRecords,
    isLoading: loadingPending,
    createRecord,
    updateRecord,
    deleteRecord,
    markAsImported,
    bulkCreate,
    getPendingRecords,
    fetchRecords
  } = useImportData();

  // Verificar se a tabela import_data existe
  React.useEffect(() => {
    const testTableExists = async () => {
      try {
        const { error } = await supabase
          .from('import_data')
          .select('id')
          .limit(1);
        
        if (error && error.code === '42P01') {
          toast({
            title: 'Configuração Necessária',
            description: 'Execute o script de migração manual para criar a tabela import_data.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Erro ao verificar tabela:', err);
      }
    };

    testTableExists();
  }, []);

  // Hook real para IA
  const { generateSummary, isGenerating, isConfigured } = useAISummary();

  // Carregar dados pendentes ao inicializar
  React.useEffect(() => {
    fetchRecords();
  }, []);

  // Recarregar quando voltar para a página
  React.useEffect(() => {
    const handleFocus = () => {
      fetchRecords();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const sampleData = `Date,Amount,Business,Category,TransactionID,Account,Status
2025-06-02,(3.99),PAYPAL DES:INST XFER ID:GOOGLE MARCELLO,Software,v9EYEeZVRZHKAjnNpq1yuNjN3OE4L7I0KM6xO,Marcio R3 Account,Fixa
2025-06-02,2311.00,Receita de Vendas Janeiro,Vendas,0JkKkPNDZNUPde984DmNiB8BPy3EAnFvOeQZg,Marcio R3 Account,Variavel
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
    return isNegative ? -result : result;
  };

  const findCategoryId = (categoryName: string, type: 'receita' | 'despesa'): string | null => {
    const targetType = type === 'receita' ? 'receita' : 'despesa';
    const category = categories.find(cat => 
      cat.type === targetType && 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return category?.id || null;
  };

  const handleParse = async () => {
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
        if (!record.status || !['Fixa', 'Variavel'].includes(record.status)) {
          validationErrors.push(`Linha ${line}: Status inválido '${record.status}' (deve ser 'Fixa' ou 'Variavel')`);
        }
      });

      setErrors(validationErrors);

      if (validationErrors.length === 0 && records.length > 0) {
        // Classificação automática baseada no valor
        const classified = records.map((record, index) => {
          const parsedAmount = parseAmount(record.amount);
          const isNegative = parsedAmount < 0;
          
          return {
            ...record,
            id: `import_${index}`,
            parsedAmount: Math.abs(parsedAmount),
            type: isNegative ? 'despesa' : 'receita' as 'receita' | 'despesa',
            destination: 'pontual' as 'pontual' | 'previsao',
            categoryId: findCategoryId(record.category, isNegative ? 'despesa' : 'receita'),
            replicationMonths: 1,
            dueDay: new Date(record.date).getDate(),
            editedBusiness: record.business
          };
        });
        
        setClassifiedData(classified);
        setCurrentStep('classify');
        
        toast({
          title: 'Sucesso',
          description: `${records.length} registros parseados e classificados automaticamente.`,
        });
      }
    } catch (error) {
      setErrors(['Erro ao parsear CSV: ' + (error as Error).message]);
    }
  };

  const handleAISummary = async (record: ClassifiedRecord) => {
    const summary = await generateSummary(record.business);
    if (summary) {
      setClassifiedData(prev => prev.map(item => 
        item.id === record.id ? { ...item, aiSummary: summary } : item
      ));
    }
  };

  const handleBulkAISummary = async () => {
    setIsLoading(true);
    try {
      for (const record of classifiedData) {
        if (!record.aiSummary) {
          await handleAISummary(record);
          // Pequena pausa para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      toast({
        title: 'Resumos Gerados',
        description: 'Todos os resumos foram gerados pela IA',
      });
    } catch (error) {
      console.error('Erro ao gerar resumos em lote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<ClassifiedRecord>) => {
    setClassifiedData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setClassifiedData(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveItemAsPending = async (record: ClassifiedRecord) => {
    try {
      const pendingRecord = {
        original_date: record.date,
        original_amount: record.parsedAmount,
        original_business: record.business,
        original_category: record.category,
        transaction_id: record.transactionId,
        account: record.account,
        status: record.status,
        classified_type: record.type,
        classified_destination: record.destination,
        category_id: record.categoryId,
        due_day: record.dueDay,
        ai_summary: record.aiSummary,
        ai_summary_applied: !!record.aiSummary
      };

      await createRecord(pendingRecord);
      
      // Remove o item da lista atual
      handleDeleteItem(record.id);
      
      toast({
        title: "Sucesso",
        description: "Registro salvo como pendente",
      });
    } catch (error) {
      console.error('Erro ao salvar como pendente:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar registro como pendente",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsPending = async () => {
    if (classifiedData.length === 0) return;

    setIsLoading(true);
    try {
      const pendingRecords: CreateImportDataRecord[] = classifiedData.map(item => ({
        original_date: item.date,
        original_amount: item.parsedAmount,
        original_business: item.business,
        original_category: item.category,
        transaction_id: item.transactionId,
        account: item.account,
        status: item.status,
        classified_type: item.type,
        classified_destination: item.destination,
        category_id: item.categoryId,
        due_day: item.dueDay,
      }));

      const savedCount = await bulkCreate(pendingRecords);
      
      toast({
        title: 'Dados Salvos',
        description: `${savedCount} registros salvos como pendentes para importação posterior.`,
      });

      handleReset();
    } catch (error) {
      console.error('Erro ao salvar como pendentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPendingRecord = (pendingRecord: ImportDataRecord) => {
    // Converter registro pendente para formato de edição
    const editableRecord: ClassifiedRecord = {
      id: pendingRecord.id,
      date: pendingRecord.original_date,
      amount: pendingRecord.original_amount.toString(),
      business: pendingRecord.original_business,
      category: pendingRecord.original_category || '',
      transactionId: pendingRecord.transaction_id || '',
      account: pendingRecord.account || '',
      status: pendingRecord.status,
      parsedAmount: pendingRecord.original_amount,
      type: pendingRecord.classified_type || 'despesa',
      destination: pendingRecord.classified_destination || 'pontual',
      categoryId: pendingRecord.category_id || null,
      dueDay: pendingRecord.due_day,
      aiSummary: pendingRecord.ai_summary,
      editedBusiness: pendingRecord.ai_summary || pendingRecord.original_business
    };

    // Adicionar à lista de classificação
    setClassifiedData(prev => [...prev, editableRecord]);
    
    // Remover dos pendentes
    deleteRecord(pendingRecord.id);
    
    // Ir para tela de classificação
    setCurrentStep('classify');
    
    toast({
      title: 'Registro Movido',
      description: 'Registro movido para edição. Faça as alterações necessárias.',
    });
  };

  const handleImportPendingRecord = async (pendingRecord: ImportDataRecord) => {
    try {
      setIsLoading(true);
      
      const description = pendingRecord.ai_summary || pendingRecord.original_business;
      
      if (pendingRecord.classified_destination === 'pontual') {
        if (pendingRecord.classified_type === 'receita') {
          await createRevenue({
            description,
            amount: pendingRecord.original_amount,
            category_id: pendingRecord.category_id,
            type: (pendingRecord.status.toLowerCase() === 'fixa' ? 'padrao' : 'estimada') as 'padrao' | 'estimada',
            date: pendingRecord.original_date,
            is_confirmed: true,
            notes: `Importado - ID: ${pendingRecord.transaction_id}`,
            import_category: pendingRecord.original_category,
          });
        } else {
          await createExpense({
            description,
            amount: pendingRecord.original_amount,
            category_id: pendingRecord.category_id,
            type: (pendingRecord.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
            date: pendingRecord.original_date,
            due_date: pendingRecord.original_date,
            is_paid: true,
            notes: `Importado - ID: ${pendingRecord.transaction_id}`,
            import_category: pendingRecord.original_category,
          });
        }
      } else {
        if (pendingRecord.classified_type === 'receita') {
          await createRevenueForecast({
            description,
            amount: pendingRecord.original_amount,
            type: (pendingRecord.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
            category_id: pendingRecord.category_id,
            due_day: pendingRecord.due_day || new Date(pendingRecord.original_date).getDate(),
            is_active: true,
            notes: `Importado para replicação - ID: ${pendingRecord.transaction_id}`,
            import_category: pendingRecord.original_category,
          });
        } else {
          await createExpenseForecast({
            description,
            amount: pendingRecord.original_amount,
            type: (pendingRecord.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
            category_id: pendingRecord.category_id,
            due_day: pendingRecord.due_day || new Date(pendingRecord.original_date).getDate(),
            is_active: true,
            notes: `Importado para replicação - ID: ${pendingRecord.transaction_id}`,
            import_category: pendingRecord.original_category,
          });
        }
      }
      
      // Marcar como importado
      await markAsImported(pendingRecord.id);
      
      toast({
        title: 'Importação Concluída',
        description: `Registro importado para ${pendingRecord.classified_type === 'receita' ? 'Receita' : 'Despesa'} - ${pendingRecord.classified_destination === 'pontual' ? 'Pontual' : 'Previsão'}.`,
      });
      
    } catch (error) {
      console.error('Erro ao importar registro pendente:', error);
      toast({
        title: 'Erro na Importação',
        description: 'Erro ao importar registro pendente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSelected = async (selectedIds: string[]) => {
    const selectedRecords = classifiedData.filter(item => selectedIds.includes(item.id));
    if (selectedRecords.length === 0) return;

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of selectedRecords) {
        try {
          const description = item.aiSummary || item.editedBusiness || item.business;
          
          if (item.destination === 'pontual') {
            if (item.type === 'receita') {
              await createRevenue({
                description,
                amount: item.parsedAmount,
                category_id: item.categoryId,
                type: (item.status.toLowerCase() === 'fixa' ? 'padrao' : 'estimada') as 'padrao' | 'estimada',
                date: item.date,
                is_confirmed: true,
                notes: `Importado - ID: ${item.transactionId}`,
                import_category: item.category,
              });
            } else {
              await createExpense({
                description,
                amount: item.parsedAmount,
                category_id: item.categoryId,
                type: (item.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
                date: item.date,
                due_date: item.date,
                is_paid: true,
                notes: `Importado - ID: ${item.transactionId}`,
                import_category: item.category,
              });
            }
          } else {
            if (item.type === 'receita') {
              await createRevenueForecast({
                description,
                amount: item.parsedAmount,
                type: (item.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
                category_id: item.categoryId,
                due_day: item.dueDay || new Date(item.date).getDate(),
                is_active: true,
                notes: `Importado para replicação - ID: ${item.transactionId}`,
                import_category: item.category,
              });
            } else {
              await createExpenseForecast({
                description,
                amount: item.parsedAmount,
                type: (item.status.toLowerCase() === 'fixa' ? 'fixa' : 'variavel') as 'fixa' | 'variavel',
                category_id: item.categoryId,
                due_day: item.dueDay || new Date(item.date).getDate(),
                is_active: true,
                notes: `Importado para replicação - ID: ${item.transactionId}`,
                import_category: item.category,
              });
            }
          }
          
          successCount++;
        } catch (createError) {
          console.error('❌ Erro na criação:', createError);
          errorCount++;
        }
      }

      toast({
        title: 'Importação Concluída',
        description: `${successCount} registros importados. ${errorCount} erros.`,
        variant: errorCount > 0 ? 'destructive' : 'default',
      });

      // Remover registros importados da lista
      setClassifiedData(prev => prev.filter(item => !selectedIds.includes(item.id)));
    } catch (error) {
      console.error('💥 Erro geral na importação:', error);
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

  const displayRecords = showPendingOnly ? getPendingRecords() : [...classifiedData];
  const revenueCount = displayRecords.filter(item => 
    'type' in item ? item.type === 'receita' : item.classified_type === 'receita'
  ).length;
  const expenseCount = displayRecords.filter(item => 
    'type' in item ? item.type === 'despesa' : item.classified_type === 'despesa'
  ).length;
  const pontualCount = displayRecords.filter(item => 
    'destination' in item ? item.destination === 'pontual' : item.classified_destination === 'pontual'
  ).length;
  const previsaoCount = displayRecords.filter(item => 
    'destination' in item ? item.destination === 'previsao' : item.classified_destination === 'previsao'
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Importação de Dados</h1>
          <p className="text-muted-foreground">
            Importe dados CSV, classifique automaticamente e gerencie com IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPendingOnly(!showPendingOnly)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {showPendingOnly ? 'Ver Todos' : 'Apenas Pendentes'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRecords}
            disabled={loadingPending}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loadingPending ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={downloadSample}>
            <Download className="w-4 h-4 mr-1" />
            Modelo CSV
          </Button>
        </div>
      </div>

      {/* Estatísticas Compactas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Receitas</p>
              <p className="font-semibold">{revenueCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Despesas</p>
              <p className="font-semibold">{expenseCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pontuais</p>
              <p className="font-semibold">{pontualCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Previsões</p>
              <p className="font-semibold">{previsaoCount}</p>
            </div>
          </div>
        </Card>
        <Card className={`p-3 ${getPendingRecords().length > 0 ? 'ring-2 ring-orange-500' : ''}`}>
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="font-semibold">{getPendingRecords().length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload de Arquivo */}
      {currentStep === 'upload' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upload de Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Arquivo CSV</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label>Ou Cole os Dados</Label>
                <Textarea
                  placeholder="Cole o conteúdo CSV aqui..."
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={3}
                  className="text-xs"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-xs">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleParse}
                disabled={!csvData.trim()}
                size="sm"
              >
                <Upload className="w-4 h-4 mr-1" />
                Processar
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classificação e Edição */}
      {currentStep === 'classify' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Classificar e Editar ({classifiedData.length} items)</CardTitle>
              <div className="flex gap-2">
                {isConfigured && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkAISummary}
                    disabled={isGenerating || isLoading}
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    {isGenerating ? 'Gerando...' : 'IA p/ Todos'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveAsPending}
                  disabled={isLoading || classifiedData.length === 0}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Salvar Pendentes
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleImportSelected(classifiedData.map(r => r.id))}
                  disabled={isLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Importar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep('upload')}>
                  Voltar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {classifiedData.map((record) => (
                <div key={record.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={record.type === 'receita' ? 'default' : 'destructive'} className="text-xs">
                        {record.type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {record.destination === 'pontual' ? 'Pontual' : 'Previsão'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        $ {record.parsedAmount.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {/* Botão IA para resumir */}
                      {isConfigured && !record.aiSummary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAISummary(record)}
                          disabled={isGenerating}
                          className="h-6 px-2 text-xs"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          IA
                        </Button>
                      )}

                      {/* Botão Editar Linha */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Editar Registro</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">Descrição Original</Label>
                              <p className="text-sm text-muted-foreground">{record.business}</p>
                            </div>
                            {record.aiSummary && (
                              <div>
                                <Label className="text-xs">Resumo IA</Label>
                                <p className="text-sm text-blue-600">{record.aiSummary}</p>
                              </div>
                            )}
                            <div>
                              <Label htmlFor="editedBusiness" className="text-xs">Descrição Final</Label>
                              <Input
                                id="editedBusiness"
                                value={record.editedBusiness || ''}
                                onChange={(e) => handleUpdateItem(record.id, { editedBusiness: e.target.value })}
                                className="h-8"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Tipo</Label>
                                <Select
                                  value={record.type}
                                  onValueChange={(value: 'receita' | 'despesa') => 
                                    handleUpdateItem(record.id, { type: value })
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="receita">Receita</SelectItem>
                                    <SelectItem value="despesa">Despesa</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Destino</Label>
                                <Select
                                  value={record.destination}
                                  onValueChange={(value: 'pontual' | 'previsao') => 
                                    handleUpdateItem(record.id, { destination: value })
                                  }
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pontual">Pontual</SelectItem>
                                    <SelectItem value="previsao">Previsão</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Botão Excluir Linha */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(record.id)}
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Excluir
                      </Button>

                      {/* Botão Selecionar Tipo */}
                      <Select
                        value={record.type}
                        onValueChange={(value: 'receita' | 'despesa') => 
                          handleUpdateItem(record.id, { type: value })
                        }
                      >
                        <SelectTrigger className="h-6 w-20 px-2 text-xs border-gray-300 hover:border-gray-400 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent className="min-w-fit">
                          <SelectItem value="receita" className="text-xs">Receita</SelectItem>
                          <SelectItem value="despesa" className="text-xs">Despesa</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Botão Selecionar Destino */}
                      <Select
                        value={record.destination}
                        onValueChange={(value: 'pontual' | 'previsao') => 
                          handleUpdateItem(record.id, { destination: value })
                        }
                      >
                        <SelectTrigger className="h-6 w-24 px-2 text-xs border-gray-300 hover:border-gray-400 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Destino" />
                        </SelectTrigger>
                        <SelectContent className="min-w-fit">
                          <SelectItem value="pontual" className="text-xs">Pontual</SelectItem>
                          <SelectItem value="previsao" className="text-xs">Previsão</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Botão Salvar como Pendente */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSaveItemAsPending(record)}
                        disabled={isLoading}
                        className="h-6 px-2 text-xs"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Pendente
                      </Button>

                      {/* Botão Importar Individual */}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleImportSelected([record.id])}
                        disabled={isLoading}
                        className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Importar
                      </Button>

                      {/* Botão para editar/reverter descrição da IA */}
                      {record.aiSummary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDescription = prompt('Editar descrição:', record.aiSummary || record.business);
                            if (newDescription !== null) {
                              if (newDescription.trim() === '') {
                                // Reverter para descrição original
                                handleUpdateItem(record.id, { 
                                  aiSummary: undefined,
                                  editedBusiness: record.business 
                                });
                                toast({
                                  title: 'Revertido',
                                  description: 'Descrição revertida para o texto original.',
                                });
                              } else {
                                // Salvar nova descrição editada
                                handleUpdateItem(record.id, { 
                                  aiSummary: newDescription,
                                  editedBusiness: newDescription 
                                });
                                toast({
                                  title: 'Atualizado',
                                  description: 'Descrição editada com sucesso.',
                                });
                              }
                            }
                          }}
                          className="h-6 px-2 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium break-words">
                      {record.aiSummary || record.editedBusiness || record.business}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {record.date} • {record.category} • {record.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção de Registros Pendentes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Save className="w-5 h-5 text-orange-500" />
            Registros Pendentes ({getPendingRecords().length})
            {loadingPending && (
              <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getPendingRecords().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Save className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhum registro pendente</p>
              <p className="text-xs">Registros salvos como pendentes aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {getPendingRecords().map((record) => (
                <div key={record.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={record.classified_type === 'receita' ? 'default' : 'destructive'} className="text-xs">
                        {record.classified_type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {record.classified_destination === 'pontual' ? 'Pontual' : 'Previsão'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        $ {record.original_amount.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPendingRecord(record)}
                        className="h-6 px-2 text-xs"
                        disabled={isLoading}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleImportPendingRecord(record)}
                        className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Importar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecord(record.id)}
                        className="h-6 px-2 text-red-600 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium break-words">
                      {record.ai_summary || record.original_business}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {record.original_date} • {record.original_category} • {record.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isConfigured && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Configure a chave da OpenAI nas configurações de IA para usar o resumo automático.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DataImportPage;