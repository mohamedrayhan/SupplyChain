from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class WarehouseSchema(BaseModel):
    id: str
    name: str
    location: str
    capacity: int
    current_utilization: float
    status: str

    class Config:
        from_attributes = True

class ShipmentMilestone(BaseModel):
    stage: str
    location: str
    timestamp: str
    status: str

class ShipmentSchema(BaseModel):
    id: str
    origin: str
    destination: str
    customer: str
    status: str
    delay_risk: str
    delay_probability: float
    planned_eta: str
    predicted_eta: str
    current_location: str
    vehicle_id: str
    transporter: str
    milestones: Optional[List[ShipmentMilestone]] = []

    class Config:
        from_attributes = True

class InventoryItemSchema(BaseModel):
    id: str
    sku: str
    product_name: str
    warehouse_id: str
    available_quantity: int
    reserved_quantity: int
    picking_quantity: Optional[int] = 0
    being_picked_quantity: Optional[int] = 0
    in_transit_quantity: int
    quality_hold_quantity: int
    total_quantity: int
    confidence_score: float
    has_mismatch: int
    last_updated: datetime

    class Config:
        from_attributes = True

class ContributingFactor(BaseModel):
    name: str
    weight: float
    impact_score: float

class PredictRiskRequest(BaseModel):
    shipment_id: str
    traffic_factor: float
    warehouse_delay_mins: float
    vehicle_risk_factor: float
    transporter_reliability: Optional[float] = 85.0
    historical_delay_factor: Optional[float] = 30.0

class PredictRiskResponse(BaseModel):
    shipment_id: str
    delay_probability: float
    risk_level: str
    top_contributing_factors: List[ContributingFactor]
    updated_predicted_eta: str

class IncidentSchema(BaseModel):
    id: str
    title: str
    severity: str
    root_cause: str
    affected_warehouse_id: str
    affected_warehouse_name: str
    affected_shipments: List[str]
    affected_customers: List[str]
    sla_breaches_risk_count: int
    financial_impact: float
    probability: float
    created_at: datetime
    recommended_actions: List[str]

class RecoveryOptionSchema(BaseModel):
    id: str
    title: str
    description: str
    estimated_cost: float
    expected_delay_reduction_hrs: float
    sla_recovery_rate: float
    shipments_saved: int
    expected_benefit: float
    action_value_score: float
    is_recommended: bool

class SimulationBaselineSchema(BaseModel):
    on_time_delivery_rate: float
    high_risk_shipments: int
    potential_sla_loss: float
    active_incidents: int

class SimulatorEvaluationResponse(BaseModel):
    baseline: SimulationBaselineSchema
    options: List[RecoveryOptionSchema]
    best_action_id: str

class ApplyRecoveryRequest(BaseModel):
    action_id: str

class ApplyRecoveryResponse(BaseModel):
    success: bool
    message: str
    action_id: str
    updated_on_time_rate: float
    resolved_shipments_count: int

class TwinNodeSchema(BaseModel):
    id: str
    label: str
    sub_label: str
    type: str  # warehouse, transporter, shipment, customer
    status: str  # Healthy, At Risk, Critical
    x: float
    y: float
    metrics: Dict[str, Any]

class TwinEdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    label: str
    status: str
    is_bottleneck: bool = False

class TwinGraphResponse(BaseModel):
    nodes: List[TwinNodeSchema]
    edges: List[TwinEdgeSchema]
    health_summary: Dict[str, int]

class CopilotQueryRequest(BaseModel):
    query: str

class CopilotActionCard(BaseModel):
    title: str
    action_type: str  # navigate_tab, apply_plan, inspect_item
    target: str
    description: str

class CopilotQueryResponse(BaseModel):
    answer: str
    intent: str
    key_metrics: Dict[str, Any]
    action_cards: List[CopilotActionCard]

class SupplyChainEventSchema(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    event_type: str
    timestamp: datetime
    location: Optional[str] = None
    source: str
    confidence: float
    description: Optional[str] = None

    class Config:
        from_attributes = True

class RiskSchema(BaseModel):
    id: str
    type: str
    severity: str
    affected_entities: str
    root_cause: str
    probability: float
    financial_impact: float

    class Config:
        from_attributes = True

class DashboardKPISchema(BaseModel):
    active_shipments: int
    at_risk_shipments: int
    on_time_delivery_rate: float
    inventory_health: float
    total_warehouses: int
    critical_risks_count: int

class DashboardResponse(BaseModel):
    kpis: DashboardKPISchema
    shipment_status_distribution: dict
    warehouse_utilization: List[WarehouseSchema]
    recent_events: List[SupplyChainEventSchema]
    high_risk_alerts: List[RiskSchema]

# Phase 10: AI Agent Swarm Schemas
class AgentThoughtItem(BaseModel):
    agent_name: str
    stage: str
    thought: str
    action: str
    confidence: float
    timestamp: Optional[str] = None

class AgentExecutedAction(BaseModel):
    action_id: str
    agent: str
    title: str
    cost: float
    expected_benefit: float
    action_value_score: float
    shipments_saved: int
    execution_status: str

class AgentOrchestrateRequest(BaseModel):
    budget_guardrail: Optional[float] = 200000.0

class AgentOrchestrateResponse(BaseModel):
    cycle_id: str
    timestamp: str
    status: str
    executed_actions: List[AgentExecutedAction]
    thought_stream: List[AgentThoughtItem]
    total_cost: float
    total_benefit_avoided: float
    shipments_saved: int
    updated_on_time_rate: float

# Phase 11: Blockchain Smart Contract & Oracle Schemas
class SmartContractEscrowSchema(BaseModel):
    contract_address: str
    shipment_id: str
    customer_name: str
    customer_wallet: str
    carrier_name: str
    carrier_wallet: str
    escrow_amount_inr: float
    sla_max_delay_hours: float
    penalty_rate_per_hour: float
    status: str
    nft_token_id: str
    driver_signature: str
    warehouse_signature: Optional[str] = None
    settlement_tx_hash: Optional[str] = None
    settled_amount_carrier: float = 0.0
    refunded_amount_customer: float = 0.0
    settlement_timestamp: Optional[str] = None
    block_number: Optional[int] = None

class OracleSettleRequest(BaseModel):
    shipment_id: str
    is_on_time: bool = True
    actual_delay_hours: float = 0.0
    temperature_compliant: bool = True

class OracleSettleResponse(BaseModel):
    success: bool
    message: str
    shipment_id: str
    status: str
    contract_address: str
    tx_hash: str
    block_number: int
    gas_used_gwei: float
    execution_speed_sec: float
    oracle_cryptographic_proof: str
    escrow_data: SmartContractEscrowSchema

class BlockchainStatsResponse(BaseModel):
    network: str
    chain_id: int
    oracle_network: str
    total_value_locked_inr: float
    active_escrows_count: int
    settled_escrows_count: int
    average_settlement_latency_sec: float
    invoice_dispute_rate: str
    gas_price_gwei: float

# Phase 12: GNN & Deep RL Schemas
class GNNNodeSchema(BaseModel):
    id: str
    name: str
    type: str
    echelon: int
    hop_1_risk: float
    hop_2_risk: float
    gnn_risk_score: float
    risk_tier: str
    attention_weight: float

class GNNCascadeRequest(BaseModel):
    root_node_id: Optional[str] = "NODE-WH-CHE"
    severity_multiplier: Optional[float] = 1.0

class GNNCascadeResponse(BaseModel):
    root_anomaly_node: str
    model_architecture: str
    total_nodes_evaluated: int
    convergence_epochs: int
    severity_multiplier: Optional[float] = 1.0
    nodes: List[GNNNodeSchema]

class RLTrajectorySchema(BaseModel):
    route_id: str
    name: str
    distance_km: int
    predicted_duration_hrs: float
    expected_delay_hrs: float
    toll_fuel_cost_inr: float
    carbon_footprint_kg: float
    sla_on_time_prob: float
    ppo_reward_score: float
    is_recommended: bool
    waypoints: List[str]

class RLOptimizeRequest(BaseModel):
    shipment_id: Optional[str] = "SHP-2026-001"
    traffic_factor: Optional[float] = 90.0

class RLOptimizeResponse(BaseModel):
    shipment_id: str
    policy: str
    pareto_optimal_route_id: str
    delay_reduction_hrs: float
    projected_sla_recovery: float
    ppo_reward_gain: str
    candidate_trajectories: List[RLTrajectorySchema]
