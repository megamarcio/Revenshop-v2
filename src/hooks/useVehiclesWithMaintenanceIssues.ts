
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface VehicleWithIssues {
  id: string;
  name: string;
  internal_code: string;
  issues: string[];
}

export const useVehiclesWithMaintenanceIssues = () => {
  const {
    data: vehiclesWithIssues = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vehicles-with-maintenance-issues'],
    queryFn: async (): Promise<VehicleWithIssues[]> => {
      try {
        console.log('Buscando veículos com problemas de manutenção...');
        
        // Fetch ONLY technical items with status 'trocar' or 'proximo-troca'
        const { data: technicalItems, error: technicalError } = await supabase
          .from('technical_items')
          .select(`
            vehicle_id,
            name,
            status,
            vehicles!inner(
              name,
              internal_code
            )
          `)
          .in('status', ['trocar', 'proximo-troca']);

        if (technicalError) {
          console.error('Error fetching technical items:', technicalError);
          throw technicalError;
        }

        console.log('Itens técnicos encontrados:', technicalItems?.length || 0);

        // Fetch pending maintenance records (no repair_date but has promised_date or detection_date)
        const { data: pendingMaintenances, error: maintenanceError } = await supabase
          .from('maintenance_records')
          .select(`
            vehicle_id,
            maintenance_items,
            promised_date,
            detection_date,
            vehicles!inner(
              name,
              internal_code
            )
          `)
          .is('repair_date', null);

        if (maintenanceError) {
          console.error('Error fetching pending maintenances:', maintenanceError);
          throw maintenanceError;
        }

        console.log('Manutenções pendentes encontradas:', pendingMaintenances?.length || 0);

        // Process technical items issues
        const technicalIssuesMap = new Map<string, VehicleWithIssues>();
        
        technicalItems?.forEach((item: any) => {
          const vehicleId = item.vehicle_id;
          const vehicleName = item.vehicles.name;
          const vehicleInternalCode = item.vehicles.internal_code;
          
          if (!technicalIssuesMap.has(vehicleId)) {
            technicalIssuesMap.set(vehicleId, {
              id: vehicleId,
              name: vehicleName,
              internal_code: vehicleInternalCode,
              issues: []
            });
          }
          
          const vehicle = technicalIssuesMap.get(vehicleId)!;
          const issueText = item.status === 'trocar' 
            ? `${item.name} (Trocar)`
            : `${item.name} (Próximo da Troca)`;
          
          if (!vehicle.issues.includes(issueText)) {
            vehicle.issues.push(issueText);
          }
        });

        // Process pending maintenance issues
        const maintenanceIssuesMap = new Map<string, VehicleWithIssues>();
        
        pendingMaintenances?.forEach((maintenance: any) => {
          const vehicleId = maintenance.vehicle_id;
          const vehicleName = maintenance.vehicles.name;
          const vehicleInternalCode = maintenance.vehicles.internal_code;
          
          if (!maintenanceIssuesMap.has(vehicleId)) {
            maintenanceIssuesMap.set(vehicleId, {
              id: vehicleId,
              name: vehicleName,
              internal_code: vehicleInternalCode,
              issues: []
            });
          }
          
          const vehicle = maintenanceIssuesMap.get(vehicleId)!;
          maintenance.maintenance_items.forEach((item: string) => {
            const issueText = `${item} (Manutenção Pendente)`;
            if (!vehicle.issues.includes(issueText)) {
              vehicle.issues.push(issueText);
            }
          });
        });

        // Combine both maps into a single result
        const combinedIssuesMap = new Map<string, VehicleWithIssues>();
        
        // Add technical issues
        technicalIssuesMap.forEach((vehicle, vehicleId) => {
          combinedIssuesMap.set(vehicleId, { ...vehicle });
        });
        
        // Add or merge maintenance issues
        maintenanceIssuesMap.forEach((vehicle, vehicleId) => {
          if (combinedIssuesMap.has(vehicleId)) {
            const existingVehicle = combinedIssuesMap.get(vehicleId)!;
            existingVehicle.issues = [...existingVehicle.issues, ...vehicle.issues];
          } else {
            combinedIssuesMap.set(vehicleId, { ...vehicle });
          }
        });

        const result = Array.from(combinedIssuesMap.values());
        console.log('Resultado final - veículos com problemas:', result.length);
        console.log('Detalhes dos veículos:', result.map(v => ({ code: v.internal_code, issues: v.issues.length })));
        
        return result;
      } catch (error) {
        console.error('Error in useVehiclesWithMaintenanceIssues:', error);
        return [];
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });

  return {
    vehiclesWithIssues,
    isLoading,
    error,
    refetch
  };
};
