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

class InventoryItemSchema(BaseModel):
    id: str
    warehouse_id: str
    sku: str
    product_name: str
    total_quantity: int
    available_quantity: int
    reserved_quantity: int
    being_picked_quantity: int
    in_transit_quantity: int
    quality_hold_quantity: int
    confidence_score: float
    has_mismatch: int
    last_updated: datetime

    class Config:
        from_attributes = True

class ShipmentSchema(BaseModel):
    id: str
    origin: str
    destination: str
    customer: str
    transporter: str
    vehicle_id: str
    status: str
    current_location: str
    planned_eta: str
    predicted_eta: str
    delay_risk: str
    delay_probability: float

    class Config:
        from_attributes = True

class PredictRiskRequest(BaseModel):
    shipment_id: str
    traffic_factor: float
    warehouse_delay_mins: float
    vehicle_risk_factor: float
    transporter_reliability: float = 85.0
    historical_delay_factor: float = 30.0

class ContributingFactor(BaseModel):
    name: str
    weight: float
    impact_score: float

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
