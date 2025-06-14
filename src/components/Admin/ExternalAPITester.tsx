
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

const DEFAULT_METHOD = "GET" as const;

const tryParseJson = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return undefined;
  }
};

const ExternalAPITester: React.FC = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<string>(DEFAULT_METHOD);
  const [headersInput, setHeadersInput] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [bodyInput, setBodyInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleTestAPI = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast({
        title: "Informe a URL!",
        description: "Por favor, informe a URL da API externa.",
        variant: "destructive"
      });
      return;
    }

    let headers: Record<string, string> = {};
    let body: any = undefined;

    // Parse headers
    if (headersInput.trim()) {
      const parsed = tryParseJson(headersInput.trim());
      if (!parsed || typeof parsed !== "object") {
        toast({
          title: "Headers inválidos",
          description: "Headers devem estar em formato JSON.",
          variant: "destructive"
        });
        return;
      }
      headers = parsed;
    }

    // Parse body (for POST/PUT only)
    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      if (bodyInput.trim()) {
        const parsed = tryParseJson(bodyInput.trim());
        if (!parsed || typeof parsed !== "object") {
          toast({
            title: "Body inválido",
            description: "O body informado deve estar em JSON válido.",
            variant: "destructive"
          });
          return;
        }
        body = JSON.stringify(parsed);
      }
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(url.trim(), {
        method,
        headers,
        body,
      });

      let text = await res.text();
      // Try pretty JSON
      try {
        text = JSON.stringify(JSON.parse(text), null, 2);
      } catch {}
      setResponse(text);

      toast({
        title: "Requisição realizada!",
        description: `Status: ${res.status}`,
      });
    } catch (err: any) {
      setResponse(String(err));
      toast({
        title: "Erro ao chamar API",
        description: err?.message || "Erro desconhecido.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Teste e Integração de APIs Externas
        </CardTitle>
        <CardDescription>
          Faça requisições de teste a APIs externas para desenvolvimento ou integração.<br />
          <span className="text-xs text-muted-foreground">Preencha o endereço, método HTTP, headers e body se necessário.</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTestAPI} className="space-y-4">
          <div>
            <Label className="mb-2">URL da API</Label>
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              type="url"
              placeholder="https://api.exemplo.com/..."
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Método</Label>
              <select
                className="border px-2 py-1 rounded w-full"
                value={method}
                onChange={e => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="flex-1">
              <Label>Headers (JSON)</Label>
              <Textarea
                value={headersInput}
                onChange={e => setHeadersInput(e.target.value)}
                rows={4}
                className="font-mono text-xs"
                placeholder='{"Authorization": "Bearer ..."}'
                style={{ minHeight: 80 }}
              />
            </div>
          </div>
          <div>
            <Label>Body (JSON, opcional)</Label>
            <Textarea
              value={bodyInput}
              onChange={e => setBodyInput(e.target.value)}
              rows={4}
              className="font-mono text-xs"
              placeholder='{"key": "value"}'
              style={{ minHeight: 80 }}
              disabled={method === "GET" || method === "DELETE"}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Testar API"}
          </Button>
        </form>

        <div className="mt-6">
          <Label>Resposta da API:</Label>
          <Textarea
            value={response}
            rows={8}
            className="w-full font-mono text-xs bg-gray-100"
            readOnly
            placeholder="A resposta aparecerá aqui..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalAPITester;
