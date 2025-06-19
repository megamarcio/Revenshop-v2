
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays } from "lucide-react";

interface DateTypeSelectorProps {
  dateType: "pick_up_date" | "return_date";
  onDateTypeChange: (type: "pick_up_date" | "return_date") => void;
}

const DateTypeSelector: React.FC<DateTypeSelectorProps> = ({
  dateType,
  onDateTypeChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Filtrar por:</label>
      <Select value={dateType} onValueChange={onDateTypeChange}>
        <SelectTrigger className="w-[200px]">
          {dateType === "pick_up_date" ? (
            <Calendar className="h-4 w-4 mr-2" />
          ) : (
            <CalendarDays className="h-4 w-4 mr-2" />
          )}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pick_up_date">Data de Check-in</SelectItem>
          <SelectItem value="return_date">Data de Return</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateTypeSelector;
