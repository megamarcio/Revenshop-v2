
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface AuctionDetailsModalProps {
  auction: any;
  onClose: () => void;
}

const AuctionDetailsModal = ({ auction, onClose }: AuctionDetailsModalProps) => {
  const calculateProfitMargin = () => {
    if (!auction.carfax_value || !auction.mmr_value || auction.mmr_value === 0) return null;
    return ((auction.carfax_value - auction.mmr_value) / auction.mmr_value * 100).toFixed(1);
  };

  const profitMargin = calculateProfitMargin();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalhes do Leilão - {auction.car_name} ({auction.car_year})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Margem de Lucro Destacada */}
          {profitMargin !== null && (
            <div className="text-center">
              <Badge 
                variant={parseFloat(profitMargin) > 0 ? "default" : "destructive"}
                className={`text-xl px-6 py-3 ${parseFloat(profitMargin) > 0 ? "bg-green-500" : ""}`}
              >
                Margem de Lucro: {profitMargin}%
              </Badge>
            </div>
          )}

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Leilão</h3>
              <p>{auction.auction_house}</p>
              {auction.auction_city && <p className="text-sm text-gray-500">{auction.auction_city}</p>}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Data do Leilão</h3>
              <p>{auction.auction_date ? new Date(auction.auction_date).toLocaleDateString('pt-BR') : 'Não informado'}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Link do Carro</h3>
              <a 
                href={auction.car_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver Carro <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {auction.carfax_link && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Link Carfax</h3>
                <a 
                  href={auction.carfax_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  Ver Carfax <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          {/* Valores */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Valores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {auction.carfax_value && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Valor Carfax</p>
                  <p className="font-semibold">R$ {auction.carfax_value.toLocaleString('pt-BR')}</p>
                </div>
              )}

              {auction.mmr_value && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Valor MMR</p>
                  <p className="font-semibold">R$ {auction.mmr_value.toLocaleString('pt-BR')}</p>
                </div>
              )}

              {auction.estimated_repair_value && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Valor Est. Reparo</p>
                  <p className="font-semibold">R$ {auction.estimated_repair_value.toLocaleString('pt-BR')}</p>
                </div>
              )}

              {auction.bid_value && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Valor do Lance</p>
                  <p className="font-semibold">R$ {auction.bid_value.toLocaleString('pt-BR')}</p>
                </div>
              )}

              {auction.max_payment_value && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Valor Máximo</p>
                  <p className="font-semibold">R$ {auction.max_payment_value.toLocaleString('pt-BR')}</p>
                </div>
              )}

              {auction.estimated_auction_fees && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Taxas Est. Leilão</p>
                  <p className="font-semibold">R$ {auction.estimated_auction_fees.toLocaleString('pt-BR')}</p>
                </div>
              )}

              {auction.estimated_freight_fee && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Frete Estimado</p>
                  <p className="font-semibold">R$ {auction.estimated_freight_fee.toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lance Aceito */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Status do Lance</h3>
            <Badge variant={auction.bid_accepted ? "default" : "secondary"}>
              {auction.bid_accepted ? 'Lance Aceito' : 'Lance Não Aceito'}
            </Badge>
          </div>

          {/* Informações da Compra (se lance aceito) */}
          {auction.bid_accepted && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Informações da Compra</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auction.buyer_name && (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Comprador</p>
                    <p className="font-semibold">{auction.buyer_name}</p>
                  </div>
                )}

                {auction.purchase_value && (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Valor Comprado</p>
                    <p className="font-semibold">R$ {auction.purchase_value.toLocaleString('pt-BR')}</p>
                  </div>
                )}

                {auction.purchase_date && (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Data da Compra</p>
                    <p className="font-semibold">{new Date(auction.purchase_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}

                {auction.actual_auction_fees && (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Taxas do Leilão</p>
                    <p className="font-semibold">R$ {auction.actual_auction_fees.toLocaleString('pt-BR')}</p>
                  </div>
                )}

                {auction.actual_freight_fee && (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Frete</p>
                    <p className="font-semibold">R$ {auction.actual_freight_fee.toLocaleString('pt-BR')}</p>
                  </div>
                )}

                {auction.total_vehicle_cost && (
                  <div className="bg-blue-50 p-3 rounded border-2 border-blue-200">
                    <p className="text-sm text-gray-600">Custo Total do Veículo</p>
                    <p className="font-bold text-lg">R$ {auction.total_vehicle_cost.toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observações */}
          {auction.observations && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Observações</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p>{auction.observations}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionDetailsModal;
