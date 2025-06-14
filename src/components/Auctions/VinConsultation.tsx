import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import Tesseract from "tesseract.js";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";

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

  const syncFieldsFromResult = (result: any) => {
    const dataFields: Partial<VinResultFields> = {};
    FIELD_MAP.forEach(({ field, sourceField }) => {
      dataFields[field] = extractField(result, field, sourceField);
    });
    setFields((old) => ({ ...old, ...dataFields }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vin) {
      toast({
        title: "Erro",
        description: "Por favor, insira o VIN para consultar.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    setApiResult("");
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
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
      const data = await response.json();
      setApiResult(JSON.stringify(data, null, 2));
      // Extrair dados para campos separados
      if (Array.isArray(data.Results) && data.Results[0]) {
        syncFieldsFromResult(data.Results[0]);
      }
    } catch (error: any) {
      toast({
        title: "Erro na consulta",
        description: error?.message || "Erro desconhecido na API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
  const [marketValue, setMarketValue] = useState<null | { retail: string; trade: string; msrp: string; year: any; make: any; model: any; }> (null);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // Corrigido conforme parâmetros do "Vehicle Market Value" do Admin Panel
  const fetchMarketValue = async () => {
    if (!vin) {
      toast({
        title: "Erro",
        description: "Informe o VIN antes de consultar valor de mercado.",
        variant: "destructive"
      });
      return;
    }
    if (!miles) {
      toast({
        title: "Erro",
        description: "Informe a quilometragem (milhas) do veículo para calcular o valor de mercado.",
        variant: "destructive"
      });
      return;
    }
    setLoadingMarket(true);
    setMarketValue(null);
    try {
      // Pegando parâmetros e endpoint exatamente igual ao testado e que funcionou no Admin
      const url = "https://ctdajbfmgmkhqueskjvk.functions.supabase.co/vehicle-market-value";
      const headers = {
        "Content-Type": "application/json",
      };
      // Parâmetros exatamente como testado: vin, miles. Se seu teste usou 'mileage', altere para mileage aqui
      const body = {
        vin: vin.replace(/\s/g, ""),
        miles: miles.replace(/\s/g, "")
      };

      // Caso no teste você tenha usado "mileage" ao invés de "miles", troque a linha acima por:
      // const body = { vin: vin.replace(/\s/g, ""), mileage: miles.replace(/\s/g, "") };

      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      const data = await resp.json();

      // Ajuda no diagnóstico: logar resposta bruta também como faz o Admin
      console.log("[VinConsultation] Resposta valor de mercado (igual Admin):", data);

      if (data?.status !== "SUCCESS") {
        throw new Error(data?.error || data?.message || "Erro ao consultar valor de mercado.");
      }
      const valueData = data.data?.values?.[0] || data.data;
      setMarketValue({
        retail: valueData?.retailPrice ? `US$ ${valueData.retailPrice}` : "-",
        trade: valueData?.tradeInFair ? `US$ ${valueData.tradeInFair}` : "-",
        msrp: valueData?.msrp ? `US$ ${valueData.msrp}` : "-",
        year: valueData?.year,
        make: valueData?.make,
        model: valueData?.model,
      });
    } catch (err: any) {
      toast({
        title: "Valor de Mercado",
        description: err?.message || "Erro ao consultar valor de mercado.",
        variant: "destructive"
      });
    } finally {
      setLoadingMarket(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow rounded-lg border animate-fade-in">
      <h2 className="text-xl font-bold mb-1">Consulta de VIN (Leilões)</h2>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            value={vin}
            onChange={e => setVin(e.target.value.toUpperCase())}
            placeholder="Digite ou escaneie o VIN"
            className="font-mono uppercase w-60"
            maxLength={17}
          />
          <Input
            value={miles}
            onChange={e => setMiles(e.target.value.replace(/\D/g, ""))}
            placeholder="Milhas (ex: 55000)"
            className="font-mono w-36"
            maxLength={7}
            inputMode="numeric"
            pattern="\d*"
            title="Milhas do veículo"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            onClick={handlePhotoVin}
            variant="secondary"
            title="Escanear VIN com Câmera"
            disabled={ocrLoading || loading}
          >
            <Camera className="w-5 h-5 mr-2" />
            {ocrLoading ? "Processando..." : "Escanear/Fotografar"}
          </Button>
          <Button
            type="button"
            onClick={fetchMarketValue}
            variant="outline"
            disabled={loadingMarket || !vin || !miles}
            title="Consultar valor de mercado do veículo"
          >
            <Car className="w-5 h-5 mr-2" />
            {loadingMarket ? "Buscando valor..." : "Valor de Mercado"}
          </Button>
          <Button type="submit" disabled={loading || ocrLoading}>
            {loading ? "Consultando..." : "Consultar"}
          </Button>
        </div>
      </form>

      {/* Campos sincronizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELD_MAP.map(({ label, field }) => (
          <div key={field}>
            <Label className="mb-1">{label}</Label>
            <Input
              value={fields[field] || ""}
              readOnly
              className="font-mono"
              placeholder={`-`}
            />
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default VinConsultation;
