# 🌐 CHAINSIGHT AI — Autonomous Digital Supply Chain Visibility & Predictive Recovery Engine

[![Python 3.14+](https://img.shields.io/badge/Python-3.14+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-ML_Ensemble-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Executive Summary & Problem Statement

Modern enterprise manufacturing and distribution networks suffer from **isolated data silos, phantom inventory discrepancies, delayed bottleneck awareness, and panic-driven reactive firefighting**. A single automated loading dock breakdown or highway gridlock ripples across multi-tier supplier ecosystems, triggering cascading SLA breaches and millions in contractual penalties.

**CHAINSIGHT AI** is a next-generation, real-time autonomous supply chain intelligence and visibility platform. It bridges physical IoT telemetry with digital enterprise planning by continuously harmonizing WMS warehouse feeds, GPS fleet beacons, carrier performance records, and ERP systems.

### 🌟 Key Innovations:
1. **Multi-State Inventory Truth Engine**: Reconciles digital-vs-physical stock across 5 granular lifecycle states, eliminating ghost inventory with mathematical confidence scoring.
2. **Predictive Delay Risk Engine**: Employs a trained **Random Forest & Gradient Boosting ML ensemble** to forecast transit and dock delays hours before they occur, complete with dynamic feature attribution.
3. **Root Cause & Exception Intelligence (Risk Center)**: Correlates isolated anomalies into grouped incident clusters and visualizes a **3-Tier Cascade Propagation Graph** (Facility &rarr; Queued Shipments &rarr; Impacted Customer SLA Accounts).
4. **Autonomous What-If Recovery Simulator**: Ranks and evaluates 5 strategic mitigation actions using a mathematical **Action Value Score (ROI vs Cost)** with database persistence that restores operational metrics.
5. **Multi-Echelon Supply Chain Digital Twin**: Interactive hardware-accelerated SVG topology (Warehouses &rarr; Transporters &rarr; Cargo &rarr; Customers) with **Isolated Node Route Focus** that eliminates visual canvas clutter.
6. **Context-Aware AI Supply Chain Copilot**: Conversational assistant powered by **TF-IDF Neural Vector space search & Cosine Similarity**, with live database entity resolution and token streaming.
7. **Interactive Judge Demo Tour**: 6-stage guided walkthrough enabling evaluators and judges to experience the end-to-end supply chain narrative in minutes.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (React 19 + TypeScript + Vite)                  │
│  - Command Dashboard (Live KPIs, IoT Event Ticker, Regional Facility Utilization)     │
│  - Multi-State Inventory Truth Engine (5 States, Confidence Score, Mismatch Simulator) │
│  - Shipment Tracker (8-Stage Milestone Timeline, ML Feature Attribution Sliders)       │
│  - Risk Center (Incident Clustering, 3-Tier Dependency Graph, SLA Loss Calculation)    │
│  - What-If Recovery Simulator (5 Mitigation Plans, Action Value Scoring Matrix)        │
│  - Digital Twin Mesh (Interactive SVG, 4-Echelon Topology, Focused Route Isolation)   │
│  - AI Supply Chain Copilot (Vector Similarity Search, Autoregressive Token Streaming)  │
│  - Judge Demo Tour (6-Step Interactive Walkthrough Modal)                              │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / RESTful API (JSON Telemetry)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER (FastAPI + Python 3.14+)                         │
│  - REST Endpoints (`/api/dashboard`, `/api/shipments`, `/api/simulator`, `/api/twin`) │
│  - Predictive ML Risk Engine (`RandomForestRegressor` + `GradientBoostingClassifier`)   │
│  - NLP Semantic Search Engine (`TfidfVectorizer` + Cosine Intent Embeddings)           │
│  - Autonomous Recovery Dispatcher & Dynamic Incident Resolver                         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ SQLAlchemy ORM
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       RELATIONAL DATABASE (SQLite / SQL Engine)                        │
│  - Warehouses, Transporters, InventoryItems, Shipments, Risks, SupplyChainEvents       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧮 Mathematical Formulations

### 1. Predictive Delay Risk Formulation ($P(\text{delay})$)
The delay risk probability is computed via an ensemble of a **Random Forest Regressor** ($100$ estimators) and **Gradient Boosting Classifier** trained over multi-factor logistics telemetry:

$$P(\text{delay}) = w_1 \cdot \text{Traffic} + w_2 \cdot \text{WH}_{\text{delay}} + w_3 \cdot \text{Veh}_{\text{risk}} + w_4 \cdot (100 - \text{Carrier}_{\text{rel}}) + w_5 \cdot \text{Route}_{\text{drift}} + \gamma(\text{Traffic} \times \text{WH})$$

Where:
- $w_1 \approx 0.22$: Highway Congestion Index ($0-100\%$)
- $w_2 \approx 0.26$: Warehouse Loading Dock Queue Backlog ($0-180\text{ mins}$)
- $w_3 \approx 0.20$: Fleet Mechanical & Telemetry Risk Factor ($0-100\%$)
- $w_4 \approx 0.18$: Transporter Carrier Unreliability ($100 - \text{Score}$)
- $w_5 \approx 0.14$: Historical Route Transit Drift
- $\gamma \approx 0.05$: Multi-echelon bottleneck interaction penalty

---

### 2. Autonomous Action Value Score ($\text{AVS}$)
To rank and recommend optimal mitigation actions $A_i$ in the Recovery Simulator:

$$\text{AVS}(A_i) = \left( \alpha \cdot \frac{\Delta \text{SLA Recovery Rate}}{100} + \beta \cdot \frac{\text{Shipments Saved}}{N_{\text{total}}} + \delta \cdot \frac{\text{Net SLA Loss Avoided}}{\text{Plan Cost}} \right) \times 100$$

- **`ACT-01` (Assign Backup Vehicles)** achieves an **Action Value Score of 94/100** with an **ROI Multiple of 10.9x** ($\text{₹9.30 Lakhs Benefit} / \text{₹85,000 Cost}$).

---

### 3. Multi-State Inventory Truth Confidence Score
Traditional ERPs only record binary on-hand stock. CHAINSIGHT monitors 5 operational states:

$$\text{Total Quantity} = Q_{\text{available}} + Q_{\text{reserved}} + Q_{\text{picking}} + Q_{\text{in\_transit}} + Q_{\text{quality\_hold}}$$

$$\text{Confidence Score} = 100\% - \left( \frac{|\text{Physical RFID Scan} - \text{ERP Count}|}{\text{Total Quantity}} \times 100\% \right) - \text{Cycle Audit Decay}$$

---

## 📂 Project Directory Structure

```
SIH/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI REST application & routing
│   │   ├── models.py          # SQLAlchemy ORM database models
│   │   ├── schemas.py         # Pydantic validation schemas
│   │   ├── crud.py            # Data access, ML execution & simulation logic
│   │   ├── database.py        # SQLite engine & session management
│   │   ├── ml_engine.py       # Scikit-Learn ML ensemble & TF-IDF NLP model
│   │   └── seed.py            # Initial database seed dataset
│   ├── run.py                 # Backend launch script (Uvicorn)
│   ├── test_ml.py             # Machine learning test harness
│   └── test_query.py          # AI Copilot test harness
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts      # Typed API client functions
│   │   ├── components/
│   │   │   ├── Header.tsx     # Ticker, Demo Tour trigger, Sync, Reset
│   │   │   ├── Sidebar.tsx    # Navigation hub
│   │   │   ├── KPICards.tsx   # Dashboard executive metric cards
│   │   │   ├── WarehouseUtilChart.tsx # Regional capacity bars
│   │   │   ├── ShipmentStatusChart.tsx# Status distribution donut
│   │   │   ├── HighRiskEvents.tsx     # Real-time event stream
│   │   │   ├── PredictiveRiskCalculator.tsx # Interactive ML sliders
│   │   │   └── DemoTourModal.tsx      # 6-step Judge Demo walkthrough
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Executive command center
│   │   │   ├── Inventory.tsx          # 5-state stock & mismatch audit
│   │   │   ├── Shipments.tsx          # 8-stage milestone lifecycle tracking
│   │   │   ├── RiskCenter.tsx         # 3-tier cascade graph & bottlenecks
│   │   │   ├── RecoverySimulator.tsx  # What-if optimization matrix
│   │   │   ├── DigitalTwin.tsx        # 4-echelon SVG mesh with route isolation
│   │   │   └── AICopilot.tsx          # NLP chat with token streaming
│   │   ├── types/
│   │   │   └── index.ts       # Shared TypeScript interfaces
│   │   ├── App.tsx            # Main shell & persistent state manager
│   │   └── main.tsx           # React DOM root entry
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## ⚡ Quickstart Guide (Step-by-Step)

### System Requirements:
- **Python**: 3.11+ (Python 3.14 recommended)
- **Node.js**: 20.0+ / npm 10+
- **Git**

---

### Step 1: Clone Repository
```powershell
git clone https://github.com/mohamedrayhan/SupplyChain.git
cd SupplyChain
```

---

### Step 2: Set Up & Run Backend
```powershell
# 1. Navigate to backend folder
cd backend

# 2. Install Python dependencies
py -m pip install fastapi uvicorn sqlalchemy pydantic scikit-learn numpy scipy

# 3. Seed initial database records
py -m app.seed

# 4. Start FastAPI server (Runs on http://127.0.0.1:8000)
py run.py
```

*Interactive Swagger API documentation is available at: **`http://127.0.0.1:8000/docs`***

---

### Step 3: Set Up & Run Frontend
```powershell
# Open a new terminal window
cd frontend

# 1. Install Node modules
npm install

# 2. Start Vite development server (Runs on http://localhost:5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🏆 Hackathon Judge Demo Script (6-Step Walkthrough)

Click the **`[⚡ Judge Demo Tour]`** button in the header bar to launch the guided demonstration:

1. **Executive Command Center (`/dashboard`)**:
   - Inspect live KPI tiles (Active Shipments, 78% Disrupted vs 93% Baseline On-Time Rate, Inventory Confidence).
   - Review regional warehouse utilization across Chennai, Bangalore, Mumbai, and Hyderabad.
2. **Multi-State Inventory Truth (`/inventory`)**:
   - Review the 5 inventory buffer states for `SKU-IND-001`.
   - Click **`[Simulate Mismatch]`** to witness the confidence score drop and flag a physical-to-ERP cycle count variance.
3. **Predictive Delay Risk Engine (`/shipments`)**:
   - Select consignment `SHP-2026-001`.
   - Adjust the **Highway Traffic (90%)** and **Warehouse Queue (120 min)** sliders to watch the live **Random Forest** model recalculate delay probability and feature importance weights in real-time.
4. **Root Cause & Exception Intelligence (`/risk`)**:
   - Click **`[Simulate Warehouse Bottleneck]`** to trigger loading dock failure.
   - Trace the **3-Tier Cascade Graph** (Chennai Dock &rarr; 3 Queued Trucks &rarr; 3 Strategic Accounts) with ₹12.50 Lakhs loss exposure.
5. **What-If Autonomous Recovery Simulator (`/simulator`)**:
   - Compare 5 strategic recovery plans scored by Action Value Score.
   - Select **`ACT-01` (Assign Backup Vehicles)** & click **`[Apply Recovery Plan to Production]`** to persist the resolution and restore On-Time delivery to 93%.
6. **Digital Twin & AI Supply Chain Copilot (`/twin` & `/copilot`)**:
   - In **Digital Twin**, toggle **`[Focused Node Routes Isolated]`** to view clean, non-congested route linkages.
   - In **AI Copilot**, type: *"Why is Chennai delayed?"* or *"What is the status of SHP-2026-002?"* to experience live TF-IDF neural vector search and token streaming.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns executive KPIs, utilization, event stream, and alerts |
| `GET` | `/api/inventory` | Returns all SKUs with 5-state stock breakdown & confidence scores |
| `POST` | `/api/inventory/simulate-mismatch` | Triggers a digital-physical cycle count discrepancy |
| `GET` | `/api/shipments` | Returns all consignments with 8-stage lifecycle milestones |
| `POST` | `/api/shipments/simulate-delay` | Injects transit traffic delay into active cargo |
| `POST` | `/api/predict-delay` | Runs real-time Random Forest ML ensemble inference |
| `GET` | `/api/incidents` | Returns correlated root-cause incident clusters & cascade trees |
| `POST` | `/api/incidents/simulate-bottleneck` | Triggers a warehouse dock capacity crisis |
| `GET` | `/api/simulator/evaluate` | Evaluates 5 what-if recovery options with Action Value Scores |
| `POST` | `/api/simulator/apply` | Persists selected recovery plan to database |
| `GET` | `/api/twin/graph` | Returns 4-echelon nodes, edges, and health summary |
| `POST` | `/api/copilot/query` | NLP vector cosine search with entity lookup |
| `POST` | `/api/demo/reset` | Resets all database tables to initial pristine seed state |

---

## 👥 Contributors & Hackathon Team
- **Platform Architecture & Engineering**: Mohamed Rayhan & Team
- **Repository**: [https://github.com/mohamedrayhan/SupplyChain](https://github.com/mohamedrayhan/SupplyChain)

---
*Built for the Smart India Hackathon (SIH) — Autonomous Enterprise Supply Chain Visibility & Intelligence.*
