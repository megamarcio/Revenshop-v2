import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { FluxoCaixaData } from './types';
import { useToast } from '@/hooks/use-toast';

interface FluxoCaixaExportProps {
  data: FluxoCaixaData[];
  month: number;
  year: number;
}

const FluxoCaixaExport: React.FC<FluxoCaixaExportProps> = ({ data, month, year }) => {
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    try {
      const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
      const csvContent = [
        '# REVENSHOP - Fluxo de Caixa',
        '# Desenvolvido por Marcio Cavs (@marcio_r3)',
        '# Todos os direitos reservados',
        '',
        headers.join(','),
        ...data.map(item => [
          formatDate(item.date),
          `"${item.description}"`,
          `"${item.category}"`,
          item.type === 'receita' ? 'Receita' : 'Despesa',
          item.amount.toFixed(2).replace('.', ',')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fluxo-caixa-${month.toString().padStart(2, '0')}-${year}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportação realizada",
        description: "Arquivo CSV baixado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados para CSV.",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    try {
      // Calcular totais
      const totalReceitas = data
        .filter(item => item.type === 'receita')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const totalDespesas = data
        .filter(item => item.type === 'despesa')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const saldoFinal = totalReceitas - totalDespesas;

      // Criar conteúdo HTML para impressão
      const monthName = new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Fluxo de Caixa - ${monthName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .developer-info { text-align: center; margin-bottom: 20px; font-size: 12px; color: #666; }
            .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .summary-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .summary-card.receitas { border-color: #10b981; color: #10b981; }
            .summary-card.despesas { border-color: #ef4444; color: #ef4444; }
            .summary-card.saldo { border-color: ${saldoFinal >= 0 ? '#10b981' : '#ef4444'}; color: ${saldoFinal >= 0 ? '#10b981' : '#ef4444'}; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .receita { color: #10b981; }
            .despesa { color: #ef4444; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REVENSHOP</h1>
            <h2>Fluxo de Caixa - ${monthName}</h2>
          </div>
          
          <div class="developer-info">
            <p>Desenvolvido por <strong>Marcio Cavs</strong> | Instagram: @marcio_r3</p>
          </div>
          
          <div class="summary">
            <div class="summary-card receitas">
              <h3>Total Receitas</h3>
              <p>${formatCurrency(totalReceitas)}</p>
            </div>
            <div class="summary-card despesas">
              <h3>Total Despesas</h3>
              <p>${formatCurrency(totalDespesas)}</p>
            </div>
            <div class="summary-card saldo">
              <h3>Saldo Final</h3>
              <p>${formatCurrency(saldoFinal)}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td>${formatDate(item.date)}</td>
                  <td>${item.description}</td>
                  <td>${item.category}</td>
                  <td>${item.type === 'receita' ? 'Receita' : 'Despesa'}</td>
                  <td class="${item.type}">
                    ${item.type === 'receita' ? '+' : '-'} ${formatCurrency(item.amount)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} REVENSHOP - Todos os direitos reservados</p>
            <p>Sistema desenvolvido por Marcio Cavs | @marcio_r3</p>
          </div>
        </body>
        </html>
      `;

      // Abrir nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Aguardar o carregamento e imprimir
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);

        toast({
          title: "PDF gerado",
          description: "Janela de impressão aberta. Salve como PDF.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FluxoCaixaExport; 