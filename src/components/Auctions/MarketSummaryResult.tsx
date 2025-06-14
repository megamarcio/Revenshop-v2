
import React from "react";
import { Car, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketSummaryResultProps {
  mainInfo: string;
  averageMiles: number | null;
  currentMiles: number | null;
  recommendedValue: number | null;
  maxValue: number | null;
  auctionValue: number | null;
  salesPeriod?: string[] | null;
  showAuctionValue: boolean;
  onToggleAuctionValue: () => void;
}

const MarketSummaryResult: React.FC<MarketSummaryResultProps> = ({
  mainInfo,
  averageMiles,
  currentMiles,
  recommendedValue,
  maxValue,
  auctionValue,
  salesPeriod,
  showAuctionValue,
  onToggleAuctionValue,
}) => {
  return (
    <div className="rounded-lg border border-blue-300 shadow-lg p-5 my-4 bg-gradient-to-b from-blue-50 to-white space-y-2 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-1 mb-1">
        <span className="font-bold text-lg flex gap-1 items-center text-blue-900">
          <Car className="w-6 h-6" />
          {mainInfo}
        </span>
        {salesPeriod?.length === 2 && (
          <span className="text-xs ml-2 text-gray-500">
            Período de vendas consultados: {salesPeriod[0]} → {salesPeriod[1]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1">
        <div>
          <div className="text-xs text-gray-500">Milhas médias para ano:</div>
          <div className="font-mono text-blue-600 text-lg">{averageMiles ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Milhas atuais:</div>
          <div className="font-mono text-blue-600 text-lg">{currentMiles ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Valor de venda recomendado:</div>
          <div className="font-mono text-green-700 text-lg">
            {recommendedValue ? `US$ ${recommendedValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "-"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Valor máximo de venda:</div>
          <div className="font-mono text-green-700 text-lg">
            {maxValue ? `US$ ${maxValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "-"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            Valor leilão:
            <button
              className="ml-1 rounded p-1 text-blue-700/60 hover:text-blue-800"
              type="button"
              onClick={onToggleAuctionValue}
              title="Mostrar valor de leilão"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <div className="font-mono text-blue-700 text-lg">
            {showAuctionValue && auctionValue
              ? `US$ ${auctionValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
              : "•••••"}
          </div>
        </div>
        <div>
          {/* Espaço para futuros dados ou gráfico */}
        </div>
      </div>
    </div>
  );
};

export default MarketSummaryResult;
