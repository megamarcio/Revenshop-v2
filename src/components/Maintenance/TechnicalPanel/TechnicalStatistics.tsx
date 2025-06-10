
import React from 'react';
import { TechnicalItem } from '../../../hooks/useTechnicalItems';

interface TechnicalStatisticsProps {
  items: TechnicalItem[];
}

const TechnicalStatistics = ({ items }: TechnicalStatisticsProps) => {
  const emDiaCount = items.filter(i => i.status === 'em-dia').length;
  const proximoTrocaCount = items.filter(i => i.status === 'proximo-troca').length;
  const trocarCount = items.filter(i => i.status === 'trocar').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="text-2xl font-bold text-green-700">
          {emDiaCount}
        </div>
        <div className="text-sm text-green-600">Itens em Dia</div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="text-2xl font-bold text-yellow-700">
          {proximoTrocaCount}
        </div>
        <div className="text-sm text-yellow-600">Próximo da Troca</div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="text-2xl font-bold text-red-700">
          {trocarCount}
        </div>
        <div className="text-sm text-red-600">Precisam Trocar</div>
      </div>
    </div>
  );
};

export default TechnicalStatistics;
