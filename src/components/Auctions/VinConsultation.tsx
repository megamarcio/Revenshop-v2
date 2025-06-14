import React, { useState, useRef, useEffect } from "react";
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

type VinCachedResult = {
  vin: string;
  fields: VinResultFields;
  apiResult: string;
  date: number;
  miles: string;
  marketValueRaw: string;
  marketSummary: any;
  marketValue: any;
};

const LOCAL_STORAGE_KEY = "vinConsultationHistoryV2"; // Versão para reset futuro

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
  const [vinHistory, setVinHistory] = useState<VinCachedResult[]>([]);

  // Carrega histórico ao montar componente
  useEffect(() => {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      setVinHistory(JSON.parse(item));
    }
  }, []);

  // Função para salvar novo resultado no histórico
  const saveVinToHistory = (vinData: VinCachedResult) => {
    let history = [vinData, ...vinHistory.filter(h => h.vin !== vinData.vin)];
    history = history.slice(0, 10);
    setVinHistory(history);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  };

  // Novo: restaurar dados de um histórico salvo
  const restoreVinFromHistory = (vinCached: VinCachedResult) => {
    setVin(vinCached.vin);
    setFields(vinCached.fields);
    setApiResult(vinCached.apiResult);
    setMiles(vinCached.miles);
    setMarketValueRaw(vinCached.marketValueRaw);
    setMarketValue(vinCached.marketValue);
    setMarketSummary(vinCached.marketSummary);
  };

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

    // Novo: Checar histórico antes de chamar API!
    const cached = vinHistory.find(h => h.vin === vin && h.miles === miles);
    if (cached) {
      restoreVinFromHistory(cached);
      toast({
        title: "Consulta rápida!",
        description: "Resultado carregado do histórico local.",
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
    let apiData = "";
    let vinApiFields: any = null;

    try {
      // VIN API
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
      const data = await response.json();
      apiData = JSON.stringify(data, null, 2);
      vinApiFields = data?.Results?.[0];
      setApiResult(apiData);
      if (vinApiFields) {
        syncFieldsFromResult(vinApiFields);
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
    let mktSummary = null;
    let mktValue = null;
    let mktValueRaw = "";

    // Só consulta valor de mercado se milhas preenchidas
    if (!miles) {
      setSummaryLoading(false);
      // Salva no histórico já (com market vazio)
      saveVinToHistory({
        vin,
        fields: { ...fields, ...(vinApiFields ? FIELD_MAP.reduce((acc, { field, sourceField }) => ({ ...acc, [field]: extractField(vinApiFields, field, sourceField) }), {}) : {}) },
        apiResult: apiData,
        date: Date.now(),
        miles,
        marketValueRaw: "",
        marketSummary: null,
        marketValue: null,
      });
      return;
    }

    // Market value
    try {
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

      mktValueRaw = JSON.stringify(data, null, 2);
      // Adaptação: pega informações principais se existirem
      const valueData = data.data?.values?.[0] || data.data;
      mktValue = {
        retail: valueData?.retailPrice ? `US$ ${valueData.retailPrice}` : "-",
        trade: valueData?.tradeInFair ? `US$ ${valueData.tradeInFair}` : "-",
        msrp: valueData?.msrp ? `US$ ${valueData.msrp}` : "-",
        year: valueData?.year ?? "-",
        make: valueData?.make ?? "-",
        model: valueData?.model ?? "-",
      };
      if (
        typeof valueData === "object" &&
        valueData !== null &&
        (valueData?.average || valueData?.input)
      ) {
        mktSummary = {
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
        };
      } else {
        mktSummary = null;
      }
      setMarketValueRaw(mktValueRaw);
      setMarketValue(mktValue);
      setMarketSummary(mktSummary);
    } catch (err: any) {
      toast({
        title: "Valor de Mercado",
        description: err?.message || "Erro ao consultar valor de mercado.",
        variant: "destructive"
      });
      setMarketSummary(null);
    } finally {
      setSummaryLoading(false);
      // Salva histórico completo (vin + miles + market)
      saveVinToHistory({
        vin,
        fields: { ...fields, ...(vinApiFields ? FIELD_MAP.reduce((acc, { field, sourceField }) => ({ ...acc, [field]: extractField(vinApiFields, field, sourceField) }), {}) : {}) },
        apiResult: apiData,
        date: Date.now(),
        miles,
        marketValueRaw: mktValueRaw,
        marketSummary: mktSummary,
        marketValue: mktValue,
      });
    }
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
  const [marketValue, setMarketValue] = useState<null | { retail: string; trade: string; msrp: string; year: any; make: any; model: any; }>(null);
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

      {/* Formulário e resumo ficam juntos para destacar! */}
      <div>
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

        {/* Histórico VINs */}
        {vinHistory.length > 0 && (
          <div className="mt-3">
            <div className="text-xs mb-1 font-semibold text-gray-600">
              Últimos VINs pesquisados:
            </div>
            <div className="flex flex-wrap gap-2">
              {vinHistory.map(hist => (
                <button
                  key={`${hist.vin}-${hist.miles}`}
                  className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-300 transition text-xs font-mono border border-blue-300"
                  onClick={() => restoreVinFromHistory(hist)}
                  title={`Ver dados deste VIN (${hist.vin}${hist.miles ? " - " + hist.miles + " mi" : ""})`}
                  type="button"
                >
                  {hist.vin}{hist.miles ? ` (${hist.miles} mi)` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resumão destacado vem IMEDIATAMENTE após o botão Consultar */}
        {marketSummary && (
          <div className="mt-4">
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
        )}
      </div>

      {/* Grid dos campos sincronizados - detalhes do VIN */}
      <VinConsultationFieldsGrid fields={fields} />

      {/* Valor de mercado detalhado, logo abaixo do grid dos campos */}
      {marketValue && (
        <div className="bg-blue-50 p-4 rounded mt-2 border border-blue-200 shadow">
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

      {/* Resultado bruto VIN */}
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

      {/* Resultado bruto valor de mercado */}
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
