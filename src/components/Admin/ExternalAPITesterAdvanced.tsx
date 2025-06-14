import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, Download, Plus, Trash, Save } from "lucide-react";
import { parseCurlCommand } from "./useCurlParser";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type KV = { name: string; value: string };

type SavedAPIRequest = {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: KV[];
  query: KV[];
  bodyParams: KV[];
  bodyRaw: string;
  bodyMode: "json" | "form" | "raw";
};

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function cleanKV(params: KV[]) {
  return params.filter(p => p.name.trim());
}

function paramsToObject(params: KV[]) {
  return params.reduce((acc, { name, value }) => name ? { ...acc, [name]: value } : acc, {});
}

function buildQueryString(query: KV[]) {
  const search = cleanKV(query)
    .map(({ name, value }) => encodeURIComponent(name) + "=" + encodeURIComponent(value))
    .join("&");
  return search ? `?${search}` : "";
}

const LS_KEY = "external_api_tester_requests_v2";

function saveToLocal(apiList: SavedAPIRequest[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(apiList));
}
function loadFromLocal(): SavedAPIRequest[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

const ExternalAPITesterAdvanced: React.FC = () => {
  const [apiName, setApiName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<KV[]>([{ name: "", value: "" }]);
  const [queryParams, setQueryParams] = useState<KV[]>([{ name: "", value: "" }]);
  const [bodyParams, setBodyParams] = useState<KV[]>([{ name: "", value: "" }]);
  const [bodyRaw, setBodyRaw] = useState("");
  const [bodyMode, setBodyMode] = useState<"json" | "form" | "raw">("json");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedAPIRequest[]>(loadFromLocal());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [importCurlOpen, setImportCurlOpen] = useState(false);
  const [curlInput, setCurlInput] = useState("");

  function handleAddRow(setter: React.Dispatch<React.SetStateAction<KV[]>>) {
    setter(arr => [...arr, { name: "", value: "" }]);
  }
  function handleRemoveRow(idx: number, setter: React.Dispatch<React.SetStateAction<KV[]>>) {
    setter(arr => arr.length <= 1 ? arr : arr.filter((_, i) => i !== idx));
  }
  function handleChange(idx: number, field: keyof KV, value: string, setter: React.Dispatch<React.SetStateAction<KV[]>>) {
    setter(arr => arr.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  }

  function handleSave() {
    if (!apiName.trim()) {
      toast({ title: "Campo obrigatório", description: "Informe um nome para a API!", variant: "destructive" });
      return;
    }
    if (!url.trim()) {
      toast({ title: "Campo obrigatório", description: "Informe a URL!", variant: "destructive" });
      return;
    }
    const id = selectedId || String(Date.now());
    const api: SavedAPIRequest = {
      id,
      name: apiName,
      url,
      method,
      headers,
      query: queryParams,
      bodyParams,
      bodyRaw,
      bodyMode,
    };
    let updated = saved.filter(r => r.id !== id);
    updated.push(api);
    saveToLocal(updated);
    setSaved(updated);
    setSelectedId(id);
    toast({ title: "Parâmetros salvos com sucesso!" });
  }

  function handleLoad(id: string) {
    const api = saved.find(r => r.id === id);
    if (!api) return;
    setApiName(api.name);
    setUrl(api.url);
    setMethod(api.method);
    setHeaders(api.headers.length ? api.headers : [{ name: "", value: "" }]);
    setQueryParams(api.query.length ? api.query : [{ name: "", value: "" }]);
    setBodyParams(api.bodyParams.length ? api.bodyParams : [{ name: "", value: "" }]);
    setBodyRaw(api.bodyRaw || "");
    setBodyMode(api.bodyMode || "json");
    setSelectedId(id);
  }

  function handleDelete(id: string) {
    const updated = saved.filter(r => r.id !== id);
    saveToLocal(updated);
    setSaved(updated);
    if (selectedId === id) handleClear();
  }

  function handleClear() {
    setApiName("");
    setUrl("");
    setMethod("GET");
    setHeaders([{ name: "", value: "" }]);
    setQueryParams([{ name: "", value: "" }]);
    setBodyParams([{ name: "", value: "" }]);
    setBodyRaw("");
    setBodyMode("json");
    setResponse("");
    setSelectedId(null);
  }

  async function handleTestAPI(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast({ title: "Campo obrigatório", description: "Informe a URL da API!", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResponse("");
    let finalUrl = url.trim();
    const query = buildQueryString(queryParams);
    if (query) {
      finalUrl += query;
    }
    let reqHeaders = cleanKV(headers).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
    let options: RequestInit = {
      method,
      headers: reqHeaders,
    };

    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      if (bodyMode === "json") {
        const bodyObj = paramsToObject(bodyParams);
        if (Object.keys(bodyObj).length) {
          options.body = JSON.stringify(bodyObj);
          if (!reqHeaders["Content-Type"]) reqHeaders["Content-Type"] = "application/json";
        }
      } else if (bodyMode === "form") {
        const raw = cleanKV(bodyParams)
          .map(({ name, value }) => encodeURIComponent(name) + "=" + encodeURIComponent(value))
          .join("&");
        if (raw) {
          options.body = raw;
          if (!reqHeaders["Content-Type"]) reqHeaders["Content-Type"] = "application/x-www-form-urlencoded";
        }
      } else if (bodyMode === "raw") {
        if (bodyRaw.trim()) options.body = bodyRaw;
      }
    }

    try {
      const res = await fetch(finalUrl, options);
      let text = await res.text();
      try {
        text = JSON.stringify(JSON.parse(text), null, 2);
      } catch { }
      setResponse(text);
      toast({ title: "Requisição enviada!", description: `Status: ${res.status}` });
    } catch (err: any) {
      setResponse(String(err));
      toast({ title: "Erro", description: err?.message || "Erro desconhecido.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function handleImportCurl() {
    if (!curlInput.trim()) {
      toast({ title: "Cole um comando cURL!", variant: "destructive" });
      return;
    }
    const parsed = parseCurlCommand(curlInput);
    if (!parsed) {
      toast({ title: "Comando cURL inválido", description: "Verifique o comando informado.", variant: "destructive" });
      return;
    }
    setUrl(parsed.url || "");
    setMethod(parsed.method || "GET");
    setHeaders(parsed.headers.length ? parsed.headers : [{ name: "", value: "" }]);
    // Faz parsing de query se houver na url
    const qParams: KV[] = [];
    if (parsed.url.includes("?")) {
      const qStr = parsed.url.split("?")[1].split("#")[0];
      qStr.split("&").forEach(pair => {
        const [k, v] = pair.split("=");
        if (k) qParams.push({ name: decodeURIComponent(k), value: decodeURIComponent(v || "") });
      });
      setQueryParams(qParams.length ? qParams : [{ name: "", value: "" }]);
    }
    // Tenta identificar formato do body
    if (parsed.body) {
      setBodyRaw(parsed.body);
      try {
        JSON.parse(parsed.body);
        setBodyMode("json");
        // Extraia campos para o modo json (Name/Value)
        const obj = JSON.parse(parsed.body);
        if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
          setBodyParams(
            Object.entries(obj).map(([name, value]) => ({
              name: String(name),
              value: typeof value === "string" ? value : JSON.stringify(value),
            }))
          );
        }
      } catch {
        setBodyMode("raw");
      }
    }
    setImportCurlOpen(false);
    toast({ title: "Comando cURL importado com sucesso!" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          HTTP Request (N8N Style)
        </CardTitle>
        <CardDescription>
          Monte requisições HTTP customizadas, com Headers, Query/Body Parameters, método e nome da API.<br />
          <span className="text-xs text-muted-foreground">
            Adapte cada requisição conforme sua necessidade, salve e recarregue facilmente.<br />
            <b>Agora também é possível importar comandos cURL!</b>
          </span>
        </CardDescription>
        {/* Botão Importar cURL */}
        <div className="mt-3 flex">
          <Dialog open={importCurlOpen} onOpenChange={setImportCurlOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                Importar cURL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar comando cURL</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="curl-input" className="mb-2">Cole aqui o comando cURL</Label>
                <Textarea
                  id="curl-input"
                  value={curlInput}
                  onChange={e => setCurlInput(e.target.value)}
                  rows={4}
                  placeholder="curl -X POST https://api.exemplo.com -H 'Authorization: Bearer ...' -d '{\"key\":\"value\"}'"
                  className="font-mono text-xs mt-2"
                />
              </div>
              <DialogFooter className="mt-2">
                <Button type="button" onClick={handleImportCurl}>Importar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Salvos */}
        <div className="mb-3">
          {saved.length > 0 && (
            <>
              <Label className="mb-1">APIs Salvas: </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {saved.map((api) => (
                  <div key={api.id} className={`flex items-center gap-1 px-3 py-1 rounded bg-gray-100 border ${selectedId === api.id ? "border-blue-500" : ""}`}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoad(api.id)}
                      className="px-2 py-1 h-auto text-xs"
                    >
                      {api.name}
                      <Download className="ml-1 w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      title="Excluir"
                      onClick={() => handleDelete(api.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <form onSubmit={handleTestAPI} className="space-y-4">
          <div>
            <Label className="mb-1">Nome da API *</Label>
            <Input
              value={apiName}
              onChange={e => setApiName(e.target.value)}
              placeholder="Informe um nome amigável para esta API"
              maxLength={50}
              className="mb-2"
              required
            />
          </div>
          <div>
            <Label className="mb-2">URL da API *</Label>
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              type="url"
              placeholder="https://api.exemplo.com/..."
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-[110px]">
              <Label>Método</Label>
              <select
                className="border px-2 py-1 rounded w-full"
                value={method}
                onChange={e => setMethod(e.target.value)}
              >
                {HTTP_METHODS.map(m => <option value={m} key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Query Parameters */}
          <div>
            <Label>Query Parameters</Label>
            {queryParams.map((param, idx) => (
              <div key={idx} className="flex gap-2 mt-1">
                <Input
                  placeholder="Name"
                  value={param.name}
                  onChange={e => handleChange(idx, "name", e.target.value, setQueryParams)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={e => handleChange(idx, "value", e.target.value, setQueryParams)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRow(idx, setQueryParams)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleAddRow(setQueryParams)}
            >
              <Plus className="w-4 h-4" /> Adicionar parâmetro
            </Button>
          </div>

          {/* Headers */}
          <div>
            <Label>Headers</Label>
            {headers.map((param, idx) => (
              <div key={idx} className="flex gap-2 mt-1">
                <Input
                  placeholder="Name"
                  value={param.name}
                  onChange={e => handleChange(idx, "name", e.target.value, setHeaders)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={e => handleChange(idx, "value", e.target.value, setHeaders)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRow(idx, setHeaders)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleAddRow(setHeaders)}
            >
              <Plus className="w-4 h-4" /> Adicionar header
            </Button>
          </div>

          {/* Body */}
          {["POST", "PUT", "PATCH"].includes(method) && (
            <div>
              <Label>Body Content</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  size="sm"
                  variant={bodyMode === "json" ? "default" : "outline"}
                  onClick={() => setBodyMode("json")}
                >JSON</Button>
                <Button
                  type="button"
                  size="sm"
                  variant={bodyMode === "form" ? "default" : "outline"}
                  onClick={() => setBodyMode("form")}
                >Form-urlencoded</Button>
                <Button
                  type="button"
                  size="sm"
                  variant={bodyMode === "raw" ? "default" : "outline"}
                  onClick={() => setBodyMode("raw")}
                >Raw</Button>
              </div>
              {/* JSON/FORM */}
              {bodyMode !== "raw" && (
                <>
                  {bodyParams.map((param, idx) => (
                    <div key={idx} className="flex gap-2 mt-1">
                      <Input
                        placeholder="Name"
                        value={param.name}
                        onChange={e => handleChange(idx, "name", e.target.value, setBodyParams)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={param.value}
                        onChange={e => handleChange(idx, "value", e.target.value, setBodyParams)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRow(idx, setBodyParams)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddRow(setBodyParams)}
                  >
                    <Plus className="w-4 h-4" /> Adicionar campo
                  </Button>
                </>
              )}
              {bodyMode === "raw" && (
                <Textarea
                  placeholder="Conteúdo raw do body (texto, JSON, XML, etc)"
                  value={bodyRaw}
                  onChange={e => setBodyRaw(e.target.value)}
                  className="font-mono text-xs mt-2"
                  rows={6}
                />
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="mb-2"
            >
              {loading ? "Enviando..." : "Testar API"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSave}
              className="mb-2"
            >
              <Save className="w-4 h-4 mr-1" /> Salvar parâmetros
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="mb-2"
            >
              Limpar tela
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <Label>Resposta da API:</Label>
          <Textarea
            value={response}
            className="w-full font-mono text-xs bg-gray-100"
            rows={10}
            readOnly
            placeholder="A resposta aparecerá aqui..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalAPITesterAdvanced;
