import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import Tesseract from "tesseract.js";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import { Eye, Barcode, Image as ImageIcon } from "lucide-react";
import MarketSummaryResult from "./MarketSummaryResult";
import VinConsultationForm from "./VinConsultationForm";
import VinConsultationFieldsGrid from "./VinConsultationFieldsGrid";

type VinResultFields = {
  Make: string;
  Model: string;
  Trim: string;
  ModelYear: string;
  Seats: string;
  BasePrice: string;
  ABS: string;
  DisplacementL: string;
  EngineCylinders: string;
  EngineHP: string;
  DriveType: string;
  FuelTypePrimary: string;
  WheelSizeFront: string;
  Turbo: string;
  BodyClass: string;
  TransmissionStyle: string;
  TransmissionSpeeds: string;
  DriveDistribution: string;
  Manufacturer: string;
  Note: string;
};

const FIELD_MAP: { label: string; field: keyof VinResultFields; sourceField?: string; placeholder?: string }[] = [
  { label: "Marca", field: "Make" },
  { label: "Modelo", field: "Model" },
  { label: "Trim", field: "Trim" },
  { label: "Ano", field: "ModelYear" },
  { label: "Lugares", field: "Seats" },
  { label: "Preço Base", field: "BasePrice" },
  { label: "Freio ABS", field: "ABS" },
  { label: "Motorização", field: "DisplacementL" },
  { label: "Cilindros", field: "EngineCylinders" },
  { label: "HP's (cavalos)", field: "EngineHP" },
  { label: "Tração", field: "DriveType", sourceField: "DriveType" },
  { label: "Combustível", field: "FuelTypePrimary" },
  { label: "Roda Aro", field: "WheelSizeFront" },
  { label: "Turbo", field: "Turbo" },
  { label: "Class", field: "BodyClass" },
  { label: "Transmissão", field: "TransmissionStyle" },
  { label: "Qtde de Marchas", field: "TransmissionSpeeds" },
  { label: "Distribuição de Potencia", field: "DriveDistribution", sourceField: "DriveType" },
  { label: "Fabricante", field: "Manufacturer" },
  { label: "Nota", field: "Note" },
];

const extractField = (data: any, field: string, sourceField?: string) =>
  (data?.[sourceField ?? field] ?? "").toString();

const VinConsultation = () => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string>("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [fields, setFields] = useState<VinResultFields>({
    Make: "",
    Model: "",
    Trim: "",
    ModelYear: "",
    Seats: "",
    BasePrice: "",
    ABS: "",
    DisplacementL: "",
    EngineCylinders: "",
    EngineHP: "",
    DriveType: "",
    FuelTypePrimary: "",
    WheelSizeFront: "",
    Turbo: "",
    BodyClass: "",
    TransmissionStyle: "",
    TransmissionSpeeds: "",
    DriveDistribution: "",
    Manufacturer: "",
    Note: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [miles, setMiles] = useState("");
  const [showAuctionValue, setShowAuctionValue] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [marketSummary, setMarketSummary] = useState<null | {
    mainInfo: string;
    averageMiles: number | null;
    currentMiles: number | null;
    recommendedValue: number | null;
    maxValue: number | null;
    auctionValue: number | null;
    salesPeriod?: string[] | null;
  }>(null);

  const syncFieldsFromResult = (result: any) => {
    const dataFields: Partial<VinResultFields> = {};
    FIELD_MAP.forEach(({ field, sourceField }) => {
      dataFields[field] = extractField(result, field, sourceField);
    });
    setFields((old) => ({ ...old, ...dataFields }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSummaryLoading(true);
    setApiResult("");
    setMarketValueRaw("");
    setMarketSummary(null);
    setMarketValue(null);

    if (!vin) {
      toast({
        title: "Erro",
        description: "Por favor, insira o VIN para consultar.",
        variant: "destructive"
      });
      setSummaryLoading(false);
      return;
    }
    setLoading(true);
    setFields({
      Make: "",
      Model: "",
      Trim: "",
      ModelYear: "",
      Seats: "",
      BasePrice: "",
      ABS: "",
      DisplacementL: "",
      EngineCylinders: "",
      EngineHP: "",
      DriveType: "",
      FuelTypePrimary: "",
      WheelSizeFront: "",
      Turbo: "",
      BodyClass: "",
      TransmissionStyle: "",
      TransmissionSpeeds: "",
      DriveDistribution: "",
      Manufacturer: "",
      Note: "",
    });
    try {
      // VIN API
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
      const data = await response.json();
      setApiResult(JSON.stringify(data, null, 2));
      if (Array.isArray(data.Results) && data.Results[0]) {
        syncFieldsFromResult(data.Results[0]);
      }
    } catch (error: any) {
      toast({
        title: "Erro na consulta",
        description: error?.message || "Erro desconhecido na API",
        variant: "destructive"
      });
      setLoading(false);
      setSummaryLoading(false);
      return;
    }
    setLoading(false);
    // Só consulta valor de mercado se milhas preenchidas
    if (!miles) {
      setSummaryLoading(false);
      return;
    }
    await fetchMarketValueSummary();
    setSummaryLoading(false);
  };

  const handlePhotoVin = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng", { logger: () => {} });
      const vinExtracted = (text.match(/([A-HJ-NPR-Z0-9]{17})/gi) || [])[0]?.toUpperCase() || "";
      if (!vinExtracted) {
        toast({
          title: "VIN não encontrado",
          description: "Não foi possível extrair um VIN válido da foto.",
          variant: "destructive"
        });
      }
      setVin(vinExtracted || "");
      if (vinExtracted) {
        toast({
          title: "VIN detectado",
          description: vinExtracted,
        });
        // Dispara a busca automática ao detectar VIN pela foto
        setTimeout(() => {
          handleSubmit();
        }, 200); // delay leve para atualizaçao do input antes da consulta
      }
    } catch (err: any) {
      toast({
        title: "Erro ao analisar imagem",
        description: err?.message || "Erro desconhecido de OCR",
        variant: "destructive"
      });
    } finally {
      setOcrLoading(false);
    }
  };

  // Novo estado valor de mercado e loading
  const [marketValue, setMarketValue] = useState<null | { retail: string; trade: string; msrp: string; year: any; make: any; model: any; }> (null);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [marketValueRaw, setMarketValueRaw] = useState<string>("");

  // ATUALIZAÇÃO: Agora busca do valor de mercado usa o mesmo formato do Admin -> API Externas
  const fetchMarketValueSummary = async () => {
    if (!vin || !miles) return;
    setLoadingMarket(true);
    setMarketValueRaw("");
    setMarketSummary(null);
    try {
      // Monta URL com queries
      const url = `https://vehicle-market-value.p.rapidapi.com/vmv?vin=${encodeURIComponent(vin)}&mileage=${encodeURIComponent(miles)}&period=180`;

      const headers = {
        "x-rapidapi-host": "vehicle-market-value.p.rapidapi.com",
        "x-rapidapi-key": "09e8d21b70msh49da81e6613134ap11ca1djsn116d32450e77"
      };

      const resp = await fetch(url, {
        method: "GET",
        headers
      });
      const data = await resp.json();

      // Salvar resposta bruta no campo de resposta bruta
      setMarketValueRaw(JSON.stringify(data, null, 2));

      // Adaptação: pega informações principais se existirem
      // O formato pode variar conforme resposta da RapidAPI
      const valueData = data.data?.values?.[0] || data.data;
      setMarketValue({
        retail: valueData?.retailPrice ? `US$ ${valueData.retailPrice}` : "-",
        trade: valueData?.tradeInFair ? `US$ ${valueData.tradeInFair}` : "-",
        msrp: valueData?.msrp ? `US$ ${valueData.msrp}` : "-",
        year: valueData?.year ?? "-",
        make: valueData?.make ?? "-",
        model: valueData?.model ?? "-",
      });

      if (
        typeof valueData === "object" &&
        valueData !== null &&
        (valueData?.average || valueData?.input)
      ) {
        // Extrai campos para o resumo: médias e valores
        setMarketSummary({
          mainInfo: [
            valueData?.make || fields.Make,
            valueData?.model || fields.Model,
            valueData?.trim || fields.Trim,
            valueData?.year || fields.ModelYear
          ].filter(Boolean).join(" "),
          averageMiles: valueData?.average ?? null,
          currentMiles: valueData?.input ?? (miles ? +miles : null),
          recommendedValue: valueData?.average ?? null,
          maxValue: valueData?.above ?? null,
          auctionValue: valueData?.below ?? null,
          salesPeriod: valueData?.sales_period ?? null
        });
      } else {
        setMarketSummary(null);
      }
    } catch (err: any) {
      toast({
        title: "Valor de Mercado",
        description: err?.message || "Erro ao consultar valor de mercado.",
        variant: "destructive"
      });
      setMarketSummary(null);
    } finally {
      setLoadingMarket(false);
    }
  };

  // handler do olhinho (exibir/ocultar valor leilao)
  const toggleAuctionValue = () => setShowAuctionValue((v) => !v);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow rounded-lg border animate-fade-in">
      <h2 className="text-xl font-bold mb-1">Consulta de VIN (Leilões)</h2>

      {/* Novo formulário isolado em componente */}
      <VinConsultationForm
        vin={vin}
        setVin={setVin}
        miles={miles}
        setMiles={setMiles}
        handlePhotoVin={handlePhotoVin}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        loading={loading}
        ocrLoading={ocrLoading}
        summaryLoading={summaryLoading}
      />

      {/* Market summary bonito, permanece igual */}
      {marketSummary && (
        <>
          <div className="my-6">
            <hr className="mb-3 border-blue-200" />
            <h3 className="text-lg font-semibold mb-2 text-blue-900 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Resumo do Valor de Mercado
            </h3>
            <MarketSummaryResult
              mainInfo={marketSummary.mainInfo}
              averageMiles={marketSummary.averageMiles}
              currentMiles={marketSummary.currentMiles}
              recommendedValue={marketSummary.recommendedValue}
              maxValue={marketSummary.maxValue}
              auctionValue={marketSummary.auctionValue}
              salesPeriod={marketSummary.salesPeriod}
              showAuctionValue={showAuctionValue}
              onToggleAuctionValue={toggleAuctionValue}
            />
          </div>
        </>
      )}

      {/* Grid dos campos sincronizados isolado em componente */}
      <VinConsultationFieldsGrid fields={fields} />

      {marketValue && (
        <div className="bg-blue-50 p-4 rounded mt-2 border">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Car className="w-4 h-4" /> Valor de Mercado:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><span className="font-semibold">Retail:</span> {marketValue.retail}</div>
            <div><span className="font-semibold">Trade-in:</span> {marketValue.trade}</div>
            <div><span className="font-semibold">MSRP:</span> {marketValue.msrp}</div>
            <div>
              <span className="font-semibold">Ano/Marca/Modelo:</span>{" "}
              {marketValue.year || "-"} / {marketValue.make || "-"} / {marketValue.model || "-"}
            </div>
          </div>
        </div>
      )}

      <div>
        <Label className="mb-1">Resultado completo do VIN:</Label>
        <Textarea
          value={apiResult}
          rows={16}
          className="w-full font-mono text-xs h-52"
          placeholder="O resultado bruto da API aparecerá aqui para copiar e colar."
          readOnly
        />
      </div>
      <div>
        <Label className="mb-1">Resultado completo do Valor de Mercado:</Label>
        <Textarea
          value={marketValueRaw}
          rows={12}
          className="w-full font-mono text-xs h-44"
          placeholder="A resposta bruta da API de Valor de Mercado aparecerá aqui para copiar e colar."
          readOnly
        />
      </div>
    </div>
  );
};

export default VinConsultation;
