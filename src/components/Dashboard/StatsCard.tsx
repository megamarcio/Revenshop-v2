
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  prefix?: string;
}

const StatsCard = ({ title, value, icon: Icon, color, prefix }: StatsCardProps) => {
  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
          {title}
        </CardTitle>
        <div className={`p-1.5 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-lg font-bold text-foreground">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
