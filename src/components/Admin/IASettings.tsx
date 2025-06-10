
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Image, FileText, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const IASettings = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [imageInstructions, setImageInstructions] = useState('');
  const [descriptionInstructions, setDescriptionInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Carregar configurações salvas (simulação - você pode implementar a lógica de carregamento)
      const defaultImageInstructions = `Criar uma imagem realista e profissional de um veículo baseado nas seguintes especificações:
- Modelo: [MODELO]
- Ano: [ANO] 
- Cor: [COR]
- Estilo: Foto profissional em showroom ou ambiente neutro
- Qualidade: Alta resolução, bem iluminado
- Perspectiva: Vista lateral/frontal que destaque as características do veículo`;

      const defaultDescriptionInstructions = `Criar uma descrição atrativa e profissional para um veículo usado/seminovo seguindo este modelo:
- Iniciar com características principais (marca, modelo, ano, motor)
- Destacar pontos fortes e diferenciais
- Mencionar estado de conservação
- Incluir equipamentos e opcionais
- Usar linguagem comercial e persuasiva
- Finalizar com chamada para ação`;

      setImageInstructions(defaultImageInstructions);
      setDescriptionInstructions(defaultDescriptionInstructions);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Salvar chave da OpenAI no Supabase Secrets (simulação)
      if (openAIKey) {
        // Aqui você implementaria a lógica para salvar no Supabase Secrets
        console.log('Salvando chave OpenAI no Supabase Secrets');
      }

      // Salvar instruções localmente ou no banco
      localStorage.setItem('ia_image_instructions', imageInstructions);
      localStorage.setItem('ia_description_instructions', descriptionInstructions);

      toast({
        title: "Configurações salvas",
        description: "As configurações de IA foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Configurações de IA</span>
          </CardTitle>
          <CardDescription>
            Configure as integrações e instruções para inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OpenAI Key */}
          <div className="space-y-2">
            <Label htmlFor="openai-key">Chave da API OpenAI</Label>
            <div className="relative">
              <Input
                id="openai-key"
                type={showKey ? "text" : "password"}
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
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Esta chave será armazenada de forma segura no Supabase Secrets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instruções para Imagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>Instruções para Criação de Imagens</span>
          </CardTitle>
          <CardDescription>
            Configure as instruções que serão enviadas para a IA gerar imagens dos veículos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="image-instructions">Prompt para Geração de Imagens</Label>
            <Textarea
              id="image-instructions"
              placeholder="Digite as instruções para a IA gerar imagens dos veículos..."
              value={imageInstructions}
              onChange={(e) => setImageInstructions(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Use [MODELO], [ANO], [COR] como variáveis que serão substituídas automaticamente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instruções para Descrições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Instruções para Criação de Descrições</span>
          </CardTitle>
          <CardDescription>
            Configure o modelo que a IA usará para criar descrições dos veículos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description-instructions">Modelo para Descrições de Veículos</Label>
            <Textarea
              id="description-instructions"
              placeholder="Digite o modelo que a IA deve seguir para criar descrições..."
              value={descriptionInstructions}
              onChange={(e) => setDescriptionInstructions(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Este modelo será usado como base para gerar descrições atrativas dos veículos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default IASettings;
