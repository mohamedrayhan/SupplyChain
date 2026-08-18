export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_utilization: number;
  status: 'Healthy' | 'At Risk' | 'Critical';
}

export interface ShipmentMilestone {
  stage: string;
  location: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  status: 'Created' | 'Pickup Scheduled' | 'Loaded' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception' | 'Held at Facility';
  delay_risk: 'Low' | 'Medium' | 'High';
  delay_probability: number;
  planned_eta: string;
  predicted_eta: string;
  current_location: string;
  vehicle_id: string;
  transporter: string;
  milestones?: ShipmentMilestone[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  product_name: string;
  warehouse_id: string;
  available_quantity: number;
  reserved_quantity: number;
  picking_quantity?: number;
  being_picked_quantity?: number;
  in_transit_quantity: number;
  quality_hold_quantity: number;
  total_quantity: number;
  confidence_score: number;
  has_mismatch: number;
  last_updated: string;
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
  risk_level: string;
  top_contributing_factors: ContributingFactor[];
  updated_predicted_eta: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
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

// Phase 10: AI Agent Swarm Types
export interface AgentThoughtItem {
  agent_name: string;
  stage: string;
  thought: string;
  action: string;
  confidence: number;
  timestamp?: string;
}

export interface AgentExecutedAction {
  action_id: string;
  agent: string;
  title: string;
  cost: number;
  expected_benefit: number;
  action_value_score: number;
  shipments_saved: number;
  execution_status: string;
}

export interface AgentOrchestrateResponse {
  cycle_id: string;
  timestamp: string;
  status: string;
  executed_actions: AgentExecutedAction[];
  thought_stream: AgentThoughtItem[];
  total_cost: number;
  total_benefit_avoided: number;
  shipments_saved: number;
  updated_on_time_rate: number;
}

// Phase 11: Blockchain Smart Contract & Oracle Types
export interface SmartContractEscrow {
  contract_address: string;
  shipment_id: string;
  customer_name: string;
  customer_wallet: string;
  carrier_name: string;
  carrier_wallet: string;
  escrow_amount_inr: number;
  sla_max_delay_hours: number;
  penalty_rate_per_hour: number;
  status: 'LOCKED_IN_ESCROW' | 'SETTLED_100_PERCENT' | 'PENALTY_DEDUCTED_REFUNDED';
  nft_token_id: string;
  driver_signature: string;
  warehouse_signature?: string | null;
  settlement_tx_hash?: string | null;
  settled_amount_carrier: number;
  refunded_amount_customer: number;
  settlement_timestamp?: string | null;
  block_number?: number | null;
}

export interface OracleSettleResponse {
  success: boolean;
  message: string;
  shipment_id: string;
  status: string;
  contract_address: string;
  tx_hash: string;
  block_number: number;
  gas_used_gwei: number;
  execution_speed_sec: number;
  oracle_cryptographic_proof: string;
  escrow_data: SmartContractEscrow;
}

export interface BlockchainStats {
  network: string;
  chain_id: number;
  oracle_network: string;
  total_value_locked_inr: number;
  active_escrows_count: number;
  settled_escrows_count: number;
  average_settlement_latency_sec: number;
  invoice_dispute_rate: string;
  gas_price_gwei: number;
}

// Phase 12: GNN & Deep RL Types
export interface GNNNode {
  id: string;
  name: string;
  type: 'WAREHOUSE' | 'CORRIDOR' | 'TRANSPORTER' | 'CARGO' | 'CUSTOMER';
  echelon: number;
  hop_1_risk: number;
  hop_2_risk: number;
  gnn_risk_score: number;
  risk_tier: 'CRITICAL' | 'HIGH' | 'NOMINAL';
  attention_weight: number;
}

export interface GNNCascadeResponse {
  root_anomaly_node: string;
  model_architecture: string;
  total_nodes_evaluated: number;
  convergence_epochs: number;
  severity_multiplier?: number;
  nodes: GNNNode[];
}

export interface RLTrajectory {
  route_id: string;
  name: string;
  distance_km: number;
  predicted_duration_hrs: number;
  expected_delay_hrs: number;
  toll_fuel_cost_inr: number;
  carbon_footprint_kg: number;
  sla_on_time_prob: number;
  ppo_reward_score: number;
  is_recommended: boolean;
  waypoints: string[];
}

export interface RLOptimizeResponse {
  shipment_id: string;
  policy: string;
  pareto_optimal_route_id: string;
  delay_reduction_hrs: number;
  projected_sla_recovery: number;
  ppo_reward_gain: string;
  candidate_trajectories: RLTrajectory[];
}
