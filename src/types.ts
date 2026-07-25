export interface RoutingStep {
  machineId: string;
  timestamp: string; // Hora de passagem
  machineNotes?: string; // Observação sobre a máquina neste processamento
}

export interface PartInspection {
  id: string; // Unique part serial number e.g. SN-892-0A
  batch: string; // Batch number e.g. L-2026-05
  operator: string;
  machineId: string;
  timestamp: string;
  measurements: {
    lengthMm: number; // target: 120.00mm, tolerance +/- 0.05
    widthMm: number;  // target: 45.00mm, tolerance +/- 0.03
    heightMm: number; // target: 30.00mm, tolerance +/- 0.02
  };
  deviations: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
  temperatureCelsius: number; // normal: 21-23C during inspection
  vibrationG: number;
  status: 'approved' | 'rejected' | 'rework';
  notes?: string; // Observação geral
  defectType?: string; // e.g. "Dimensional Overrun", "Thermal Expansion Offset", "Surface Scratch"
  routingSteps?: RoutingStep[]; // Fluxo de rota de máquinas por onde a peça passou
  partObservation?: string; // Observação específica da peça física
  buyerName?: string; // Compradora da peça (ex: Scania, Volvo)
  partName?: string; // Nome da peça (ex: Bloco Motor, Cabeçote 366, Mancal)
}

export interface Machine {
  id: string;
  name: string;
  type: 'CNC Milling' | 'Metrology Zeiss Station' | 'Laser Cutter' | 'Robotic Assembly';
  status: 'online' | 'offline' | 'maintenance' | 'critical';
  temperature: number; // C
  vibration: number; // G
  speedRpm: number;
  oee: number; // Overall Equipment Effectiveness %
  utilization: number;
  partsHeuristic: number; // parts per min
  position: { x: number; y: number }; // Factory coordinates
}

export interface SaaSPlan {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  price: string;
  period: string;
  maxMachines: number;
  maxUsers: number;
  features: string[];
}

export interface AIInsight {
  id: string;
  timestamp: string;
  type: 'warning' | 'optimization' | 'success' | 'critical';
  title: string;
  message: string;
  machineId?: string;
  remedy?: string;
}

export interface UserProfile {
  email: string;
  companyName: string;
  operatorName: string;
  role: string;
  planId: 'starter' | 'professional' | 'enterprise';
  token?: string;
}

export interface DashboardMetrics {
  approvedCount: number;
  rejectedCount: number;
  reworkCount: number;
  totalInspected: number;
  complianceRate: number; // Approved %
  oeeAverage: number; // Overall Equipment Effectiveness %
  productionPerHour: number[];
}
