
import { 
  Droplets, 
  Battery, 
  Wind, 
  Filter, 
  Wrench, 
  Target, 
  Disc, 
  Zap
} from 'lucide-react';
import { TechnicalItem } from './types';

export const defaultTechnicalItems: TechnicalItem[] = [
  // Óleo do Motor
  { id: 'oil-engine', name: 'Óleo Motor', icon: Droplets, month: '10', year: '2024', miles: '45230', status: 'em-dia', type: 'oil' },
  
  // Sistema Elétrico
  { id: 'main-battery', name: 'Bateria Principal', icon: Battery, month: '08', year: '2023', status: 'precisa-troca', type: 'electrical' },
  { id: 'aux-battery', name: 'Bateria Auxiliar', icon: Battery, month: '08', year: '2023', status: 'em-dia', type: 'electrical' },
  { id: 'alternator', name: 'Alternador', icon: Zap, month: '03', year: '2023', miles: '42100', status: 'em-dia', type: 'electrical' },
  
  // Filtros
  { id: 'wiper-blades', name: 'Paleta Limpador', icon: Wind, month: '06', year: '2024', status: 'em-dia', type: 'filter' },
  { id: 'cabin-filter', name: 'Filtro de Cabine', icon: Filter, month: '05', year: '2024', status: 'em-dia', type: 'filter' },
  { id: 'air-filter', name: 'Filtro de Ar', icon: Filter, month: '05', year: '2024', status: 'em-dia', type: 'filter' },
  
  // Suspensão
  { id: 'alignment', name: 'Alinhamento', icon: Target, month: '09', year: '2024', miles: '44800', status: 'em-dia', type: 'suspension' },
  { id: 'balancing', name: 'Balanceamento', icon: Target, month: '09', year: '2024', miles: '44800', status: 'em-dia', type: 'suspension' },
  { id: 'front-suspension', name: 'Suspensão Frontal', icon: Wrench, month: '01', year: '2023', miles: '38500', status: 'urgente', type: 'suspension' },
  { id: 'rear-suspension', name: 'Suspensão Traseira', icon: Wrench, month: '01', year: '2023', miles: '38500', status: 'precisa-troca', type: 'suspension' },
  { id: 'shock-absorbers', name: 'Amortecedores', icon: Wrench, month: '02', year: '2023', miles: '39200', status: 'precisa-troca', type: 'suspension' },
  
  // Freios
  { id: 'brake-pads', name: 'Pastilhas', icon: Disc, month: '04', year: '2024', miles: '43000', status: 'em-dia', type: 'brakes' },
  { id: 'brake-discs', name: 'Disco de Freio', icon: Disc, month: '04', year: '2024', miles: '43000', status: 'em-dia', type: 'brakes' },
  
  // Fluidos
  { id: 'coolant', name: 'Coolant', icon: Droplets, month: '07', year: '2024', miles: '43500', status: 'em-dia', type: 'fluids' },
  { id: 'transmission-oil', name: 'Óleo Transmissão', icon: Droplets, month: '01', year: '2024', miles: '41500', status: 'em-dia', type: 'fluids' },
  
  // Tune Up
  { id: 'spark-plugs-coil', name: 'Vela e Coil (Tune Up)', icon: Zap, month: '03', year: '2023', miles: '40500', status: 'urgente', type: 'tuneup' },
  { id: 'timing-belt', name: 'Correia Dentada', icon: Wrench, month: '06', year: '2022', miles: '35000', status: 'urgente', type: 'tuneup' },
  
  // Pneus
  { id: 'tire-fr', name: 'Pneu FR', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
  { id: 'tire-fl', name: 'Pneu FL', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
  { id: 'tire-rr', name: 'Pneu RR', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
  { id: 'tire-rl', name: 'Pneu RL', icon: Target, month: '02', year: '2024', status: 'em-dia', type: 'tires' },
  { id: 'tire-type', name: 'Tipo de Pneu', icon: Target, month: '', year: '', status: 'em-dia', type: 'tires', extraInfo: '205/55 R16' }
];
