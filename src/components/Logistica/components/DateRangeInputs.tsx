
import React from "react";
import { Input } from "@/components/ui/input";

interface DateRangeInputsProps {
  dataInicio: string;
  setDataInicio: (val: string) => void;
  dataFim: string;
  setDataFim: (val: string) => void;
}

const DateRangeInputs: React.FC<DateRangeInputsProps> = ({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div>
        <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">
          Data Inicial
        </label>
        <Input 
          type="date" 
          id="dataInicio" 
          value={dataInicio} 
          onChange={e => setDataInicio(e.target.value)} 
          className="w-[210px]" 
          required 
        />
      </div>
      <div>
        <label htmlFor="dataFim" className="block text-sm font-medium mb-1">
          Data Final
        </label>
        <Input 
          type="date" 
          id="dataFim" 
          value={dataFim} 
          onChange={e => setDataFim(e.target.value)} 
          className="w-[210px]" 
          required 
        />
      </div>
    </div>
  );
};

export default DateRangeInputs;
