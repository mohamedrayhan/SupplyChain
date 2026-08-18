from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_utilization = Column(Float, nullable=False)  # Percentage 0-100
    status = Column(String, default="Healthy")  # Healthy, At Risk, Critical

    inventory_items = relationship("InventoryItem", back_populates="warehouse")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(String, primary_key=True, index=True)
    warehouse_id = Column(String, ForeignKey("warehouses.id"), nullable=False)
    sku = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    total_quantity = Column(Integer, nullable=False)
    available_quantity = Column(Integer, nullable=False)
    reserved_quantity = Column(Integer, default=0)
    being_picked_quantity = Column(Integer, default=0)
    in_transit_quantity = Column(Integer, default=0)
    quality_hold_quantity = Column(Integer, default=0)
    confidence_score = Column(Float, default=95.0)  # 0 to 100
    has_mismatch = Column(Integer, default=0)  # 0 = No mismatch, 1 = Mismatch detected
    last_updated = Column(DateTime, default=datetime.utcnow)

    warehouse = relationship("Warehouse", back_populates="inventory_items")

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True, index=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    customer = Column(String, nullable=False)
    transporter = Column(String, nullable=False)
    vehicle_id = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Created, Packed, Loaded, Departed, In Transit, Arrived at Hub, Out for Delivery, Delivered
    current_location = Column(String, nullable=False)
    planned_eta = Column(String, nullable=False)
    predicted_eta = Column(String, nullable=False)
    delay_risk = Column(String, default="Low")  # Low, Medium, High
    delay_probability = Column(Float, default=10.0)  # 0-100 percentage

class Transporter(Base):
    __tablename__ = "transporters"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    active_vehicles = Column(Integer, default=0)
    delayed_shipments = Column(Integer, default=0)
    reliability_score = Column(Float, default=90.0)  # 0-100

class SupplyChainEvent(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    entity_type = Column(String, nullable=False)  # Warehouse, Shipment, Transporter, Inventory
    entity_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(String, nullable=True)
    source = Column(String, default="System RFID/GPS")
    confidence = Column(Float, default=95.0)
    description = Column(String, nullable=True)

class Risk(Base):
    __tablename__ = "risks"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    severity = Column(String, nullable=False)  # Low, Medium, High, Critical
    affected_entities = Column(Text, nullable=False)  # JSON or comma-separated list string
    root_cause = Column(String, nullable=False)
    probability = Column(Float, nullable=False)
    financial_impact = Column(Float, nullable=False)

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(String, primary_key=True, index=True)
    risk_id = Column(String, ForeignKey("risks.id"), nullable=False)
    action_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    estimated_cost = Column(Float, nullable=False)
    expected_benefit = Column(Float, nullable=False)
    recovery_score = Column(Float, nullable=False)
