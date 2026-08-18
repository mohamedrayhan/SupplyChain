from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from . import models, schemas
from .ml_engine import ml_risk_engine, ml_copilot_engine

def get_warehouses(db: Session):
    return db.query(models.Warehouse).all()

def get_shipments(db: Session):
    return db.query(models.Shipment).all()

def get_shipment_by_id(db: Session, shipment_id: str):
    return db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()

def get_inventory_items(db: Session):
    return db.query(models.InventoryItem).all()

def get_inventory_item_by_id(db: Session, item_id: str):
    return db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()

def get_recent_events(db: Session, limit: int = 10):
    return db.query(models.SupplyChainEvent).order_by(models.SupplyChainEvent.timestamp.desc()).limit(limit).all()

def get_risks(db: Session):
    return db.query(models.Risk).all()

def get_incidents(db: Session):
    warehouses = get_warehouses(db)
    shipments = get_shipments(db)

    incidents = []
    
    chennai_wh = next((w for w in warehouses if "Chennai" in w.name or w.id == "WH-CHE-01"), warehouses[0] if warehouses else None)
    
    if chennai_wh:
        affected_shps = [s for s in shipments if ("Chennai" in s.origin or "Chennai" in s.destination) and s.delay_risk in ["High", "Medium"]]
        is_chennai_critical = chennai_wh.status in ["Critical", "At Risk"] or chennai_wh.current_utilization > 80.0 or len(affected_shps) > 0
        
        if is_chennai_critical:
            shps_ids = [s.id for s in affected_shps] or ["SHP-2026-001", "SHP-2026-003"]
            cust_names = list(set([s.customer for s in affected_shps])) or ["ABC Manufacturing Ltd.", "Apex Industrial Automation"]

            incidents.append(schemas.IncidentSchema(
                id="INC-2026-001",
                title="Chennai Loading Dock Outbound Bottleneck",
                severity="Critical" if chennai_wh.status == "Critical" or chennai_wh.current_utilization > 85 else "High",
                root_cause="Automated loading dock #3 mechanical failure & 40% staff constraint causing severe dispatch queue backlog",
                affected_warehouse_id=chennai_wh.id,
                affected_warehouse_name=chennai_wh.name,
                affected_shipments=shps_ids,
                affected_customers=cust_names,
                sla_breaches_risk_count=len(shps_ids),
                financial_impact=1250000.0,
                probability=88.0,
                created_at=datetime.utcnow(),
                recommended_actions=[
                    "Deploy 2 backup vehicles from Bangalore DC to split outbound volume",
                    "Reroute tier-1 priority customer cargo (ABC Manufacturing) via expedited corridor",
                    "Temporary shift of unassigned freight to auxiliary dock #1"
                ]
            ))

    delayed_transit_shps = [s for s in shipments if s.delay_risk == "High" and "Hosur" in s.current_location]
    if delayed_transit_shps:
        incidents.append(schemas.IncidentSchema(
            id="INC-2026-002",
            title="NH44 Interstate Arterial Highway Gridlock",
            severity="High",
            root_cause="Unscheduled emergency bridge maintenance and heavy rain near Tamil Nadu / Karnataka border",
            affected_warehouse_id="WH-BLR-02",
            affected_warehouse_name="Bangalore Distribution Center Corridor",
            affected_shipments=[s.id for s in delayed_transit_shps],
            affected_customers=list(set([s.customer for s in delayed_transit_shps])),
            sla_breaches_risk_count=len(delayed_transit_shps),
            financial_impact=450000.0,
            probability=84.0,
            created_at=datetime.utcnow(),
            recommended_actions=[
                "Reroute active trucks via State Highway 17 bypass route (+35km)",
                "Notify destination receiving team of revised ETA window"
            ]
        ))

    return incidents

def simulate_warehouse_bottleneck(db: Session, warehouse_id: str = "WH-CHE-01"):
    wh = db.query(models.Warehouse).filter(models.Warehouse.id == warehouse_id).first()
    if not wh:
        wh = db.query(models.Warehouse).first()

    if wh:
        wh.current_utilization = min(98.5, wh.current_utilization + 18.0)
        wh.status = "Critical"

    connected_shps = db.query(models.Shipment).filter(
        (models.Shipment.origin.contains("Chennai")) | (models.Shipment.destination.contains("Chennai"))
    ).all()

    for s in connected_shps:
        s.delay_risk = "High"
        s.delay_probability = min(95.0, s.delay_probability + 35.0)
        s.predicted_eta = f"{s.planned_eta} (+4.5 hrs bottleneck delay)"

    event = models.SupplyChainEvent(
        id=f"EVT-BOTTLENECK-{uuid.uuid4().hex[:6].upper()}",
        entity_type="Warehouse",
        entity_id=wh.id if wh else "WH-CHE-01",
        event_type="WAREHOUSE_CAPACITY_CRISIS",
        timestamp=datetime.utcnow(),
        location=wh.name if wh else "Chennai Warehouse",
        source="WMS Intelligent Sensor Array",
        confidence=96.5,
        description=f"Loading dock bottleneck triggered at {wh.name if wh else 'Chennai Warehouse'}. Loading speed dropped by 40%. {len(connected_shps)} shipments queued."
    )
    db.add(event)

    new_risk = models.Risk(
        id=f"RSK-WH-{uuid.uuid4().hex[:4].upper()}",
        type="Warehouse Bottleneck Crisis",
        severity="High",
        affected_entities=f"{wh.name if wh else 'Chennai Warehouse'}, {len(connected_shps)} Shipments",
        root_cause="Automated loading dock #3 mechanical failure & 40% staff constraint",
        probability=95.0,
        financial_impact=1250000.0
    )
    db.add(new_risk)

    db.commit()
    incidents = get_incidents(db)
    return incidents[0] if len(incidents) > 0 else schemas.IncidentSchema(
        id="INC-2026-001",
        title="Chennai Loading Dock Outbound Bottleneck",
        severity="Critical",
        root_cause="Automated loading dock #3 mechanical failure & 40% staff constraint causing severe dispatch queue backlog",
        affected_warehouse_id="WH-CHE-01",
        affected_warehouse_name="Chennai Central Warehouse",
        affected_shipments=["SHP-2026-001", "SHP-2026-003", "SHP-2026-004"],
        affected_customers=["ABC Manufacturing Ltd.", "Apex Industrial Automation", "GreenEnergy Motors"],
        sla_breaches_risk_count=3,
        financial_impact=1250000.0,
        probability=95.0,
        created_at=datetime.utcnow(),
        recommended_actions=[
            "Deploy 2 backup vehicles from Bangalore DC to split outbound volume",
            "Reroute tier-1 priority customer cargo (ABC Manufacturing) via expedited corridor",
            "Temporary shift of unassigned freight to auxiliary dock #1"
        ]
    )

def simulate_shipment_delay(db: Session, shipment_id: str):
    shipment = get_shipment_by_id(db, shipment_id)
    if not shipment:
        shipment = db.query(models.Shipment).first()

    if not shipment:
        return None

    shipment.delay_risk = "High"
    shipment.delay_probability = 88.5
    shipment.status = "In Transit"
    shipment.predicted_eta = f"{shipment.planned_eta} (+5.5 hrs severe delay)"
    shipment.current_location = f"{shipment.current_location} (Traffic Breakdown Halt)"

    event = models.SupplyChainEvent(
        id=f"EVT-DELAY-{uuid.uuid4().hex[:6].upper()}",
        entity_type="Shipment",
        entity_id=shipment.id,
        event_type="UNEXPECTED_TRANSIT_DELAY",
        timestamp=datetime.utcnow(),
        location=shipment.current_location,
        source="Fleet GPS Beacon & Telemetry",
        confidence=94.0,
        description=f"Severe delay detected for shipment {shipment.id} transported by {shipment.transporter} (Vehicle {shipment.vehicle_id}). Predicted ETA delayed by +5.5 hours."
    )
    db.add(event)

    new_risk = models.Risk(
        id=f"RSK-SHP-{uuid.uuid4().hex[:4].upper()}",
        type="Shipment SLA Breach Risk",
        severity="High",
        affected_entities=f"{shipment.id}, Customer: {shipment.customer}",
        root_cause=f"Vehicle {shipment.vehicle_id} trapped in extreme highway congestion on route {shipment.origin} -> {shipment.destination}",
        probability=88.5,
        financial_impact=450000.0
    )
    db.add(new_risk)

    db.commit()
    db.refresh(shipment)
    return shipment

def simulate_inventory_mismatch(db: Session, item_id: str):
    item = get_inventory_item_by_id(db, item_id)
    if not item:
        item = db.query(models.InventoryItem).first()
    
    if not item:
        return None

    reduction = 500
    item.available_quantity = max(0, item.available_quantity - reduction)
    item.confidence_score = 61.0
    item.has_mismatch = 1
    item.last_updated = datetime.utcnow()

    event = models.SupplyChainEvent(
        id=f"EVT-MISMATCH-{uuid.uuid4().hex[:6].upper()}",
        entity_type="Inventory",
        entity_id=item.id,
        event_type="DIGITAL_PHYSICAL_MISMATCH_DETECTED",
        timestamp=datetime.utcnow(),
        location=f"Warehouse {item.warehouse_id}",
        source="Cycle Count Audit & RFID Scan",
        confidence=61.0,
        description=f"Digital-Physical Mismatch Detected! ERP recorded higher count than physical warehouse scan by -{reduction} units for SKU {item.sku} ({item.product_name})."
    )
    db.add(event)

    existing_risk = db.query(models.Risk).filter(models.Risk.type == "Inventory Discrepancy").first()
    if not existing_risk:
        new_risk = models.Risk(
            id=f"RSK-INV-{uuid.uuid4().hex[:4].upper()}",
            type="Inventory Discrepancy",
            severity="High",
            affected_entities=f"{item.warehouse_id}, SKU {item.sku}",
            root_cause="Phantom inventory discrepancy between WMS and physical audit",
            probability=92.0,
            financial_impact=650000.0
        )
        db.add(new_risk)

    db.commit()
    db.refresh(item)
    return item

def get_dashboard_data(db: Session):
    shipments = get_shipments(db)
    warehouses = get_warehouses(db)
    inventory = get_inventory_items(db)
    events = get_recent_events(db, limit=8)
    risks = get_risks(db)

    active_shipments = len([s for s in shipments if s.status != "Delivered"])
    at_risk_shipments = len([s for s in shipments if s.delay_risk in ["Medium", "High"]])
    
    if at_risk_shipments > 0:
        on_time_rate = 78.0
    else:
        has_recovery_event = any(e.entity_type == "RecoverySimulator" for e in events)
        on_time_rate = 93.0 if has_recovery_event else 94.2

    avg_confidence = sum([i.confidence_score for i in inventory]) / len(inventory) if inventory else 92.5
    
    status_dist = {}
    for s in shipments:
        status_dist[s.status] = status_dist.get(s.status, 0) + 1

    return {
        "kpis": {
            "active_shipments": active_shipments,
            "at_risk_shipments": at_risk_shipments,
            "on_time_delivery_rate": on_time_rate,
            "inventory_health": round(avg_confidence, 1),
            "total_warehouses": len(warehouses),
            "critical_risks_count": len([r for r in risks if r.severity in ["High", "Critical"]])
        },
        "shipment_status_distribution": status_dist,
        "warehouse_utilization": warehouses,
        "recent_events": events,
        "high_risk_alerts": [r for r in risks if r.severity in ["High", "Critical"]]
    }

def evaluate_recovery_simulation(db: Session):
    shipments = get_shipments(db)
    high_risk_shps = [s for s in shipments if s.delay_risk in ["High", "Medium"]]

    baseline = schemas.SimulationBaselineSchema(
        on_time_delivery_rate=78.0,
        high_risk_shipments=len(high_risk_shps) if len(high_risk_shps) > 0 else 4,
        potential_sla_loss=1250000.0 if len(high_risk_shps) > 0 else 0.0,
        active_incidents=len(get_incidents(db))
    )

    options = [
        schemas.RecoveryOptionSchema(
            id="ACT-01",
            title="Assign Backup Vehicles from Bangalore DC",
            description="Deploy 2 backup freight trucks from Bangalore DC to intercept and split Chennai outbound cargo backlog.",
            estimated_cost=85000.0,
            expected_delay_reduction_hrs=4.2,
            sla_recovery_rate=93.0,
            shipments_saved=19,
            expected_benefit=930000.0,
            action_value_score=94.0,
            is_recommended=True
        ),
        schemas.RecoveryOptionSchema(
            id="ACT-02",
            title="Move Freight to Alternate Hub (Bangalore DC)",
            description="Reroute pending unassigned warehouse cross-docking to Bangalore Distribution Center.",
            estimated_cost=120000.0,
            expected_delay_reduction_hrs=3.5,
            sla_recovery_rate=88.0,
            shipments_saved=14,
            expected_benefit=750000.0,
            action_value_score=78.0,
            is_recommended=False
        ),
        schemas.RecoveryOptionSchema(
            id="ACT-03",
            title="Split Cargo into Expedited Micro-Batches",
            description="Divide heavy shipments into sprinter vans for immediate express transit directly to manufacturing plants.",
            estimated_cost=180000.0,
            expected_delay_reduction_hrs=4.8,
            sla_recovery_rate=91.0,
            shipments_saved=17,
            expected_benefit=890000.0,
            action_value_score=81.0,
            is_recommended=False
        ),
        schemas.RecoveryOptionSchema(
            id="ACT-04",
            title="Prioritize Tier-1 Strategic Accounts (ABC Mfg)",
            description="Fast-track dock dispatch exclusively for SLA-penalty contract customers.",
            estimated_cost=45000.0,
            expected_delay_reduction_hrs=2.8,
            sla_recovery_rate=86.0,
            shipments_saved=11,
            expected_benefit=580000.0,
            action_value_score=87.0,
            is_recommended=False
        ),
        schemas.RecoveryOptionSchema(
            id="ACT-05",
            title="Switch Transporter to Express Logistics Fleet",
            description="Reassign delayed consignments to Express Logistics India high-reliability corridor network.",
            estimated_cost=95000.0,
            expected_delay_reduction_hrs=3.1,
            sla_recovery_rate=87.0,
            shipments_saved=13,
            expected_benefit=690000.0,
            action_value_score=82.0,
            is_recommended=False
        )
    ]

    return schemas.SimulatorEvaluationResponse(
        baseline=baseline,
        options=options,
        best_action_id="ACT-01"
    )

def apply_recovery_plan(db: Session, action_id: str):
    sim = evaluate_recovery_simulation(db)
    selected_option = next((opt for opt in sim.options if opt.id == action_id), sim.options[0])

    delayed_shps = db.query(models.Shipment).filter(models.Shipment.delay_risk != "Low").all()
    resolved_count = len(delayed_shps) if len(delayed_shps) > 0 else 4

    for shp in delayed_shps:
        shp.delay_risk = "Low"
        shp.delay_probability = 8.5
        shp.predicted_eta = f"{shp.planned_eta} (Recovered: {selected_option.title})"

    all_whs = db.query(models.Warehouse).all()
    for wh in all_whs:
        wh.status = "Healthy"
        if wh.id == "WH-CHE-01":
            wh.current_utilization = 72.0
        elif wh.id == "WH-BOM-03":
            wh.current_utilization = 74.0
        elif wh.current_utilization > 80.0:
            wh.current_utilization = 70.0

    event = models.SupplyChainEvent(
        id=f"EVT-RECOVER-{uuid.uuid4().hex[:6].upper()}",
        entity_type="RecoverySimulator",
        entity_id=action_id,
        event_type="RECOVERY_PLAN_EXECUTED",
        timestamp=datetime.utcnow(),
        location="Supply Chain Command Center",
        source="Operator Applied What-If Plan",
        confidence=98.0,
        description=f"Applied Recovery Plan '{selected_option.title}'. Saved {selected_option.shipments_saved} shipments, recovered SLA to {selected_option.sla_recovery_rate}%, avoided Rs. {(selected_option.expected_benefit/100000):.2f}L financial loss."
    )
    db.add(event)

    db.query(models.Risk).filter(models.Risk.severity == "High").delete()

    db.commit()

    return schemas.ApplyRecoveryResponse(
        success=True,
        message=f"Successfully applied recovery plan: {selected_option.title}. All facility and shipment bottlenecks mitigated.",
        action_id=action_id,
        updated_on_time_rate=selected_option.sla_recovery_rate,
        resolved_shipments_count=resolved_count
    )

def calculate_predictive_delay_risk(db: Session, req: schemas.PredictRiskRequest):
    pred_prob, risk_tier, top_factors, delay_hours = ml_risk_engine.predict_risk(
        traffic=req.traffic_factor,
        wh_delay_mins=req.warehouse_delay_mins,
        veh_risk=req.vehicle_risk_factor,
        transporter_reliability=req.transporter_reliability or 85.0,
        hist_drift=req.historical_delay_factor or 30.0
    )

    shipment = get_shipment_by_id(db, req.shipment_id)
    base_eta = shipment.planned_eta if shipment else "2026-08-20 14:00"
    
    if delay_hours > 1.0:
        predicted_eta = f"{base_eta} (+{delay_hours} hrs predicted delay)"
    else:
        predicted_eta = f"{base_eta} (On Schedule)"

    if shipment:
        shipment.delay_risk = risk_tier.capitalize()
        shipment.delay_probability = pred_prob
        shipment.predicted_eta = predicted_eta
        db.commit()

    return schemas.PredictRiskResponse(
        shipment_id=req.shipment_id,
        delay_probability=pred_prob,
        risk_level=risk_tier,
        top_contributing_factors=[
            schemas.ContributingFactor(name=f["name"], weight=f["weight"], impact_score=f["impact_score"])
            for f in top_factors
        ],
        updated_predicted_eta=predicted_eta
    )

def process_copilot_query(db: Session, query_text: str):
    q = query_text.lower().strip()
    shipments = get_shipments(db)
    warehouses = get_warehouses(db)
    inventory = get_inventory_items(db)
    incidents = get_incidents(db)
    transporters = db.query(models.Transporter).all()
    sim = evaluate_recovery_simulation(db)

    # 1. SPECIFIC SHIPMENT LOOKUP (e.g. "status of SHP-2026-002", "where is SHP-2026-004")
    matching_shp = next((s for s in shipments if s.id.lower() in q or s.vehicle_id.lower() in q), None)
    if matching_shp:
        status_badge = "🔴 High Delay Risk" if matching_shp.delay_risk == "High" else "🟡 Medium Risk" if matching_shp.delay_risk == "Medium" else "🟢 On Schedule"
        answer = f"### 🚚 Telemetry Dossier: `{matching_shp.id}`\n\n" \
                 f"- **Route:** **{matching_shp.origin}** &rarr; **{matching_shp.destination}**\n" \
                 f"- **Customer:** **{matching_shp.customer}**\n" \
                 f"- **Assigned Carrier:** {matching_shp.transporter} (Vehicle: `{matching_shp.vehicle_id}`)\n" \
                 f"- **Current GPS Location:** `{matching_shp.current_location}`\n" \
                 f"- **Lifecycle Stage:** `{matching_shp.status}`\n" \
                 f"- **ML Risk Assessment:** **{status_badge}** ({matching_shp.delay_probability}% delay probability)\n" \
                 f"- **Schedule:** Planned ETA: `{matching_shp.planned_eta}` | **Predicted ETA:** `{matching_shp.predicted_eta}`\n\n" \
                 f"> 📡 *GPS signal is locked with real-time speed and route telemetry feeds.*"

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent="specific_shipment_lookup",
            key_metrics={
                "shipment_id": matching_shp.id,
                "delay_risk": matching_shp.delay_risk,
                "delay_prob": f"{matching_shp.delay_probability}%",
                "predicted_eta": matching_shp.predicted_eta
            },
            action_cards=[
                schemas.CopilotActionCard(
                    title=f"Inspect {matching_shp.id} in Digital Twin",
                    action_type="navigate_tab",
                    target=f"twin:{matching_shp.id}",
                    description="View isolated freight links and vehicle telemetry in Digital Twin."
                ),
                schemas.CopilotActionCard(
                    title=f"Track on Milestones Timeline",
                    action_type="navigate_tab",
                    target="shipments",
                    description="Open visual lifecycle timeline and predictive risk factor calculator."
                )
            ]
        )

    # 2. ALL WAREHOUSES OVERVIEW (e.g. "status of our warehouses", "all warehouses", "warehouse list")
    if any(k in q for k in ["status of our warehouse", "status of warehouse", "all warehouse", "warehouses status", "warehouses overview"]):
        wh_rows = "\n".join([
            f"- **{w.name}** (`{w.id}` - {w.location}): **{w.current_utilization}% Utilization** | Status: **{'🔴 Critical' if w.status == 'Critical' else '🟡 At Risk' if w.status == 'At Risk' else '🟢 Healthy'}** (Capacity: {w.capacity:,} units)"
            for w in warehouses
        ])
        answer = f"### 🏭 National Warehouse Network Status ({len(warehouses)} Facilities Connected)\n\n" \
                 f"Live sensor and storage capacity telemetry across all regional distribution centers:\n\n" \
                 f"{wh_rows}\n\n" \
                 f"> 📊 *Facility utilization is operating within nominal SLA thresholds across regional distribution centers.*"

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent="warehouses_overview",
            key_metrics={"total_warehouses": str(len(warehouses)), "avg_utilization": f"{sum(w.current_utilization for w in warehouses)/len(warehouses):.1f}%"},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Open Digital Twin Map",
                    action_type="navigate_tab",
                    target="twin",
                    description="Inspect all 4 warehouse facility nodes in the interactive network graph."
                ),
                schemas.CopilotActionCard(
                    title="View Risk Center",
                    action_type="navigate_tab",
                    target="risk",
                    description="Inspect active dock bottlenecks and correlated incidents."
                )
            ]
        )

    # 3. SPECIFIC WAREHOUSE LOOKUP (e.g. "Bangalore warehouse", "Mumbai DC", "Chennai status", "WH-BLR-02")
    matching_wh = next((w for w in warehouses if w.id.lower() in q or any(city in q for city in w.location.lower().split(',')) or w.name.lower() in q), None)
    if matching_wh and not any(k in q for k in ["all warehouse", "warehouses list", "summary"]):
        wh_shipments = [s for s in shipments if matching_wh.location.lower() in s.origin.lower() or matching_wh.location.lower() in s.destination.lower()]
        wh_inventory = [i for i in inventory if i.warehouse_id == matching_wh.id]
        total_items = sum(i.total_quantity for i in wh_inventory) if wh_inventory else 0

        status_color = "🔴 CRITICAL BOTTLENECK" if matching_wh.status == "Critical" else "🟡 AT RISK" if matching_wh.status == "At Risk" else "🟢 HEALTHY"

        answer = f"### 🏭 Facility Dossier: `{matching_wh.name}` (`{matching_wh.id}`)\n\n" \
                 f"- **Facility Status:** **{status_color}**\n" \
                 f"- **Geographic Location:** {matching_wh.location}\n" \
                 f"- **Current Capacity Utilization:** **{matching_wh.current_utilization}%** of {matching_wh.capacity:,} units\n" \
                 f"- **Active Inbound/Outbound Shipments:** **{len(wh_shipments)} consignments** ({', '.join([s.id for s in wh_shipments]) if wh_shipments else 'None'})\n" \
                 f"- **Stock Holding:** {total_items:,} units across {len(wh_inventory)} registered SKUs\n\n"

        if matching_wh.status == "Critical" or matching_wh.current_utilization > 85:
            answer += f"> ⚠️ **Bottleneck Alert:** Automated loading dock congestion is causing outbound queue latency. Mitigation recommended in Recovery Simulator."
        else:
            answer += f"> ✅ **Facility Health:** Inbound receipt and outbound dock dispatch throughput are operating within nominal SLA limits."

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent="specific_warehouse_lookup",
            key_metrics={
                "warehouse_id": matching_wh.id,
                "utilization": f"{matching_wh.current_utilization}%",
                "status": matching_wh.status,
                "connected_shipments": str(len(wh_shipments))
            },
            action_cards=[
                schemas.CopilotActionCard(
                    title=f"Inspect {matching_wh.id} in Digital Twin",
                    action_type="navigate_tab",
                    target=f"twin:{matching_wh.id}",
                    description=f"Focus and isolate {matching_wh.name} connections on the Digital Twin graph."
                ),
                schemas.CopilotActionCard(
                    title="View Active Incidents",
                    action_type="navigate_tab",
                    target="risk",
                    description="Trace upstream origin and downstream customer delivery impact."
                )
            ]
        )

    # 4. SPECIFIC CUSTOMER ACCOUNT LOOKUP (e.g. "ABC Manufacturing", "Titan Components", "Apex", "GreenEnergy")
    matching_cust_shps = [s for s in shipments if s.customer.lower() in q or any(w in q for w in s.customer.lower().split() if len(w) > 3)]
    if matching_cust_shps:
        cust_name = matching_cust_shps[0].customer
        delayed_count = len([s for s in matching_cust_shps if s.delay_risk != "Low"])
        shps_detail = "\n".join([
            f"- **{s.id}** ({s.origin} &rarr; {s.destination}): Status `{s.status}` | **{s.delay_risk} Risk** ({s.delay_probability}% delay prob) | ETA: `{s.predicted_eta}`"
            for s in matching_cust_shps
        ])

        answer = f"### 🏢 Strategic Customer Account: `{cust_name}`\n\n" \
                 f"- **Active Consignments:** **{len(matching_cust_shps)} shipments in transit**\n" \
                 f"- **Contractual SLA Exposure:** {'🔴 High Risk of Penalty Breach' if delayed_count > 0 else '🟢 Nominal On-Time Delivery'}\n\n" \
                 f"**Live Consignment Manifest:**\n" \
                 f"{shps_detail}\n\n" \
                 f"{'> 💡 *Priority dock clearance or backup vehicle split recommended for delayed orders.*' if delayed_count > 0 else '> ✅ *All orders tracking on schedule.*'}"

        cust_slug = f"CUST-{cust_name.replace(' ', '-').replace('.', '')[:8].upper()}"
        return schemas.CopilotQueryResponse(
            answer=answer,
            intent="customer_account_lookup",
            key_metrics={"customer": cust_name, "total_orders": str(len(matching_cust_shps)), "delayed": str(delayed_count)},
            action_cards=[
                schemas.CopilotActionCard(
                    title=f"Inspect {cust_name} in Digital Twin",
                    action_type="navigate_tab",
                    target=f"twin:{cust_slug}",
                    description="View customer supply chains and delivery linkages."
                ),
                schemas.CopilotActionCard(
                    title="Prioritize in Recovery Simulator",
                    action_type="navigate_tab",
                    target="simulator",
                    description="Run ACT-04 (Prioritize Tier-1 Strategic Accounts) to fast-track dispatch."
                )
            ]
        )

    # 5. SPECIFIC TRANSPORTER / CARRIER LOOKUP (e.g. "Titan Freight", "Express Logistics", "Deccan Roadways")
    matching_tr = next((t for t in transporters if t.name.lower() in q or any(w in q for w in t.name.lower().split() if len(w) > 3)), None)
    if matching_tr:
        tr_shps = [s for s in shipments if s.transporter.lower() == matching_tr.name.lower()]
        delayed_tr = len([s for s in tr_shps if s.delay_risk != "Low"])
        answer = f"### 🚛 Transporter Fleet Intelligence: `{matching_tr.name}`\n\n" \
                 f"- **Active Fleet Size:** `{matching_tr.active_vehicles}` registered heavy trucks\n" \
                 f"- **Historical Reliability Score:** **{matching_tr.reliability_score}%** ({'Tier-1 Carrier' if matching_tr.reliability_score > 90 else 'At Risk Carrier' if matching_tr.reliability_score < 80 else 'Standard Carrier'})\n" \
                 f"- **Currently Handling:** **{len(tr_shps)} active consignments** ({delayed_tr} exhibiting delay risk)\n\n" \
                 f"> 📊 *Transporter reliability score is weighted in the predictive ML delay risk ensemble.*"

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent="transporter_lookup",
            key_metrics={"carrier": matching_tr.name, "fleet": str(matching_tr.active_vehicles), "reliability": f"{matching_tr.reliability_score}%"},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Inspect Carrier in Digital Twin",
                    action_type="navigate_tab",
                    target="twin",
                    description="View active vehicles and network routes connected to this carrier."
                )
            ]
        )

    # 6. ML INTENT CLASSIFICATION VIA TF-IDF VECTORIZER & COSINE SIMILARITY
    intent, score = ml_copilot_engine.classify_intent(q)

    # Handle Intent 1: Shipment Delay Risk
    if intent == "shipment_risk" or any(k in q for k in ["shipment", "risk", "delayed", "delay", "late", "transit"]):
        delayed = [s for s in shipments if s.delay_risk in ["High", "Medium"]]
        if delayed:
            shps_md = "\n".join([
                f"- **{s.id}** ({s.origin} &rarr; {s.destination}): **{s.delay_risk} Risk** ({s.delay_probability}% prob) | Customer: *{s.customer}* | ETA: `{s.predicted_eta}`"
                for s in delayed
            ])
            answer = f"### ⚠️ Currently At-Risk Shipments ({len(delayed)} Total)\n\n" \
                     f"Our live Machine Learning telemetry engine identified **{len(delayed)} consignments** exhibiting high delay probability:\n\n" \
                     f"{shps_md}\n\n" \
                     f"> **Primary Driver:** Highway gridlock and Chennai loading dock dispatch queues are delaying Tier-1 customer deliveries."
        else:
            answer = "### ✅ All Shipments On Schedule\n\nAll active shipments are currently operating within nominal SLA windows with **Low delay risk (<10%)**."

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent=f"ml_intent:{intent} (score:{score})",
            key_metrics={"at_risk_count": str(len(delayed)), "total_active": str(len(shipments))},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Inspect Shipments Tracking",
                    action_type="navigate_tab",
                    target="shipments",
                    description="View real-time lifecycle progression timelines and live telemetry."
                ),
                schemas.CopilotActionCard(
                    title="Simulate Delay Mitigation",
                    action_type="navigate_tab",
                    target="simulator",
                    description="Evaluate backup vehicle deployment to recover SLA on-time rates."
                )
            ]
        )

    # Handle Intent 2: Warehouse Bottleneck
    elif intent == "warehouse_bottleneck" or any(k in q for k in ["warehouse", "bottleneck", "dock", "capacity", "chennai"]):
        chennai = next((w for w in warehouses if "chennai" in w.name.lower() or w.id == "WH-CHE-01"), warehouses[0])
        
        if chennai.status == "Healthy" and chennai.current_utilization < 80.0 and len(incidents) == 0:
            answer = f"### 🏭 Chennai Warehouse Health Status (`{chennai.id}`)\n\n" \
                     f"- **Current Status:** **🟢 HEALTHY**\n" \
                     f"- **Capacity Utilization:** **{chennai.current_utilization}%** (Nominal Buffer Flow)\n" \
                     f"- **Incident Status:** ✅ **Resolved**. Dispatch bottleneck was mitigated via backup vehicle split and dock balancing.\n" \
                     f"- **Downstream Impact:** All outbound shipments cleared on schedule with 0 SLA exposure."
        else:
            answer = f"### 🏭 Chennai Warehouse Exception Report (`{chennai.id}`)\n\n" \
                     f"- **Current Status:** **{chennai.status.upper()}**\n" \
                     f"- **Capacity Utilization:** **{chennai.current_utilization}%** (High Threshold Alert)\n" \
                     f"- **Root Cause:** Automated loading dock #3 mechanical failure combined with a 40% staff constraint causing severe outbound dispatch backlog.\n" \
                     f"- **Downstream Impact:** 4 queued shipments, 3 Tier-1 accounts affected (*ABC Manufacturing*, *Apex Automation*), and **₹12.50 Lakhs** potential contractual SLA loss.\n\n" \
                     f"💡 **Recommended Action:** Deploy 2 backup vehicles from Bangalore DC to split dispatch volume."

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent=f"ml_intent:{intent} (score:{score})",
            key_metrics={"utilization": f"{chennai.current_utilization}%", "status": chennai.status, "loss_exposure": "₹0.00" if len(incidents) == 0 else "₹12.50L"},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Inspect WH-CHE-01 in Digital Twin",
                    action_type="navigate_tab",
                    target="twin:WH-CHE-01",
                    description="Focus Chennai bottleneck links on the Digital Twin graph."
                ),
                schemas.CopilotActionCard(
                    title="View Incident in Risk Center",
                    action_type="navigate_tab",
                    target="risk",
                    description="Inspect the full 3-tier cascade dependency graph (Warehouse → Shipment → Customer)."
                )
            ]
        )

    # Handle Intent 3: Recovery Simulation
    elif intent == "recovery_simulation" or any(k in q for k in ["simulate", "recovery", "backup", "mitigat", "action", "what if", "roi", "savings"]):
        rec = sim.options[0]
        answer = f"### ⚡ What-If Recovery Simulation Analysis\n\n" \
                 f"Simulating **`{rec.id}`: {rec.title}** produces the highest Action Value Score (**{rec.action_value_score}/100**):\n\n" \
                 f"| Metric | Current Baseline | After Simulation | Delta |\n" \
                 f"| :--- | :--- | :--- | :--- |\n" \
                 f"| **On-Time Delivery Rate** | **78.0%** | **{rec.sla_recovery_rate}%** | <span style='color:#10b981'>**+15.0%**</span> |\n" \
                 f"| **Shipments Saved** | 0 | **{rec.shipments_saved}** | +{rec.shipments_saved} recovered |\n" \
                 f"| **Estimated Plan Cost** | ₹0 | **₹{(rec.estimated_cost/1000):.0f}K** | Direct OPEX |\n" \
                 f"| **Net SLA Loss Avoided** | ₹0 | **₹{(rec.expected_benefit/100000):.2f}L** | <span style='color:#10b981'>**₹9.30L Saved**</span> |\n\n" \
                 f"> 🚀 **ROI Multiple:** 10.9x return on mitigation expenditure."

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent=f"ml_intent:{intent} (score:{score})",
            key_metrics={"best_action": rec.id, "value_score": str(rec.action_value_score), "projected_on_time": f"{rec.sla_recovery_rate}%"},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Execute Plan in Simulator",
                    action_type="navigate_tab",
                    target="simulator",
                    description="Apply the backup vehicle recovery plan to restore production schedules."
                )
            ]
        )

    # Handle Intent 4: Inventory Truth
    elif intent == "inventory_truth" or any(k in q for k in ["inventory", "sku", "truth", "stock", "mismatch", "quantity"]):
        sku_item = next((i for i in inventory if i.sku.lower() in q or i.product_name.lower() in q), inventory[0] if inventory else None)
        sku_code = sku_item.sku if sku_item else "SKU-IND-001"
        confidence = sku_item.confidence_score if sku_item else 96.5

        answer = f"### 📦 Multi-State Inventory Truth (`{sku_code}`)\n\n" \
                 f"- **Product:** {sku_item.product_name if sku_item else 'High-Tensile Fasteners'}\n" \
                 f"- **Warehouse:** `{sku_item.warehouse_id if sku_item else 'WH-CHE-01'}`\n" \
                 f"- **Truth Engine Confidence Score:** **{confidence}%** ({'Verified' if confidence > 85 else 'Audit Required'})\n" \
                 f"- **Total Recorded Count:** `{sku_item.total_quantity if sku_item else 4500}` units\n" \
                 f"- **Available for Dispatch:** `{sku_item.available_quantity if sku_item else 2800}` units\n" \
                 f"- **Reserved:** `{sku_item.reserved_quantity if sku_item else 900}` | **In Transit:** `{sku_item.in_transit_quantity if sku_item else 500}`\n" \
                 f"- **Quality Hold:** `{sku_item.quality_hold_quantity if sku_item else 100}` units\n\n" \
                 f"{'⚠️ *Digital-Physical Mismatch Detected during cycle count audit.*' if sku_item and sku_item.has_mismatch else '✅ *WMS records reconciled with physical RFID scans.*'}"

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent=f"ml_intent:{intent} (score:{score})",
            key_metrics={"sku": sku_code, "confidence": f"{confidence}%", "available": str(sku_item.available_quantity if sku_item else 2800)},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Inspect Inventory Truth",
                    action_type="navigate_tab",
                    target="inventory",
                    description="Filter by warehouse or test the cycle count mismatch simulator."
                )
            ]
        )

    # Handle Intent 5: Executive Network Summary
    else:
        crit_count = len([w for w in warehouses if w.status == "Critical"]) + len([s for s in shipments if s.delay_risk == "High"])
        answer = f"### 🌐 Executive Supply Chain Intelligence Brief\n\n" \
                 f"- **Network Health:** **{94.2 if crit_count == 0 else 78.0}% On-Time Delivery Rate**\n" \
                 f"- **Connected Facilities:** {len(warehouses)} Warehouses active across India ({', '.join([w.location for w in warehouses])})\n" \
                 f"- **Active In-Transit Consignments:** {len(shipments)} Shipments tracked via live telemetry\n" \
                 f"- **Active Incident Exceptions:** {len(incidents)} Correlated Root-Cause Clusters (**₹12.50 Lakhs** SLA exposure)\n\n" \
                 f"**Quick Recommendations:**\n" \
                 f"1. Review the **Chennai Dock Bottleneck** in the Risk Center.\n" \
                 f"2. Run the **What-If Recovery Simulator** to deploy backup vehicles and restore on-time delivery.\n\n" \
                 f"*Try asking:* `'status of SHP-2026-001'`, `'where is Titan Components cargo'`, `'Bangalore warehouse utilization'`"

        return schemas.CopilotQueryResponse(
            answer=answer,
            intent=f"ml_intent:{intent} (score:{score})",
            key_metrics={"on_time_rate": "78.0%", "facilities": str(len(warehouses)), "incidents": str(len(incidents))},
            action_cards=[
                schemas.CopilotActionCard(
                    title="Open Command Dashboard",
                    action_type="navigate_tab",
                    target="dashboard",
                    description="Real-time KPI cards, warehouse utilization, and live event feeds."
                ),
                schemas.CopilotActionCard(
                    title="Open Supply Chain Twin",
                    action_type="navigate_tab",
                    target="twin",
                    description="Explore the full 4-echelon visual network topology."
                )
            ]
        )

def get_digital_twin_graph(db: Session):
    warehouses = get_warehouses(db)
    shipments = get_shipments(db)
    transporters = db.query(models.Transporter).all()

    nodes = []
    edges = []

    wh_coords = {
        "WH-CHE-01": (120, 100),
        "WH-BLR-02": (120, 240),
        "WH-BOM-03": (120, 380),
        "WH-HYD-04": (120, 520),
    }

    for idx, wh in enumerate(warehouses):
        coords = wh_coords.get(wh.id, (120, 100 + idx * 130))
        status = wh.status
        if wh.current_utilization > 88:
            status = "Critical"
        elif wh.current_utilization > 80:
            status = "At Risk"

        nodes.append(schemas.TwinNodeSchema(
            id=wh.id,
            label=wh.name,
            sub_label=wh.location,
            type="warehouse",
            status=status,
            x=coords[0],
            y=coords[1],
            metrics={
                "capacity": f"{wh.capacity:,} units",
                "utilization": f"{wh.current_utilization}%",
                "status": status,
                "type": "Primary Logistics Facility"
            }
        ))

    transporter_map = {}
    for idx, tr in enumerate(transporters):
        y_pos = 130 + idx * 170
        t_id = f"TR-0{idx+1}"
        transporter_map[tr.name] = t_id
        
        status = "Healthy"
        if tr.reliability_score < 75.0:
            status = "Critical"
        elif tr.reliability_score < 85.0:
            status = "At Risk"

        nodes.append(schemas.TwinNodeSchema(
            id=t_id,
            label=tr.name,
            sub_label=f"Fleet: {tr.active_vehicles} trucks",
            type="transporter",
            status=status,
            x=360,
            y=y_pos,
            metrics={
                "active_fleet": tr.active_vehicles,
                "reliability_score": f"{tr.reliability_score}%",
                "sla_rating": "Tier-1 Carrier" if tr.reliability_score > 90 else "Standard Carrier"
            }
        ))

    customer_set = {}
    for idx, shp in enumerate(shipments):
        y_pos = 80 + idx * 110
        status = "Healthy"
        if shp.delay_risk == "High":
            status = "Critical"
        elif shp.delay_risk == "Medium":
            status = "At Risk"

        nodes.append(schemas.TwinNodeSchema(
            id=shp.id,
            label=f"{shp.id} ({shp.vehicle_id})",
            sub_label=f"{shp.current_location}",
            type="shipment",
            status=status,
            x=620,
            y=y_pos,
            metrics={
                "status": shp.status,
                "delay_risk": shp.delay_risk,
                "delay_prob": f"{shp.delay_probability}%",
                "planned_eta": shp.planned_eta,
                "predicted_eta": shp.predicted_eta,
                "customer": shp.customer
            }
        ))

        origin_wh = next((w for w in warehouses if w.location.lower() in shp.origin.lower() or shp.origin.lower() in w.name.lower()), warehouses[0] if warehouses else None)
        if origin_wh:
            is_bottleneck = status == "Critical" or origin_wh.status == "Critical"
            edges.append(schemas.TwinEdgeSchema(
                id=f"EDGE-{origin_wh.id}-{shp.id}",
                source=origin_wh.id,
                target=shp.id,
                label=f"Dispatch",
                status="Critical" if is_bottleneck else "Healthy",
                is_bottleneck=is_bottleneck
            ))

        t_id = transporter_map.get(shp.transporter, "TR-01")
        edges.append(schemas.TwinEdgeSchema(
            id=f"EDGE-{t_id}-{shp.id}",
            source=t_id,
            target=shp.id,
            label=f"Transit",
            status=status,
            is_bottleneck=status == "Critical"
        ))

        cust_slug = f"CUST-{shp.customer.replace(' ', '-').replace('.', '')[:8].upper()}"
        if cust_slug not in customer_set:
            customer_set[cust_slug] = {
                "name": shp.customer,
                "shipments": [shp.id],
                "status": status
            }
        else:
            customer_set[cust_slug]["shipments"].append(shp.id)
            if status == "Critical":
                customer_set[cust_slug]["status"] = "Critical"

    for idx, (c_id, c_data) in enumerate(customer_set.items()):
        y_pos = 110 + idx * 130
        nodes.append(schemas.TwinNodeSchema(
            id=c_id,
            label=c_data["name"],
            sub_label=f"{len(c_data['shipments'])} Consignments",
            type="customer",
            status=c_data["status"],
            x=880,
            y=y_pos,
            metrics={
                "customer_account": c_data["name"],
                "active_orders": len(c_data["shipments"]),
                "sla_tier": "Strategic Partner (Priority A)",
                "contract_risk": "High SLA Penalty Exposure" if c_data["status"] == "Critical" else "On Track"
            }
        ))

        for shp_id in c_data["shipments"]:
            shp = next((s for s in shipments if s.id == shp_id), None)
            shp_status = "Critical" if shp and shp.delay_risk == "High" else "Healthy"
            edges.append(schemas.TwinEdgeSchema(
                id=f"EDGE-{shp_id}-{c_id}",
                source=shp_id,
                target=c_id,
                label="Delivery",
                status=shp_status,
                is_bottleneck=shp_status == "Critical"
            ))

    health_summary = {
        "Healthy": len([n for n in nodes if n.status == "Healthy"]),
        "At Risk": len([n for n in nodes if n.status == "At Risk"]),
        "Critical": len([n for n in nodes if n.status == "Critical"])
    }

    return schemas.TwinGraphResponse(
        nodes=nodes,
        edges=edges,
        health_summary=health_summary
    )
