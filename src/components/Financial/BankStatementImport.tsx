
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  balance?: number;
  reference?: string;
}

const BankStatementImport = () => {
  const [csvText, setCsvText] = useState('');
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const parseBankOfAmericaCSV = (csvContent: string): BankTransaction[] => {
    const lines = csvContent.trim().split('\n');
    const transactions: BankTransaction[] = [];

    // Skip header line (usually first line)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV line (handle commas in quoted strings)
      const columns = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanColumns = columns.map(col => col.replace(/^"|"$/g, '').trim());

      if (cleanColumns.length >= 4) {
        const [date, description, , amount, balance] = cleanColumns;
        
        transactions.push({
          date: formatDate(date),
          description: description,
          amount: parseFloat(amount.replace(/[,$]/g, '')),
          balance: balance ? parseFloat(balance.replace(/[,$]/g, '')) : undefined,
          reference: cleanColumns[5] || undefined,
        });
      }
    }

    return transactions.reverse(); // Most recent first
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const handleParseCSV = () => {
    try {
      const parsed = parseBankOfAmericaCSV(csvText);
      setTransactions(parsed);
      toast({
        title: 'Sucesso',
        description: `${parsed.length} transações encontradas`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar o arquivo CSV',
        variant: 'destructive',
      });
    }
  };

  const handleImportTransactions = async () => {
    setIsLoading(true);
    try {
      // Check for duplicates first
      const existingTransactions = await supabase
        .from('bank_statements')
        .select('reference_number, transaction_date, amount, description');

      const { data: existing } = existingTransactions;

      const newTransactions = transactions.filter(transaction => {
        return !existing?.some(existingTx => 
          existingTx.transaction_date === transaction.date &&
          Math.abs(existingTx.amount - transaction.amount) < 0.01 &&
          existingTx.description === transaction.description
        );
      });

      if (newTransactions.length === 0) {
        toast({
          title: 'Aviso',
          description: 'Todas as transações já existem no sistema',
        });
        return;
      }

      const { error } = await supabase
        .from('bank_statements')
        .insert(
          newTransactions.map(transaction => ({
            transaction_date: transaction.date,
            description: transaction.description,
            amount: transaction.amount,
            balance: transaction.balance,
            reference_number: transaction.reference,
            is_processed: false,
          }))
        );

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `${newTransactions.length} transações importadas com sucesso`,
      });

      setCsvText('');
      setTransactions([]);
    } catch (error) {
      console.error('Error importing transactions:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao importar transações',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Importar Extrato Bancário</h2>
        <p className="text-muted-foreground">Importar transações do Bank of America (formato CSV)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload do Extrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cole o conteúdo do CSV aqui:
            </label>
            <Textarea
              placeholder="Cole o conteúdo do arquivo CSV do Bank of America aqui..."
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleParseCSV}
              disabled={!csvText.trim()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Processar CSV
            </Button>

            {transactions.length > 0 && (
              <Button 
                onClick={handleImportTransactions}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? 'Importando...' : `Importar ${transactions.length} Transações`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia das Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                    {transaction.balance && (
                      <p className="text-sm text-muted-foreground">
                        Saldo: {formatCurrency(transaction.balance)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankStatementImport;
