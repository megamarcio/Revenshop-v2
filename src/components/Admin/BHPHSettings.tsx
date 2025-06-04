
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useBHPH } from '../../contexts/BHPHContext';
import { CreditCard } from 'lucide-react';

const BHPHSettings = () => {
  const { settings, updateSettings } = useBHPH();
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(settings.downPaymentPercentage);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(settings.monthlyInterestRate);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validações
      if (downPaymentPercentage < 0 || downPaymentPercentage > 100) {
        throw new Error('Percentual de entrada deve estar entre 0% e 100%');
      }
      
      if (monthlyInterestRate < 0 || monthlyInterestRate > 50) {
        throw new Error('Taxa de juros deve estar entre 0% e 50%');
      }

      updateSettings({
        downPaymentPercentage,
        monthlyInterestRate
      });

      toast({
        title: 'Sucesso',
        description: 'Configurações do Buy Here Pay Here atualizadas com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar configurações',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDownPaymentPercentage(60);
    setMonthlyInterestRate(3);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Configurações Buy Here Pay Here</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="downPayment">Percentual de Entrada Padrão (%)</Label>
            <Input
              id="downPayment"
              type="number"
              min="0"
              max="100"
              value={downPaymentPercentage}
              onChange={(e) => setDownPaymentPercentage(Number(e.target.value))}
              placeholder="Ex: 60"
            />
            <p className="text-sm text-gray-500">
              Percentual do valor do veículo exigido como entrada
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Taxa de Juros Mensal (%)</Label>
            <Input
              id="interestRate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={monthlyInterestRate}
              onChange={(e) => setMonthlyInterestRate(Number(e.target.value))}
              placeholder="Ex: 3"
            />
            <p className="text-sm text-gray-500">
              Taxa de juros compostos aplicada mensalmente
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Configurações Atuais</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>Entrada mínima: {settings.downPaymentPercentage}% do valor do veículo</p>
            <p>Taxa de juros: {settings.monthlyInterestRate}% ao mês</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isLoading}
          >
            Resetar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BHPHSettings;
