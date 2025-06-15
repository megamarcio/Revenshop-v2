
import React from "react";
import { useReservaConsulta } from "@/contexts/ReservaConsultaContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ConsultaReservasPage = () => {
  const { result, error, loading, clear, dateRange } = useReservaConsulta();

  if (!result && !loading && !error) return null; // não mostra nada se não há busca

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow flex flex-col gap-3 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Resultados da Consulta de Reservas</h2>
        <Button variant="ghost" size="icon" onClick={clear} title="Fechar resultados">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Filtro aplicado:{" "}
        {dateRange.from ? dateRange.from.toLocaleDateString() : "--"} {" até "}
        {dateRange.to ? dateRange.to.toLocaleDateString() : "--"}
      </div>
      {error && <div className="text-xs text-red-500">{error}</div>}
      {!error && loading && <div className="text-sm">Buscando reservas...</div>}
      {!error && !loading && (
        <div className="rounded border bg-gray-50 overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left font-bold">Reserva</th>
                <th className="p-2 text-left font-bold">Cliente</th>
                <th className="p-2 text-left font-bold">Checkin</th>
                <th className="p-2 text-left font-bold">Checkout</th>
              </tr>
            </thead>
            <tbody>
              {result && result.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Nenhuma reserva encontrada
                  </td>
                </tr>
              )}
              {result &&
                result.map((res, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="p-2">{res.reservation_number}</td>
                    <td className="p-2">{res.customer_name}</td>
                    <td className="p-2">
                      {res.checkin_datetime ? res.checkin_datetime.replace("T", " ").slice(0, 16) : "-"}
                    </td>
                    <td className="p-2">
                      {res.checkout_datetime ? res.checkout_datetime.replace("T", " ").slice(0, 16) : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultaReservasPage;
