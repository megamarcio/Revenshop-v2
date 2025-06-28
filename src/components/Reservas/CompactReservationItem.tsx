import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReservationListItem } from '@/hooks/useReservationsList';
import { getTemperatureIndicator } from './utils/reservationHelpers';
import ReservationLoadingState from './components/ReservationLoadingState';
import ReservationErrorState from './components/ReservationErrorState';
import ReservationFirstLine from './components/ReservationFirstLine';
import ReservationSecondLine from './components/ReservationSecondLine';
import ReservationThirdLine from './components/ReservationThirdLine';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfiles } from '@/hooks/useProfiles';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2, Save, Calendar, MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ReservationActionButtons from './components/ReservationActionButtons';

interface CompactReservationItemProps {
  reservation: ReservationListItem;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, field: 'temperature' | 'notes' | 'assigned_to' | 'delegated_to_user_id' | 'contact_stage', value: string | null) => void;
  extraActions?: React.ReactNode;
  isCompact?: boolean;
}

// Adicionar tipagem para os novos campos
interface ReservationListItemWithDelegation extends ReservationListItem {
  delegated_to_user_id?: string;
  contact_stage?: string;
}

const CompactReservationItem = ({ 
  reservation, 
  onRemove, 
  onUpdateField, 
  extraActions,
  isCompact = false 
}: CompactReservationItemProps) => {
  const reservationTyped = reservation as ReservationListItemWithDelegation;
  const { toast } = useToast();
  const { profiles, loading: profilesLoading, error: profilesError } = useProfiles();
  const [assignedTo, setAssignedTo] = useState(reservation.delegated_to_user_id || 'all');
  const [contactStage, setContactStage] = useState(reservationTyped.contact_stage || '');
  const [temperature, setTemperature] = useState(reservation.temperature || '');
  const [notes, setNotes] = useState(reservation.notes || '');
  const [saving, setSaving] = useState(false);

  // Sincronizar estado local com props ao receber novos dados
  useEffect(() => {
    setAssignedTo(reservation.delegated_to_user_id || 'all');
    setContactStage(reservation.contact_stage || '');
    setTemperature(reservation.temperature || '');
    setNotes(reservation.notes || '');
  }, [
    reservation.delegated_to_user_id,
    reservation.contact_stage,
    reservation.temperature,
    reservation.notes
  ]);

  if (reservation.loading) {
    return <ReservationLoadingState reservationId={reservation.id} onRemove={onRemove} />;
  }

  if (reservation.error) {
    return (
      <ReservationErrorState 
        reservationId={reservation.id} 
        error={reservation.error} 
        onRemove={onRemove} 
      />
    );
  }

  if (!reservation.data) {
    return null;
  }

  const data = reservation.data;
  const temperatureIndicator = getTemperatureIndicator(temperature || '');
  const idStr = String(reservation.id);

  // Handler para salvar todas as alterações
  const handleSave = async () => {
    setSaving(true);
    const updateObj: any = {
      id: reservation.id,
      temperature,
      notes,
      delegated_to_user_id: assignedTo === 'all' ? null : assignedTo,
      contact_stage: contactStage,
    };
    const { error } = await supabase
      .from('reservations')
      .upsert([updateObj], { onConflict: 'id' });
    setSaving(false);
    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Salvo!',
        description: 'Informações da reserva salvas com sucesso.',
      });
      // Atualiza o estado global
      onUpdateField(reservation.id, 'temperature', temperature);
      onUpdateField(reservation.id, 'notes', notes);
      onUpdateField(reservation.id, 'delegated_to_user_id', assignedTo === 'all' ? null : assignedTo);
      onUpdateField(reservation.id, 'contact_stage', contactStage);
    }
  };

  // Modo compacto em linha
  if (isCompact) {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const pickupLocationShort = data.reservation.pick_up_location_label?.split(',')[0]?.trim() || '';
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2 p-2 transition-all duration-300 ease-in-out hover:shadow-md">
        <div className="flex items-center gap-2 text-xs animate-in slide-in-from-left-2 duration-300">
          {/* ID da Reserva */}
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-gray-500 font-medium">#{data.reservation.id}</span>
          </div>
          
          {/* Nome do Cliente */}
          <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
            <span className="font-semibold truncate max-w-[80px]">{data.customer.first_name}</span>
          </div>
          
          {/* Observações (modo compacto) */}
          {notes && (
            <div className="flex items-center gap-1 min-w-0 flex-1 max-w-[150px]">
              <span className="text-[10px] text-gray-500 font-medium flex-shrink-0">Obs:</span>
              <span className="text-[10px] text-gray-700 truncate">{notes}</span>
            </div>
          )}
          
          {/* Botões de Ação */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <ReservationActionButtons data={data} />
            <Button onClick={handleSave} size="sm" variant="outline" className="h-6 w-6 p-0 transition-all duration-200 hover:scale-105" disabled={saving} title="Salvar">
              <Save className="h-3 w-3" />
            </Button>
            <Button onClick={() => onRemove(reservation.id)} size="sm" variant="outline" className="h-6 w-6 p-0 text-red-600 transition-all duration-200 hover:scale-105" title="Excluir">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Datas */}
          <div className="flex items-center gap-2 text-gray-600 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-green-600" />
              <span>{formatDate(data.reservation.pick_up_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-red-600" />
              <span>{formatDate(data.reservation.return_date)}</span>
            </div>
          </div>
          
          {/* Localidade Check-in */}
          <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-shrink-0">
            <MapPin className="h-3 w-3 text-green-600" />
            <span className="truncate max-w-[80px]">{pickupLocationShort}</span>
          </div>
        </div>
      </div>
    );
  }

  // Modo normal (original)
  return (
    <Card style={{ backgroundColor: temperature ? temperatureIndicator.bgColor : undefined }} className="w-full max-w-full sm:max-w-3xl mx-auto shadow-sm rounded-lg border p-0 transition-all duration-300 ease-in-out hover:shadow-lg animate-in slide-in-from-top-2 duration-300">
      <CardContent className="p-2 sm:p-3">
        <ReservationFirstLine
          data={data}
          temperature={undefined}
          onRemove={onRemove} 
          extraActions={
            <>
              {/* Botão de salvar só ícone, sem legenda */}
              <Button onClick={handleSave} size="sm" variant="outline" className="mr-1 p-1 h-6 w-6 flex items-center justify-center" disabled={saving} title="Salvar alterações">
                <Save className="h-4 w-4" />
              </Button>
              {/* Delegação */}
              {profilesLoading && <span className="text-xs text-muted-foreground mr-2">Carregando usuários...</span>}
              {profilesError && <span className="text-xs text-red-600 mr-2">Erro ao carregar usuários</span>}
              {profiles && (
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="w-28 h-7 text-xs mr-1 px-2 py-1 border rounded">
                    <SelectValue placeholder="Delegar..." />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="all">Todos</SelectItem>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id} className="text-xs">
                        {profile.first_name} {profile.last_name} ({profile.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {/* Estágio de contato */}
              <Select value={contactStage} onValueChange={setContactStage}>
                <SelectTrigger className="w-24 h-7 text-xs px-2 py-1 border rounded">
                  <SelectValue placeholder="Contato..." />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="primeiro">1º contato</SelectItem>
                  <SelectItem value="segundo">2º contato</SelectItem>
                  <SelectItem value="terceiro">3º contato</SelectItem>
                </SelectContent>
              </Select>
              {extraActions}
            </>
          }
        />
        <ReservationSecondLine 
          data={data} 
        />
        <ReservationThirdLine
          data={data}
          temperature={temperature}
          onUpdateField={(id, field, value) => {
            if (field === 'temperature') {
              setTemperature(value);
            }
          }}
          reservationId={reservation.id} 
        />
        {/* Quarta linha: Observações expansiva */}
        <div className="w-full mt-2">
          <Textarea
            placeholder="Observações..."
            value={notes || ''}
            onChange={e => {
              setNotes(e.target.value);
              onUpdateField(reservation.id, 'notes', e.target.value);
            }}
            className="w-full min-h-[32px] max-h-[80px] text-xs resize-y border rounded shadow-sm transition-all"
            style={{ 
              height: Math.min(Math.max(32, (notes?.length || 0) * 0.8 + 32), 80) 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactReservationItem;

/*
Exemplo de uso do modo compacto:

// Modo normal (padrão)
<CompactReservationItem 
  reservation={reservation}
  onUpdateField={handleUpdateField}
  onRemove={handleRemove}
/>

// Modo compacto em linha
<CompactReservationItem 
  reservation={reservation}
  onUpdateField={handleUpdateField}
  onRemove={handleRemove}
  isCompact={true}
/>

O modo compacto exibe:
- ID da reserva
- Nome do cliente
- Botões WhatsApp, Kommo, HQ
- Botões Salvar e Excluir
- Datas de check-in e return
- Localidade de check-in

Tudo em uma única linha horizontal bem compacta.
*/
