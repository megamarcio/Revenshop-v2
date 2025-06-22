import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Revenue {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  is_confirmed: boolean;
  notes?: string;
  category?: {
    name: string;
    type: string;
  };
}

interface RevenueListViewProps {
  revenues: Revenue[];
  onEdit: (revenue: Revenue) => void;
  onReplicate: (revenue: Revenue) => void;
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
  canReplicate: (revenue: Revenue) => boolean;
}

const RevenueListView: React.FC<RevenueListViewProps> = ({
  revenues,
  onEdit,
  onReplicate,
  onDelete,
  formatCurrency,
  getTypeColor,
  canReplicate,
}) => {
  return (
    <div className="grid gap-3">
      {revenues.map((revenue) => (
        <Card key={revenue.id} className="text-sm">
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-medium text-sm">{revenue.description}</h3>
                  <Badge className={`${getTypeColor(revenue.type)} text-xs px-1.5 py-0.5`}>
                    {revenue.type}
                  </Badge>
                  {revenue.is_confirmed && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">
                      Confirmada
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Data: {format(new Date(revenue.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  {revenue.category && <p>Categoria: {revenue.category.name}</p>}
                  {revenue.notes && <p>Obs: {revenue.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-base font-bold text-green-600">
                    {formatCurrency(revenue.amount)}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onEdit(revenue)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  {canReplicate(revenue) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onReplicate(revenue)}
                      title={`Replicar ${revenue.type === 'estimada' ? 'receita estimada' : 'receita padrão'} para próximos meses`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(revenue.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RevenueListView;
