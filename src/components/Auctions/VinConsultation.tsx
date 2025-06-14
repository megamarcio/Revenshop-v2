import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import Tesseract from "tesseract.js";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const VinConsultation = () => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string>("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
      const data = await response.json();
      setApiResult(JSON.stringify(data, null, 2));
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
      const { data: { text } } = await Tesseract.recognize(file, "eng", { logger: m => {} });
      // Remove tudo que não é letra/número e pega uma possível string de 17 caract.
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
