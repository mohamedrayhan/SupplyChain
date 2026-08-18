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
  CopilotQueryResponse
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

export const resetDemoData = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/reset-demo`);
};
