
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

interface RevenueUltraCompactViewProps {
  revenues: Revenue[];
  onEdit: (revenue: Revenue) => void;
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  getTypeColor: (type: string) => string;
}

const RevenueUltraCompactView: React.FC<RevenueUltraCompactViewProps> = ({
  revenues,
  onEdit,
  onDelete,
  formatCurrency,
  getTypeColor,
}) => {
  return (
    <div className="space-y-1">
      {revenues.map((revenue) => (
        <Card key={revenue.id} className="border-l-2 border-l-green-200">
          <CardContent className="p-1 px-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              {/* Data */}
              <div className="text-muted-foreground min-w-16 text-center">
                {format(new Date(revenue.date), 'dd/MM/yy', { locale: ptBR })}
              </div>

              {/* Descrição e categoria */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-medium truncate">{revenue.description}</span>
                <Badge className={`${getTypeColor(revenue.type)} text-xs px-1 py-0 h-4`}>
                  {revenue.type.charAt(0).toUpperCase()}
                </Badge>
                {revenue.category && (
                  <span className="text-muted-foreground text-xs truncate">
                    {revenue.category.name}
                  </span>
                )}
              </div>

              {/* Status e valor */}
              <div className="flex items-center gap-2">
                {revenue.is_confirmed && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs px-1 py-0 h-4">
                    ✓
                  </Badge>
                )}
                <div className="text-xs font-bold text-green-600 min-w-16 text-right">
                  {formatCurrency(revenue.amount)}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => onEdit(revenue)}
                >
                  <Edit className="h-2 w-2" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(revenue.id)}
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RevenueUltraCompactView;
