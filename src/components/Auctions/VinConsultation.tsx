
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import Tesseract from "tesseract.js";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

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
};

const FIELD_MAP: { label: string; field: keyof VinResultFields; placeholder?: string }[] = [
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
  { label: "Tração", field: "DriveType" },
  { label: "Combustível", field: "FuelTypePrimary" },
  { label: "Roda Aro", field: "WheelSizeFront" },
  { label: "Turbo", field: "Turbo" },
];

const extractField = (data: any, field: string) =>
  (data?.[field] ?? "").toString();

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
    Turbo: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncFieldsFromResult = (result: any) => {
    const dataFields: Partial<VinResultFields> = {};
    FIELD_MAP.forEach(({ field }) => {
      dataFields[field] = extractField(result, field);
    });
    setFields(old => ({ ...old, ...dataFields }));
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
      Turbo: ""
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow rounded-lg border animate-fade-in">
      <h2 className="text-xl font-bold mb-1">Consulta de VIN (Leilões)</h2>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center">
          <Input
            value={vin}
            onChange={e => setVin(e.target.value.toUpperCase())}
            placeholder="Digite ou escaneie o VIN"
            className="font-mono uppercase"
            maxLength={17}
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

