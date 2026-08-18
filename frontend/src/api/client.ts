import axios from 'axios';
import type { 
  DashboardResponse, 
  Warehouse, 
  Shipment, 
  InventoryItem,
  PredictRiskRequest,
  PredictRiskResponse,
  Incident,
  SimulatorEvaluation,
  ApplyRecoveryResponse,
  TwinGraphData,
  CopilotQueryResponse,
  AgentOrchestrateResponse,
  SupplyChainEvent,
  SmartContractEscrow,
  OracleSettleResponse,
  BlockchainStats,
  GNNCascadeResponse,
  RLOptimizeResponse
} from '../types';

const API_BASE_URL = '/api';

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  const response = await axios.get<DashboardResponse>(`${API_BASE_URL}/dashboard`);
  return response.data;
};

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const response = await axios.get<Warehouse[]>(`${API_BASE_URL}/warehouses`);
  return response.data;
};

export const fetchShipments = async (): Promise<Shipment[]> => {
  const response = await axios.get<Shipment[]>(`${API_BASE_URL}/shipments`);
  return response.data;
};

export const simulateShipmentDelay = async (shipmentId: string): Promise<Shipment> => {
  const response = await axios.post<Shipment>(`${API_BASE_URL}/shipments/simulate-delay/${shipmentId}`);
  return response.data;
};

export const predictDelayRisk = async (req: PredictRiskRequest): Promise<PredictRiskResponse> => {
  const response = await axios.post<PredictRiskResponse>(`${API_BASE_URL}/predict-delay`, req);
  return response.data;
};

export const fetchIncidents = async (): Promise<Incident[]> => {
  const response = await axios.get<Incident[]>(`${API_BASE_URL}/incidents`);
  return response.data;
};

export const simulateWarehouseBottleneck = async (): Promise<Incident> => {
  const response = await axios.post<Incident>(`${API_BASE_URL}/incidents/simulate-bottleneck`);
  return response.data;
};

export const fetchSimulatorEvaluation = async (): Promise<SimulatorEvaluation> => {
  const response = await axios.get<SimulatorEvaluation>(`${API_BASE_URL}/simulator/evaluate`);
  return response.data;
};

export const applyRecoveryPlan = async (actionId: string): Promise<ApplyRecoveryResponse> => {
  const response = await axios.post<ApplyRecoveryResponse>(`${API_BASE_URL}/simulator/apply`, { action_id: actionId });
  return response.data;
};

export const fetchTwinGraph = async (): Promise<TwinGraphData> => {
  const response = await axios.get<TwinGraphData>(`${API_BASE_URL}/twin/graph`);
  return response.data;
};

export const queryCopilot = async (queryText: string): Promise<CopilotQueryResponse> => {
  const response = await axios.post<CopilotQueryResponse>(`${API_BASE_URL}/copilot/query`, { query: queryText });
  return response.data;
};

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const response = await axios.get<InventoryItem[]>(`${API_BASE_URL}/inventory`);
  return response.data;
};

export const simulateInventoryMismatch = async (itemId: string): Promise<InventoryItem> => {
  const response = await axios.post<InventoryItem>(`${API_BASE_URL}/inventory/simulate-mismatch/${itemId}`);
  return response.data;
};

// Phase 10: AI Agent Swarm API Bindings
export const orchestrateAgentSwarm = async (budgetGuardrail: number = 200000.0): Promise<AgentOrchestrateResponse> => {
  const response = await axios.post<AgentOrchestrateResponse>(`${API_BASE_URL}/agents/orchestrate`, { budget_guardrail: budgetGuardrail });
  return response.data;
};

export const fetchAgentHistory = async (): Promise<SupplyChainEvent[]> => {
  const response = await axios.get<SupplyChainEvent[]>(`${API_BASE_URL}/agents/history`);
  return response.data;
};

// Phase 11: Blockchain Smart Contract & Oracle Bindings
export const fetchBlockchainEscrows = async (): Promise<SmartContractEscrow[]> => {
  const response = await axios.get<SmartContractEscrow[]>(`${API_BASE_URL}/blockchain/escrows`);
  return response.data;
};

export const settleViaChainlinkOracle = async (
  shipmentId: string,
  isOnTime: boolean = true,
  delayHours: number = 0.0,
  tempCompliant: boolean = true
): Promise<OracleSettleResponse> => {
  const response = await axios.post<OracleSettleResponse>(`${API_BASE_URL}/blockchain/escrow/oracle-settle`, {
    shipment_id: shipmentId,
    is_on_time: isOnTime,
    actual_delay_hours: delayHours,
    temperature_compliant: tempCompliant
  });
  return response.data;
};

export const fetchBlockchainStats = async (): Promise<BlockchainStats> => {
  const response = await axios.get<BlockchainStats>(`${API_BASE_URL}/blockchain/stats`);
  return response.data;
};

// Phase 12: GNN and Deep RL API Bindings
export const fetchGNNCascadeForecast = async (rootNodeId: string = "NODE-WH-CHE", severity: number = 1.0): Promise<GNNCascadeResponse> => {
  const response = await axios.post<GNNCascadeResponse>(`${API_BASE_URL}/ml/gnn/cascade-forecast`, {
    root_node_id: rootNodeId,
    severity_multiplier: severity
  });
  return response.data;
};

export const optimizeDeepRLReroute = async (shipmentId: string = "SHP-2026-001", traffic: number = 90.0): Promise<RLOptimizeResponse> => {
  const response = await axios.post<RLOptimizeResponse>(`${API_BASE_URL}/ml/rl/optimal-reroute`, {
    shipment_id: shipmentId,
    traffic_factor: traffic
  });
  return response.data;
};

export const resetDemoData = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/reset-demo`);
};
