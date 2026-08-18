from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from . import models

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # 1. Warehouses
        warehouses = [
            models.Warehouse(
                id="WH-CHE-01",
                name="Chennai Central Warehouse",
                location="Chennai, TN",
                capacity=50000,
                current_utilization=84.5,
                status="At Risk"
            ),
            models.Warehouse(
                id="WH-BLR-02",
                name="Bangalore Distribution Center",
                location="Bangalore, KA",
                capacity=75000,
                current_utilization=62.0,
                status="Healthy"
            ),
            models.Warehouse(
                id="WH-MUM-03",
                name="Mumbai Logistics Hub",
                location="Mumbai, MH",
                capacity=90000,
                current_utilization=91.2,
                status="Critical"
            ),
            models.Warehouse(
                id="WH-DEL-04",
                name="Delhi NCR Hub",
                location="Gurugram, HR",
                capacity=60000,
                current_utilization=48.0,
                status="Healthy"
            )
        ]
        db.add_all(warehouses)

        # 2. Transporters
        transporters = [
            models.Transporter(
                id="TR-01",
                name="Express Logistics India",
                active_vehicles=42,
                delayed_shipments=3,
                reliability_score=94.5
            ),
            models.Transporter(
                id="TR-02",
                name="Titan Freight Carriers",
                active_vehicles=28,
                delayed_shipments=7,
                reliability_score=78.2
            ),
            models.Transporter(
                id="TR-03",
                name="Vanguard Supply Lines",
                active_vehicles=35,
                delayed_shipments=1,
                reliability_score=98.0
            )
        ]
        db.add_all(transporters)

        # 3. Inventory Items
        now = datetime.utcnow()
        inventory = [
            models.InventoryItem(
                id="INV-001",
                warehouse_id="WH-CHE-01",
                sku="SKU-MICRO-992",
                product_name="High-Performance Microcontroller V2",
                total_quantity=12500,
                available_quantity=3200,
                reserved_quantity=2800,
                being_picked_quantity=500,
                in_transit_quantity=5500,
                quality_hold_quantity=500,
                confidence_score=92.0,
                has_mismatch=0,
                last_updated=now - timedelta(minutes=15)
            ),
            models.InventoryItem(
                id="INV-002",
                warehouse_id="WH-BLR-02",
                sku="SKU-SENS-404",
                product_name="Optical Sensor Array Modules",
                total_quantity=8900,
                available_quantity=6100,
                reserved_quantity=1200,
                being_picked_quantity=600,
                in_transit_quantity=800,
                quality_hold_quantity=200,
                confidence_score=95.0,
                has_mismatch=0,
                last_updated=now - timedelta(minutes=45)
            ),
            models.InventoryItem(
                id="INV-003",
                warehouse_id="WH-MUM-03",
                sku="SKU-BATT-770",
                product_name="Lithium Power Cells 48V",
                total_quantity=24000,
                available_quantity=14500,
                reserved_quantity=4000,
                being_picked_quantity=2000,
                in_transit_quantity=2500,
                quality_hold_quantity=1000,
                confidence_score=76.0,
                has_mismatch=0,
                last_updated=now - timedelta(hours=3)
            ),
            models.InventoryItem(
                id="INV-004",
                warehouse_id="WH-DEL-04",
                sku="SKU-CHIP-101",
                product_name="ARM Cortex System-on-Chip",
                total_quantity=18000,
                available_quantity=15000,
                reserved_quantity=1500,
                being_picked_quantity=500,
                in_transit_quantity=1000,
                quality_hold_quantity=0,
                confidence_score=98.0,
                has_mismatch=0,
                last_updated=now - timedelta(minutes=5)
            )
        ]
        db.add_all(inventory)

        # 4. Shipments
        shipments = [
            models.Shipment(
                id="SHP-2026-001",
                origin="Chennai Warehouse",
                destination="Bangalore Distribution Center",
                customer="ABC Manufacturing Ltd.",
                transporter="Titan Freight Carriers",
                vehicle_id="KA-01-MJ-9912",
                status="In Transit",
                current_location="Hosur Highway Sector 4",
                planned_eta="2026-08-19 14:00",
                predicted_eta="2026-08-19 18:30 (+4.5 hrs delay)",
                delay_risk="High",
                delay_probability=84.0
            ),
            models.Shipment(
                id="SHP-2026-002",
                origin="Mumbai Logistics Hub",
                destination="Delhi NCR Hub",
                customer="Titan Components Pvt Ltd",
                transporter="Express Logistics India",
                vehicle_id="MH-04-EV-2041",
                status="Departed",
                current_location="Surat Bypass Toll",
                planned_eta="2026-08-20 09:00",
                predicted_eta="2026-08-20 09:15",
                delay_risk="Low",
                delay_probability=12.0
            ),
            models.Shipment(
                id="SHP-2026-003",
                origin="Chennai Central Warehouse",
                destination="Mumbai Logistics Hub",
                customer="Apex Industrial Automation",
                transporter="Titan Freight Carriers",
                vehicle_id="TN-09-CB-4411",
                status="Loaded",
                current_location="Chennai Loading Dock 3",
                planned_eta="2026-08-21 11:00",
                predicted_eta="2026-08-21 15:45 (+4.75 hrs delay)",
                delay_risk="High",
                delay_probability=79.5
            ),
            models.Shipment(
                id="SHP-2026-004",
                origin="Bangalore Distribution Center",
                destination="Chennai Warehouse",
                customer="GreenEnergy Motors",
                transporter="Vanguard Supply Lines",
                vehicle_id="KA-03-TR-8822",
                status="Out for Delivery",
                current_location="Sriperumbudur Industrial Area",
                planned_eta="2026-08-18 21:00",
                predicted_eta="2026-08-18 21:10",
                delay_risk="Low",
                delay_probability=8.5
            ),
            models.Shipment(
                id="SHP-2026-005",
                origin="Delhi NCR Hub",
                destination="Ahmedabad Assembly Plant",
                customer="ABC Manufacturing Ltd.",
                transporter="Express Logistics India",
                vehicle_id="HR-26-CZ-1109",
                status="Delivered",
                current_location="Ahmedabad Depot",
                planned_eta="2026-08-18 12:00",
                predicted_eta="2026-08-18 11:50",
                delay_risk="Low",
                delay_probability=2.0
            )
        ]
        db.add_all(shipments)

        # 5. Supply Chain Events
        events = [
            models.SupplyChainEvent(
                id="EVT-1001",
                entity_type="Shipment",
                entity_id="SHP-2026-001",
                event_type="TRAFFIC_CONGESTION_ALERT",
                timestamp=now - timedelta(minutes=25),
                location="Hosur Highway Sector 4",
                source="IoT GPS Beacon #44",
                confidence=96.0,
                description="Severe highway congestion detected due to road construction on NH44."
            ),
            models.SupplyChainEvent(
                id="EVT-1002",
                entity_type="Warehouse",
                entity_id="WH-CHE-01",
                event_type="DOCK_BOTTLENECK_WARNING",
                timestamp=now - timedelta(hours=1, minutes=10),
                location="Chennai Dock 3",
                source="Warehouse Management System (WMS)",
                confidence=91.0,
                description="Outbound dock queue exceeding 45 minutes; loading speed reduced by 35%."
            ),
            models.SupplyChainEvent(
                id="EVT-1003",
                entity_type="Shipment",
                entity_id="SHP-2026-003",
                event_type="DISPATCH_DELAYED",
                timestamp=now - timedelta(hours=2),
                location="Chennai Central Warehouse",
                source="ERP System Signal",
                confidence=99.0,
                description="Vehicle TN-09-CB-4411 dispatch delayed pending final quality inspection sign-off."
            ),
            models.SupplyChainEvent(
                id="EVT-1004",
                entity_type="Inventory",
                entity_id="INV-003",
                event_type="DISCREPANCY_FLAG",
                timestamp=now - timedelta(hours=3),
                location="Mumbai Logistics Hub",
                source="Cycle Count Audit",
                confidence=76.0,
                description="Physical audit count mismatches ERP record by -500 units for SKU-BATT-770."
            )
        ]
        db.add_all(events)

        # 6. Risks
        risks = [
            models.Risk(
                id="RSK-501",
                type="Warehouse Bottleneck",
                severity="High",
                affected_entities="WH-CHE-01, SHP-2026-001, SHP-2026-003",
                root_cause="Chennai loading dock 3 equipment malfunction & staffing shortage",
                probability=88.0,
                financial_impact=1250000.0  # ₹12.5 Lakhs
            ),
            models.Risk(
                id="RSK-502",
                type="Highway Logistics Delay",
                severity="Medium",
                affected_entities="SHP-2026-001",
                root_cause="NH44 lane closure near Hosur border",
                probability=65.0,
                financial_impact=350000.0   # ₹3.5 Lakhs
            )
        ]
        db.add_all(risks)

        # 7. Recovery Actions
        recovery_actions = [
            models.RecoveryAction(
                id="REC-901",
                risk_id="RSK-501",
                action_type="Assign Backup Vehicle",
                description="Reroute 2 backup vehicles from Bangalore DC to split cargo load.",
                estimated_cost=85000.0,
                expected_benefit=930000.0,
                recovery_score=92.0
            )
        ]
        db.add_all(recovery_actions)

        db.commit()
        print("Database re-seeded successfully for Phase 2!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
