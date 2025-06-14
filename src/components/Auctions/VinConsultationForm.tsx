
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Barcode, Image as ImageIcon } from "lucide-react";

interface VinConsultationFormProps {
  vin: string;
  setVin: (vin: string) => void;
  miles: string;
  setMiles: (miles: string) => void;
  handlePhotoVin: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  loading: boolean;
  ocrLoading: boolean;
  summaryLoading: boolean;
}

const VinConsultationForm: React.FC<VinConsultationFormProps> = ({
  vin,
  setVin,
  miles,
  setMiles,
  handlePhotoVin,
  fileInputRef,
  handleFileChange,
  handleSubmit,
  loading,
  ocrLoading,
  summaryLoading,
}) => (
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
        className="flex items-center justify-center gap-0 px-2"
      >
        <Barcode className="w-5 h-5" />
        <ImageIcon className="w-5 h-5" />
      </Button>
      <Button
        type="submit"
        disabled={loading || ocrLoading || summaryLoading}
      >
        {loading || summaryLoading ? "Consultando..." : "Consultar"}
      </Button>
    </div>
  </form>
);

export default VinConsultationForm;
