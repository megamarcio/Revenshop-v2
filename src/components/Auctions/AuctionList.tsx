
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, ExternalLink, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import AuctionDetailsModal from './AuctionDetailsModal';

interface AuctionListProps {
  onEditAuction: (auction: any) => void;
}

const AuctionList = ({ onEditAuction }: AuctionListProps) => {
  const { canEditVehicles } = useAuth();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data: auctions, isLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const calculateProfitMargin = (carfaxValue: number, mmrValue: number) => {
    if (!carfaxValue || !mmrValue || mmrValue === 0) return null;
    return ((carfaxValue - mmrValue) / mmrValue * 100).toFixed(1);
  };

  const handleViewDetails = (auction: any) => {
    setSelectedAuction(auction);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando leilões...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leilão</TableHead>
              <TableHead>Carro</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor Lance</TableHead>
              <TableHead>Lance Aceito</TableHead>
              <TableHead>Margem Lucro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions?.map((auction) => {
              const profitMargin = calculateProfitMargin(auction.carfax_value, auction.mmr_value);
              
              return (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{auction.auction_house}</div>
                      {auction.auction_city && (
                        <div className="text-sm text-gray-500">{auction.auction_city}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{auction.car_name}</div>
                      <a 
                        href={auction.car_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        Ver Carro <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{auction.car_year}</TableCell>
                  <TableCell>
                    {auction.auction_date ? new Date(auction.auction_date).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    {auction.bid_value ? `R$ ${auction.bid_value.toLocaleString('pt-BR')}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={auction.bid_accepted ? "default" : "secondary"}>
                      {auction.bid_accepted ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {profitMargin !== null ? (
                      <Badge 
                        variant={parseFloat(profitMargin) > 0 ? "default" : "destructive"}
                        className={parseFloat(profitMargin) > 0 ? "bg-green-500" : ""}
                      >
                        {profitMargin}%
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(auction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEditVehicles && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditAuction(auction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {showDetailsModal && selectedAuction && (
        <AuctionDetailsModal
          auction={selectedAuction}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};

export default AuctionList;
