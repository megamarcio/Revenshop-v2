
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
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

interface RevenueCompactViewProps {
  revenues: Revenue[];
  onEdit: (revenue: Revenue) => void;
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
}

const RevenueCompactView: React.FC<RevenueCompactViewProps> = ({
  revenues,
  onEdit,
  onDelete,
  formatCurrency,
  getTypeColor,
}) => {
  return (
    <div className="grid gap-2">
      {revenues.map((revenue) => (
        <Card key={revenue.id} className="text-xs">
          <CardContent className="p-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-xs truncate">{revenue.description}</h3>
                  <Badge className={`${getTypeColor(revenue.type)} text-xs px-1 py-0`}>
                    {revenue.type.charAt(0).toUpperCase()}
                  </Badge>
                  {revenue.is_confirmed && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(revenue.date), 'dd/MM', { locale: ptBR })} • 
                  {revenue.category ? ` ${revenue.category.name}` : ' Sem categoria'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-green-600">
                  {formatCurrency(revenue.amount)}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onEdit(revenue)}
                  >
                    <Edit className="h-2.5 w-2.5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(revenue.id)}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
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

export default RevenueCompactView;
