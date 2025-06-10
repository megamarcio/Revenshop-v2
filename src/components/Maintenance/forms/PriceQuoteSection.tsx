
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ExternalLink, Globe } from 'lucide-react';
import { PartPriceQuote, PARTS_WEBSITES } from '../../../types/maintenance';

interface PriceQuoteSectionProps {
  partId: string;
  partName: string;
  quotes: PartPriceQuote[];
  onAddQuote: (partId: string) => void;
  onUpdateQuote: (partId: string, quoteId: string, field: keyof PartPriceQuote, value: string | number | boolean) => void;
  onRemoveQuote: (partId: string, quoteId: string) => void;
}

const PriceQuoteSection = ({
  partId,
  partName,
  quotes,
  onAddQuote,
  onUpdateQuote,
  onRemoveQuote
}: PriceQuoteSectionProps) => {
  const calculateQuoteTotal = () => {
    return quotes.reduce((sum, quote) => sum + (quote.estimatedPrice || 0), 0);
  };

  const openUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const openMainWebsite = (websiteName: string) => {
    const website = PARTS_WEBSITES.find(w => w.name === websiteName);
    if (website && website.url) {
      window.open(website.url, '_blank');
    }
  };

  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-medium text-blue-800">
          Cotações de Preços - {partName}
        </Label>
        <Button 
          type="button" 
          onClick={() => onAddQuote(partId)} 
          size="sm" 
          variant="outline"
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar Cotação
        </Button>
      </div>

      {quotes.length > 0 && (
        <div className="space-y-2">
          {quotes.map((quote) => {
            return (
              <div key={quote.id} className="grid grid-cols-12 gap-2 items-end bg-white p-2 rounded border">
                <div className="col-span-2">
                  <Label className="text-xs">Site</Label>
                  <Select 
                    value={quote.website} 
                    onValueChange={(value) => {
                      const website = PARTS_WEBSITES.find(w => w.name === value);
                      onUpdateQuote(partId, quote.id, 'website', value);
                      onUpdateQuote(partId, quote.id, 'websiteUrl', website?.url || '');
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTS_WEBSITES.map((website) => (
                        <SelectItem key={website.name} value={website.name} className="text-xs">
                          {website.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-3">
                  <Label className="text-xs">Link da Peça</Label>
                  <Input
                    value={quote.partUrl}
                    onChange={(e) => onUpdateQuote(partId, quote.id, 'partUrl', e.target.value)}
                    placeholder="Cole o link da peça aqui"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-xs">Valor ($)</Label>
                  <Input
                    type="number"
                    value={quote.estimatedPrice || ''}
                    onChange={(e) => onUpdateQuote(partId, quote.id, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="h-8 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="col-span-1">
                  <Label className="text-xs">Comprado</Label>
                  <div className="flex justify-center mt-1">
                    <Checkbox
                      checked={quote.purchased || false}
                      onCheckedChange={(checked) => onUpdateQuote(partId, quote.id, 'purchased', checked)}
                    />
                  </div>
                </div>

                <div className="col-span-4 flex gap-1">
                  {quote.website && (
                    <Button
                      type="button"
                      onClick={() => openMainWebsite(quote.website)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title={`Pesquisar no ${quote.website}`}
                    >
                      <Globe className="h-3 w-3" />
                    </Button>
                  )}
                  {quote.partUrl && (
                    <Button
                      type="button"
                      onClick={() => openUrl(quote.partUrl)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="Abrir link da peça"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => onRemoveQuote(partId, quote.id)}
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    title="Remover cotação"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}

          {quotes.length > 0 && (
            <div className="bg-blue-100 p-2 rounded border text-right">
              <span className="text-xs font-medium text-blue-800">
                Total Estimado: $ {calculateQuoteTotal().toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {quotes.length === 0 && (
        <div className="text-center py-2">
          <span className="text-xs text-gray-500">
            Nenhuma cotação adicionada
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceQuoteSection;
