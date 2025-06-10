
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, FileText, Image } from 'lucide-react';
import DescriptionGenerator from './DescriptionGenerator';
import ImageGenerator from './ImageGenerator';

const AIBeta = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Bot className="h-8 w-8 text-revenshop-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IA (beta)</h1>
          <p className="text-gray-600">Ferramentas de inteligência artificial para geração de conteúdo</p>
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              BETA - Em fase de testes
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ferramentas de IA</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="descriptions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="descriptions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrições
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Imagens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="descriptions" className="mt-6">
              <DescriptionGenerator />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <ImageGenerator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBeta;
