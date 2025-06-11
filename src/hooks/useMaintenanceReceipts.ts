
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MaintenanceReceipt {
  id: string;
  maintenance_id: string;
  url: string;
  uploaded_at: string;
}

export const useMaintenanceReceipts = (maintenanceId?: string) => {
  const [receipts, setReceipts] = useState<MaintenanceReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchReceipts = useCallback(async () => {
    if (!maintenanceId) return;
    
    try {
      // Para compatibilidade, vamos simular o carregamento de recibos
      // usando os receipt_urls do registro de manutenção
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('receipt_urls')
        .eq('id', maintenanceId)
        .single();

      if (error) throw error;
      
      // Converter URLs para formato de receipts
      const receiptsData = (data.receipt_urls || []).map((url: string, index: number) => ({
        id: `${maintenanceId}-${index}`,
        maintenance_id: maintenanceId,
        url,
        uploaded_at: new Date().toISOString()
      }));
      
      setReceipts(receiptsData);
    } catch (error) {
      console.error('Error fetching maintenance receipts:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar recibos de manutenção',
        variant: 'destructive',
      });
    }
  }, [maintenanceId]);

  const uploadReceipt = async (file: File): Promise<string | null> => {
    if (!maintenanceId) return null;

    try {
      setUploading(true);
      
      // Validar arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Apenas arquivos PDF, JPG e PNG são permitidos.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo deve ter no máximo 10MB.');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${maintenanceId}-receipt-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `maintenance-receipts/${maintenanceId}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('maintenance-receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('maintenance-receipts')
        .getPublicUrl(filePath);

      // Atualizar o registro de manutenção com a nova URL
      const { data: maintenanceData, error: fetchError } = await supabase
        .from('maintenance_records')
        .select('receipt_urls')
        .eq('id', maintenanceId)
        .single();

      if (fetchError) throw fetchError;

      const updatedUrls = [...(maintenanceData.receipt_urls || []), publicUrl];

      const { error: updateError } = await supabase
        .from('maintenance_records')
        .update({ receipt_urls: updatedUrls })
        .eq('id', maintenanceId);

      if (updateError) throw updateError;
      
      // Atualizar estado local
      const newReceipt = {
        id: `${maintenanceId}-${receipts.length}`,
        maintenance_id: maintenanceId,
        url: publicUrl,
        uploaded_at: new Date().toISOString()
      };
      
      setReceipts(prev => [...prev, newReceipt]);
      
      toast({
        title: 'Sucesso',
        description: 'Recibo adicionado com sucesso.',
      });
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao adicionar recibo.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeReceipt = useCallback(async (receiptId: string) => {
    try {
      const receipt = receipts.find(r => r.id === receiptId);
      if (!receipt) return;

      // Extrair path do storage da URL
      const url = new URL(receipt.url);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.findIndex(segment => segment === 'maintenance-receipts');
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        const storagePath = pathSegments.slice(bucketIndex + 1).join('/');
        
        // Remover do Storage
        const { error: storageError } = await supabase.storage
          .from('maintenance-receipts')
          .remove([storagePath]);

        if (storageError) {
          console.warn('Error removing from storage:', storageError);
        }
      }

      // Atualizar o registro de manutenção removendo a URL
      const { data: maintenanceData, error: fetchError } = await supabase
        .from('maintenance_records')
        .select('receipt_urls')
        .eq('id', maintenanceId)
        .single();

      if (fetchError) throw fetchError;

      const updatedUrls = (maintenanceData.receipt_urls || []).filter((url: string) => url !== receipt.url);

      const { error: updateError } = await supabase
        .from('maintenance_records')
        .update({ receipt_urls: updatedUrls })
        .eq('id', maintenanceId);

      if (updateError) throw updateError;
      
      setReceipts(prev => prev.filter(r => r.id !== receiptId));
      
      toast({
        title: 'Sucesso',
        description: 'Recibo removido com sucesso.',
      });
    } catch (error) {
      console.error('Error removing receipt:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover recibo.',
        variant: 'destructive',
      });
    }
  }, [receipts, maintenanceId]);

  return {
    receipts,
    loading,
    uploading,
    fetchReceipts,
    uploadReceipt,
    removeReceipt
  };
};
