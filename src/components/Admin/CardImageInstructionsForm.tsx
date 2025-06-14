
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CardImageInstructionsFormProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const CardImageInstructionsForm = ({ 
  instructions, 
  onInstructionsChange 
}: CardImageInstructionsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruções para Foto do Card</CardTitle>
        <CardDescription>
          Configure o prompt usado para gerar as fotos dos cards dos veículos com IA.
          Use os placeholders abaixo que serão substituídos automaticamente pelos dados do formulário do veículo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="card-instructions">Prompt para Foto do Card</Label>
          <Textarea
            id="card-instructions"
            placeholder="Ex: Criar uma imagem profissional e atrativa para o card de um veículo [MARCA] [MODELO] [ANO] [COR]..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Placeholders disponíveis (substituídos pelos dados do formulário atual):</strong></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-semibold mb-2">📋 Informações Básicas:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li><code>[MARCA]</code> - Primeira palavra do nome do veículo</li>
                <li><code>[MODELO]</code> - Restante do nome do veículo</li>
                <li><code>[NOME_COMPLETO]</code> - Nome completo do veículo</li>
                <li><code>[ANO]</code> - Ano do veículo</li>
                <li><code>[COR]</code> - Cor do veículo</li>
                <li><code>[VIN]</code> - Número VIN</li>
                <li><code>[QUILOMETRAGEM]</code> - Milhas/Quilometragem</li>
                <li><code>[MILHAS]</code> - Milhas do veículo</li>
                <li><code>[CODIGO_INTERNO]</code> - Código interno</li>
                <li><code>[CATEGORIA]</code> - Categoria (venda, vendido, etc.)</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">💰 Informações Financeiras:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li><code>[PRECO_COMPRA]</code> - Preço de compra</li>
                <li><code>[PRECO_VENDA]</code> - Preço de venda</li>
                <li><code>[PRECO_MINIMO]</code> - Preço mínimo negociável</li>
                <li><code>[CARFAX_PRICE]</code> - Preço Carfax</li>
                <li><code>[MMR_VALUE]</code> - Valor MMR</li>
                <li><code>[BANCO_FINANCIAMENTO]</code> - Banco de financiamento</li>
                <li><code>[TIPO_FINANCIAMENTO]</code> - Tipo de financiamento</li>
                <li><code>[VALOR_PARCELA]</code> - Valor da parcela</li>
                <li><code>[ENTRADA]</code> - Valor da entrada</li>
                <li><code>[VALOR_FINANCIADO]</code> - Valor financiado</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">🏪 Informações de Venda:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li><code>[VENDEDOR]</code> - Nome do vendedor</li>
                <li><code>[PRECO_VENDA_FINAL]</code> - Preço final de venda</li>
                <li><code>[DATA_VENDA]</code> - Data da venda</li>
                <li><code>[NOME_CLIENTE]</code> - Nome do cliente</li>
                <li><code>[TELEFONE_CLIENTE]</code> - Telefone do cliente</li>
                <li><code>[METODO_PAGAMENTO]</code> - Método de pagamento</li>
                <li><code>[EMPRESA_FINANCIAMENTO]</code> - Empresa de financiamento</li>
                <li><code>[COMISSAO_VENDEDOR]</code> - Comissão do vendedor</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">🏢 Outros Campos:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li><code>[USO_VEICULO]</code> - Uso do veículo</li>
                <li><code>[LOJA_CONSIGNACAO]</code> - Loja de consignação</li>
                <li><code>[DESCRICAO]</code> - Descrição do veículo</li>
                <li><code>[DATA_COMPRA]</code> - Data de compra</li>
                <li><code>[VALOR_QUITACAO]</code> - Valor de quitação</li>
                <li><code>[TAXA_JUROS]</code> - Taxa de juros</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>💡 Exemplo de uso:</strong><br/>
              "Criar uma imagem profissional de showroom para um [MARCA] [MODELO] [ANO] na cor [COR], código interno [CODIGO_INTERNO], com [QUILOMETRAGEM] milhas. Preço de venda $[PRECO_VENDA]. Estilo: iluminação perfeita, fundo neutro, alta qualidade, realista, destaque para o veículo."
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardImageInstructionsForm;
