import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Tipos para a API
export interface VehicleData {
  id: string;
  name: string;
  year: number;
  model: string;
  color: string;
  miles: number;
  vin: string;
  salePrice: number;
  description: string;
  photos: string[];
  video?: string;
  status: 'forSale' | 'sold';
  created_at: string;
  updated_at: string;
}

export interface CustomerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationData {
  id: string;
  customer: {
    label: string;
    phone_number: string;
  };
  pick_up_date: string;
  return_date: string;
  reservation_vehicle_information: {
    plate: string;
  };
  status: string;
  created_at: string;
}

export interface MaintenanceData {
  id: string;
  vehicle_id: string;
  maintenance_type: string;
  details: string;
  total_amount: number;
  status: string;
  detection_date: string;
  repair_date?: string;
  created_at: string;
}

export interface WhatsAppGroup {
  id: string;
  name: string;
  phone: string;
  description?: string;
}

// Classe principal da API
export class RevenshopAPI {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ===== VEÍCULOS =====
  async getVehicles(filters?: {
    status?: 'forSale' | 'sold';
    limit?: number;
    offset?: number;
  }): Promise<VehicleData[]> {
    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('category', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Erro ao buscar veículos: ${error.message}`);
    return data || [];
  }

  async getVehicleById(id: string): Promise<VehicleData | null> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Erro ao buscar veículo: ${error.message}`);
    return data;
  }

  async searchVehicles(query: string): Promise<VehicleData[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .or(`name.ilike.%${query}%,model.ilike.%${query}%,vin.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar veículos: ${error.message}`);
    return data || [];
  }

  // ===== CLIENTES =====
  async getCustomers(filters?: {
    limit?: number;
    offset?: number;
  }): Promise<CustomerData[]> {
    let query = supabase
      .from('bhph_customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Erro ao buscar clientes: ${error.message}`);
    return data || [];
  }

  async getCustomerById(id: string): Promise<CustomerData | null> {
    const { data, error } = await supabase
      .from('bhph_customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Erro ao buscar cliente: ${error.message}`);
    return data;
  }

  async searchCustomers(query: string): Promise<CustomerData[]> {
    const { data, error } = await supabase
      .from('bhph_customers')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar clientes: ${error.message}`);
    return data || [];
  }

  // ===== RESERVAS =====
  async getReservations(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ReservationData[]> {
    let query = supabase
      .from('reservations')
      .select(`
        id,
        customer,
        pick_up_date,
        return_date,
        reservation_vehicle_information,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Erro ao buscar reservas: ${error.message}`);
    return data || [];
  }

  // ===== MANUTENÇÃO =====
  async getMaintenanceRecords(filters?: {
    vehicle_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<MaintenanceData[]> {
    let query = supabase
      .from('maintenance_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.vehicle_id) {
      query = query.eq('vehicle_id', filters.vehicle_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Erro ao buscar registros de manutenção: ${error.message}`);
    return data || [];
  }

  // ===== GRUPOS WHATSAPP =====
  async getWhatsAppGroups(): Promise<WhatsAppGroup[]> {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Erro ao buscar grupos WhatsApp: ${error.message}`);
    return data || [];
  }

  // ===== ESTATÍSTICAS =====
  async getDashboardStats() {
    const [
      vehiclesCount,
      customersCount,
      reservationsCount,
      maintenanceCount
    ] = await Promise.all([
      supabase.from('vehicles').select('id', { count: 'exact' }),
      supabase.from('bhph_customers').select('id', { count: 'exact' }),
      supabase.from('reservations').select('id', { count: 'exact' }),
      supabase.from('maintenance_records').select('id', { count: 'exact' })
    ]);

    return {
      vehicles: vehiclesCount.count || 0,
      customers: customersCount.count || 0,
      reservations: reservationsCount.count || 0,
      maintenance: maintenanceCount.count || 0,
    };
  }

  // ===== AÇÕES =====
  async sendWhatsAppMessage(data: {
    type: 'vehicle_share' | 'reservation_share' | 'custom_message';
    recipient: {
      phone?: string;
      groupId?: string;
      groupName?: string;
      groupPhone?: string;
    };
    message?: string;
    vehicle?: VehicleData;
    reservation?: ReservationData;
  }) {
    const webhookUrl = localStorage.getItem('whatsapp_webhook_url');
    if (!webhookUrl) {
      throw new Error('URL do webhook não configurada');
    }

    const webhookSecret = localStorage.getItem('whatsapp_webhook_secret');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (webhookSecret) {
      headers['X-Webhook-Secret'] = webhookSecret;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createTask(task: {
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
    priority: 'low' | 'medium' | 'high';
    vehicle_id?: string;
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        status: 'pending',
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar tarefa: ${error.message}`);
    return data;
  }

  async updateTaskStatus(taskId: string, status: 'pending' | 'in_progress' | 'completed') {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
    return data;
  }
}

// Instância global da API
export const revenshopAPI = new RevenshopAPI('/api');

// Hook para usar a API
export const useRevenshopAPI = () => {
  const { toast } = useToast();

  const handleError = (error: Error) => {
    console.error('API Error:', error);
    toast({
      title: "Erro na API",
      description: error.message,
      variant: "destructive",
    });
  };

  return {
    api: revenshopAPI,
    handleError
  };
}; 