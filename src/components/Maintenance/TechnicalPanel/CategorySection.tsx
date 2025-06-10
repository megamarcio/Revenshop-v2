
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { TechnicalItem } from './types';

interface CategorySectionProps {
  categoryName: string;
  CategoryIcon: React.ComponentType<{ className?: string }>;
  items: TechnicalItem[];
}

const CategorySection = ({ categoryName, CategoryIcon, items }: CategorySectionProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em-dia': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'proximo-troca': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'trocar': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (month?: string, year?: string) => {
    if (!month || !year) return '--/--';
    const m = month.padStart(2, '0');
    const y = year.slice(-2);
    return `${m}/${y}`;
  };

  if (items.length === 0) return null;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CategoryIcon className="h-4 w-4" />
          {categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50">
              <span className="text-xs text-gray-700">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatDate(item.month, item.year)}
                </span>
                {getStatusIcon(item.status)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CategorySection;
