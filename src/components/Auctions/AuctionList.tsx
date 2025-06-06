
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
    return <div className="text-center py-4 text-[10px]">Carregando leilões...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-[10px]">
              <TableHead className="text-[10px] py-2 px-2 w-32">Leilão</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-80">Carro</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-16">Ano</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-24">Data</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-24">Valor Lance</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-20">Lance Aceito</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-20">Margem Lucro</TableHead>
              <TableHead className="text-[10px] py-2 px-2 w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions?.map((auction) => {
              const profitMargin = calculateProfitMargin(auction.carfax_value, auction.mmr_value);
              
              return (
                <TableRow key={auction.id} className="text-[10px]">
                  <TableCell className="py-2 px-2">
                    <div>
                      <div className="font-medium text-[10px]">{auction.auction_house}</div>
                      {auction.auction_city && (
                        <div className="text-[8px] text-gray-500">{auction.auction_city}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <div>
                      <div className="font-medium text-[8px] leading-tight">{auction.car_name}</div>
                      <a 
                        href={auction.car_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-[7px] flex items-center gap-1 mt-1"
                      >
                        Ver Carro <ExternalLink className="h-2 w-2" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-2 text-[10px]">{auction.car_year}</TableCell>
                  <TableCell className="py-2 px-2 text-[10px]">
                    {auction.auction_date ? new Date(auction.auction_date).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell className="py-2 px-2 text-[10px]">
                    {auction.bid_value ? `R$ ${auction.bid_value.toLocaleString('pt-BR')}` : '-'}
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <Badge 
                      variant={auction.bid_accepted ? "default" : "secondary"}
                      className="text-[8px] px-1 py-0"
                    >
                      {auction.bid_accepted ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    {profitMargin !== null ? (
                      <Badge 
                        variant={parseFloat(profitMargin) > 0 ? "default" : "destructive"}
                        className={`text-[8px] px-1 py-0 ${parseFloat(profitMargin) > 0 ? "bg-green-500" : ""}`}
                      >
                        {profitMargin}%
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleViewDetails(auction)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {canEditVehicles && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onEditAuction(auction)}
                        >
                          <Edit className="h-3 w-3" />
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
