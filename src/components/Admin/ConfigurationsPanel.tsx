import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, MessageCircle, Users, Mail, ExternalLink, Code } from 'lucide-react';
import IASettings from './IASettings';
import WhatsAppIntegration from './WhatsAppIntegration';
import EmailSettings from './EmailSettings';
import ExternalAPITester from './ExternalAPITester';
import ExternalAPITesterAdvanced from "./ExternalAPITesterAdvanced";
import APITester from './APITester';

interface ConfigurationsPanelProps {
  onNavigateToUsers: () => void;
}

const ConfigurationsPanel = ({ onNavigateToUsers }: ConfigurationsPanelProps) => {
  const { canAccessAdmin } = useAuth();

  if (!canAccessAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-600">Acesso Negado</h2>
            <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta área.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Configurações e integrações do sistema</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="ia" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="external-api" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            APIs Externas
          </TabsTrigger>
          <TabsTrigger value="rest-api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API REST
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gerenciamento de Usuários</span>
              </CardTitle>
              <CardDescription>
                Gerencie usuários e permissões do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onNavigateToUsers}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-revenshop-primary">3</div>
                    <p className="text-sm text-muted-foreground">usuários ativos</p>
                    <p className="text-xs text-gray-500 mt-1">Clique para gerenciar</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ia" className="mt-6">
          <IASettings />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <WhatsAppIntegration />
        </TabsContent>

        <TabsContent value="external-api" className="mt-6">
          <ExternalAPITesterAdvanced />
        </TabsContent>

        <TabsContent value="rest-api" className="mt-6">
          <APITester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationsPanel;
