export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_utilization: number;
  status: 'Healthy' | 'At Risk' | 'Critical';
}

export interface InventoryItem {
  id: string;
  warehouse_id: string;
  sku: string;
  product_name: string;
  total_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  being_picked_quantity: number;
  in_transit_quantity: number;
  quality_hold_quantity: number;
  confidence_score: number;
  has_mismatch?: number;
  last_updated: string;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  transporter: string;
  vehicle_id: string;
  status: 'Created' | 'Packed' | 'Loaded' | 'Departed' | 'In Transit' | 'Arrived at Hub' | 'Out for Delivery' | 'Delivered';
  current_location: string;
  planned_eta: string;
  predicted_eta: string;
  delay_risk: 'Low' | 'Medium' | 'High';
  delay_probability: number;
}

export interface ContributingFactor {
  name: string;
  weight: number;
  impact_score: number;
}

export interface PredictRiskRequest {
  shipment_id: string;
  traffic_factor: number;
  warehouse_delay_mins: number;
  vehicle_risk_factor: number;
  transporter_reliability?: number;
  historical_delay_factor?: number;
}

export interface PredictRiskResponse {
  shipment_id: string;
  delay_probability: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  top_contributing_factors: ContributingFactor[];
  updated_predicted_eta: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'High' | 'Critical' | 'Medium';
  root_cause: string;
  affected_warehouse_id: string;
  affected_warehouse_name: string;
  affected_shipments: string[];
  affected_customers: string[];
  sla_breaches_risk_count: number;
  financial_impact: number;
  probability: number;
  created_at: string;
  recommended_actions: string[];
}

export interface RecoveryOption {
  id: string;
  title: string;
  description: string;
  estimated_cost: number;
  expected_delay_reduction_hrs: number;
  sla_recovery_rate: number;
  shipments_saved: number;
  expected_benefit: number;
  action_value_score: number;
  is_recommended: boolean;
}

export interface SimulationBaseline {
  on_time_delivery_rate: number;
  high_risk_shipments: number;
  potential_sla_loss: number;
  active_incidents: number;
}

export interface SimulatorEvaluation {
  baseline: SimulationBaseline;
  options: RecoveryOption[];
  best_action_id: string;
}

export interface ApplyRecoveryResponse {
  success: boolean;
  message: string;
  action_id: string;
  updated_on_time_rate: number;
  resolved_shipments_count: number;
}

export interface TwinNode {
  id: string;
  label: string;
  sub_label: string;
  type: 'warehouse' | 'transporter' | 'shipment' | 'customer';
  status: 'Healthy' | 'At Risk' | 'Critical';
  x: number;
  y: number;
  metrics: Record<string, any>;
}

export interface TwinEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  status: 'Healthy' | 'At Risk' | 'Critical';
  is_bottleneck?: boolean;
}

export interface TwinGraphData {
  nodes: TwinNode[];
  edges: TwinEdge[];
  health_summary: {
    Healthy: number;
    'At Risk': number;
    Critical: number;
  };
}

export interface CopilotActionCard {
  title: string;
  action_type: string;
  target: string;
  description: string;
}

export interface CopilotQueryResponse {
  answer: string;
  intent: string;
  key_metrics: Record<string, any>;
  action_cards: CopilotActionCard[];
}

export interface SupplyChainEvent {
  id: string;
  entity_type: string;
  entity_id: string;
  event_type: string;
  timestamp: string;
  location?: string;
  source: string;
  confidence: number;
  description?: string;
}

export interface Risk {
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affected_entities: string;
  root_cause: string;
  probability: number;
  financial_impact: number;
}

export interface DashboardKPIs {
  active_shipments: number;
  at_risk_shipments: number;
  on_time_delivery_rate: number;
  inventory_health: number;
  total_warehouses: number;
  critical_risks_count: number;
}

export interface DashboardResponse {
  kpis: DashboardKPIs;
  shipment_status_distribution: Record<string, number>;
  warehouse_utilization: Warehouse[];
  recent_events: SupplyChainEvent[];
  high_risk_alerts: Risk[];
}
