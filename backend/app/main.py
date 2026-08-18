from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import get_db, engine, Base
from . import models, schemas, crud, seed

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ChainSight AI API",
    description="Real-Time Digital Supply Chain Visibility Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", summary="Health check endpoint")
def health_check():
    return {
        "status": "healthy",
        "system": "ChainSight AI Live Command Engine",
        "version": "1.0.0"
    }

@app.get("/api/dashboard", response_model=schemas.DashboardResponse, summary="Get main command center dashboard data")
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_data(db)

@app.get("/api/warehouses", response_model=List[schemas.WarehouseSchema], summary="Get all warehouses")
def get_warehouses(db: Session = Depends(get_db)):
    return crud.get_warehouses(db)

@app.get("/api/shipments", response_model=List[schemas.ShipmentSchema], summary="Get all shipments")
def get_shipments(db: Session = Depends(get_db)):
    return crud.get_shipments(db)

@app.get("/api/shipments/{shipment_id}", response_model=schemas.ShipmentSchema, summary="Get single shipment details")
def get_shipment(shipment_id: str, db: Session = Depends(get_db)):
    shipment = crud.get_shipment_by_id(db, shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@app.post("/api/shipments/simulate-delay/{shipment_id}", response_model=schemas.ShipmentSchema, summary="Simulate shipment delay")
def simulate_delay(shipment_id: str, db: Session = Depends(get_db)):
    updated_shipment = crud.simulate_shipment_delay(db, shipment_id)
    if not updated_shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return updated_shipment

@app.post("/api/predict-delay", response_model=schemas.PredictRiskResponse, summary="Predict delay risk with scoring algorithm")
def predict_delay_risk(req: schemas.PredictRiskRequest, db: Session = Depends(get_db)):
    return crud.calculate_predictive_delay_risk(db, req)

@app.get("/api/incidents", response_model=List[schemas.IncidentSchema], summary="Get all active grouped root cause incidents")
def get_incidents(db: Session = Depends(get_db)):
    return crud.get_incidents(db)

@app.post("/api/incidents/simulate-bottleneck", response_model=schemas.IncidentSchema, summary="Simulate warehouse bottleneck crisis")
def simulate_bottleneck(db: Session = Depends(get_db)):
    return crud.simulate_warehouse_bottleneck(db)

@app.get("/api/simulator/evaluate", response_model=schemas.SimulatorEvaluationResponse, summary="Evaluate what-if recovery options")
def evaluate_simulator(db: Session = Depends(get_db)):
    return crud.evaluate_recovery_simulation(db)

@app.post("/api/simulator/apply", response_model=schemas.ApplyRecoveryResponse, summary="Apply chosen recovery plan to live database")
def apply_recovery(req: schemas.ApplyRecoveryRequest, db: Session = Depends(get_db)):
    return crud.apply_recovery_plan(db, req.action_id)

@app.get("/api/twin/graph", response_model=schemas.TwinGraphResponse, summary="Get digital twin visual node graph topology")
def get_twin_graph(db: Session = Depends(get_db)):
    return crud.get_digital_twin_graph(db)

@app.post("/api/copilot/query", response_model=schemas.CopilotQueryResponse, summary="Process AI Copilot natural language query")
def query_copilot(req: schemas.CopilotQueryRequest, db: Session = Depends(get_db)):
    return crud.process_copilot_query(db, req.query)

@app.get("/api/inventory", response_model=List[schemas.InventoryItemSchema], summary="Get all inventory items")
def get_inventory(db: Session = Depends(get_db)):
    return crud.get_inventory_items(db)

@app.post("/api/inventory/simulate-mismatch/{item_id}", response_model=schemas.InventoryItemSchema, summary="Simulate inventory mismatch")
def simulate_mismatch(item_id: str, db: Session = Depends(get_db)):
    updated_item = crud.simulate_inventory_mismatch(db, item_id)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return updated_item

@app.post("/api/reset-demo", summary="Reset database to initial demo state")
def reset_demo_data():
    seed.seed_database()
    return {"message": "Demo data reset successfully."}
