
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const OpenAIKeyForm = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(true);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setLoadingKeys(true);
      const { data, error } = await supabase.rpc('get_ai_settings');
      
      if (error) {
        console.error('Erro ao carregar chaves:', error);
        return;
      }

      if (data && data.length > 0) {
        setOpenAIKey(data[0].openai_key || '');
        setGeminiKey(data[0].gemini_key || '');
      }
    } catch (error) {
      console.error('Erro ao carregar chaves:', error);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleSaveKeys = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('save_ai_settings', {
        p_image_instructions: '', // Manteremos vazios para não sobrescrever
        p_description_instructions: '',
        p_openai_key: openAIKey || null,
        p_gemini_key: geminiKey || null
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Chaves de API salvas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar chaves:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar as chaves de API',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingKeys) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span>Chaves de API para IA</span>
        </CardTitle>
        <CardDescription>
          Configure as chaves de API para integração com serviços de IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="openai-key">Chave da API OpenAI</Label>
          <div className="relative">
            <Input
              id="openai-key"
              type={showOpenAIKey ? "text" : "password"}
              placeholder="sk-..."
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowOpenAIKey(!showOpenAIKey)}
            >
              {showOpenAIKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Esta chave será armazenada de forma segura no banco de dados
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gemini-key">Chave da API Gemini</Label>
          <div className="relative">
            <Input
              id="gemini-key"
              type={showGeminiKey ? "text" : "password"}
              placeholder="AIza..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowGeminiKey(!showGeminiKey)}
            >
              {showGeminiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Esta chave será armazenada de forma segura no banco de dados
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveKeys} disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar Chaves'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenAIKeyForm;
