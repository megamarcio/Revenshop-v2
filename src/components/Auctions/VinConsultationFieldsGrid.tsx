
import React from "react";
import { Input } from "@/components/ui/input";
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

interface VinConsultationFieldsGridProps {
  fields: VinResultFields;
}

const VinConsultationFieldsGrid: React.FC<VinConsultationFieldsGridProps> = ({ fields }) => {
  return (
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
  );
};

export default VinConsultationFieldsGrid;
