import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, Wrench, Calendar, CheckCircle } from 'lucide-react';

interface ReminderItem {
  title?: string;
  vehicle?: { name: string; internal_code: string };
  maintenance_items?: string[];
  custom_maintenance?: string;
  vehicles?: { name: string; internal_code: string };
  due_date?: string;
  promised_date?: string;
  detection_date?: string;
  priority?: string;
}

interface ReminderType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
  data: ReminderItem[];
}

interface RemindersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  reminderTypes: ReminderType[];
  totalReminders: number;
}

const RemindersPanel: React.FC<RemindersPanelProps> = ({
  isOpen,
  onClose,
  reminderTypes,
  totalReminders
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getItemDescription = (item: ReminderItem) => {
    if (item.title) {
      // É uma tarefa
      return {
        title: item.title,
        vehicle: item.vehicle?.internal_code || 'Sem veículo',
        date: item.due_date ? formatDate(item.due_date) : '',
        type: 'task' as const
      };
    } else {
      // É uma manutenção
      const maintenanceText = item.maintenance_items?.length > 0 
        ? item.maintenance_items[0] 
        : (item.custom_maintenance || 'Manutenção');
      return {
        title: maintenanceText,
        vehicle: item.vehicles?.internal_code || 'Sem veículo',
        date: item.promised_date ? formatDate(item.promised_date) : 
              (item.detection_date ? formatDate(item.detection_date) : ''),
        type: 'maintenance' as const
      };
    }
  };

  const activeSections = reminderTypes.filter(type => type.count > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Lembretes do Sistema
            {totalReminders > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalReminders} {totalReminders === 1 ? 'item' : 'itens'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {totalReminders === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tudo em dia! 🎉
              </h3>
              <p className="text-gray-600">
                Não há lembretes pendentes no momento.
              </p>
            </div>
          ) : (
            activeSections.map((section) => (
              <Card key={section.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                    <h3 className="text-lg font-semibold">{section.name}</h3>
                    <Badge variant="outline">
                      {section.count} {section.count === 1 ? 'item' : 'itens'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {section.data.map((item, index) => {
                      const description = getItemDescription(item);
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {description.title}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                🚗 {description.vehicle}
                              </span>
                              {description.date && (
                                <span className="flex items-center gap-1">
                                  📅 {description.date}
                                </span>
                              )}
                              {description.type === 'task' && item.priority && (
                                <Badge 
                                  variant={item.priority === 'urgent' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {item.priority === 'urgent' ? 'Urgente' : 
                                   item.priority === 'high' ? 'Alta' :
                                   item.priority === 'medium' ? 'Média' : 'Baixa'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {description.type === 'task' ? (
                              <Clock className="h-4 w-4 text-orange-500" />
                            ) : (
                              <Wrench className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {section.count > section.data.length && (
                    <div className="mt-3 text-center text-sm text-gray-500">
                      ... e mais {section.count - section.data.length} itens
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Os lembretes são atualizados automaticamente a cada 30 segundos</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemindersPanel; 