# 🌐 CHAINSIGHT AI

> **Autonomous Digital Supply Chain Visibility, Predictive Risk Forecasting & What-If Recovery Platform**

[![Python 3.14+](https://img.shields.io/badge/Python-3.14+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-ML_Ensemble-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)

---

## 📌 Problem Statement & Executive Summary

Modern enterprise supply chains face **blind spots, phantom inventory, delayed exception detection, and reactive panic mitigation**. A single loading dock breakdown or highway gridlock ripples across multi-tier networks, resulting in cascading SLA breaches and millions in contractual penalties.

**CHAINSIGHT AI** is a real-time autonomous supply chain intelligence operating system that bridges physical telemetry with digital operations. It continuously ingests IoT GPS beacons, warehouse WMS queues, carrier reliability metrics, and ERP records to:
1. **Detect disruptions hours before they materialize** using a trained Random Forest & Gradient Boosting ML model.
2. **Reconcile physical-to-digital inventory truth** across 5 distinct lifecycle states to eliminate ghost inventory.
3. **Trace 3-tier cascade root cause dependencies** (Warehouse Bottleneck &rarr; Queued Shipments &rarr; Impacted Customer SLA Accounts).
4. **Simulate and optimize what-if mitigation plans** based on mathematical **Action Value Scoring (ROI vs Cost)**.
5. **Provide a full 4-echelon Digital Twin** and **context-aware conversational AI Copilot** with live database access.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (React 19 + TypeScript)              │
│  - Command Dashboard (Live KPIs, IoT Event Feeds, Utilization Bars)        │
│  - Inventory Truth Engine (5 Buffer States, Confidence Scoring, RFID Scan) │
│  - Shipments Tracking (8-Stage Milestone Timeline, ML Delay Sliders)       │
│  - Risk Center (Incident Clustering, 3-Tier Dependency Propagation Graph)  │
│  - Recovery Simulator (What-If Optimization Matrix, Action Value Score)    │
│  - Supply Chain Digital Twin (Interactive SVG Mesh, Node Route Isolation)  │
│  - AI Supply Chain Copilot (TF-IDF Vector Space, Autoregressive Streaming)  │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ REST API / JSON Telemetry
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER (FastAPI + Python)                   │
│  - RESTful Endpoints (`/api/dashboard`, `/api/shipments`, `/api/simulator`)│
│  - Predictive Delay ML Engine (`RandomForestRegressor` + `GradientBoost`)  │
│  - NLP Vector Engine (`TfidfVectorizer` + Cosine Similarity Intent Search) │
│  - Operational CRUD & Telemetry Dispatcher                                 │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ SQLAlchemy ORM
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       PERSISTENT DATABASE (SQLite / SQL)                   │
│  - Warehouses, Transporters, InventoryItems, Shipments, Risks, Events      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧮 Mathematical Formulations & Algorithms

### 1. Predictive Delay Risk Engine Formulation

The delay probability $P(\text{delay})$ is computed by an ensemble of a **Random Forest Regressor** and **Gradient Boosting Classifier** trained over synthetic Indian manufacturing logistics telemetry:

$$P(\text{delay}) = w_1 \cdot \text{Traffic} + w_2 \cdot \text{WH}_{\text{delay}} + w_3 \cdot \text{Veh}_{\text{risk}} + w_4 \cdot (100 - \text{Carrier}_{\text{rel}}) + w_5 \cdot \text{Route}_{\text{drift}} + \gamma(\text{Traffic} \times \text{WH})$$

Where:
- $w_1 \approx 0.22$ (Highway Traffic Congestion Index, $0-100\%$)
- $w_2 \approx 0.26$ (Warehouse Loading Dock Queue Delay Normalized, $0-180\text{ mins}$)
- $w_3 \approx 0.20$ (Vehicle Fleet Engine & Wear Factor, $0-100\%$)
- $w_4 \approx 0.18$ (Carrier Transporter Historical Unreliability)
- $w_5 \approx 0.14$ (Historical Route Bottleneck Factor)
- $\gamma \approx 0.05$ (Non-linear cross-echelon bottleneck interaction term)

---

### 2. Autonomous Action Value Score (What-If Optimization)

To rank and recommend the optimal mitigation strategy among competing recovery actions $A_i$, the engine evaluates:

$$\text{AVS}(A_i) = \left( \alpha \cdot \frac{\Delta \text{SLA Recovery Rate}}{100} + \beta \cdot \frac{\text{Shipments Saved}}{N_{\text{total}}} + \delta \cdot \frac{\text{Net SLA Benefit Avoided}}{\text{Plan Cost}} \right) \times 100$$

- **`ACT-01` (Assign Backup Vehicles)** achieves an **Action Value Score of 94/100** with an **ROI Multiple of 10.9x** ($\text{₹9.30 Lakhs Benefit} / \text{₹85,000 Cost}$).

---

### 3. Multi-State Inventory Truth Confidence Score

Unlike traditional ERPs that only report binary On-Hand quantity, CHAINSIGHT tracks 5 operational states:

$$\text{Total Quantity} = Q_{\text{available}} + Q_{\text{reserved}} + Q_{\text{picking}} + Q_{\text{in\_transit}} + Q_{\text{quality\_hold}}$$

$$\text{Confidence Score} = 100\% - \left( \frac{|\text{Physical Scan} - \text{ERP Record}|}{\text{Total Quantity}} \times 100\% \right) - \text{Cycle Audit Decay}$$

---

## ⚡ Quickstart Guide (Local Setup)

### Prerequisites:
- **Python**: 3.11+ (Python 3.14 supported)
- **Node.js**: 20+ / npm 10+
- **Git**

---

### 1. Backend Setup & Run:
```powershell
# Navigate to backend directory
cd backend

# Install Python ML and web dependencies
py -m pip install fastapi uvicorn sqlalchemy pydantic scikit-learn numpy scipy

# Seed initial database records
py -m app.seed

# Start the FastAPI server (runs on http://127.0.0.1:8000)
py run.py
```

---

### 2. Frontend Setup & Run:
```powershell
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite React development server (runs on http://localhost:5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🏆 Hackathon Judge Demo Script (6-Step Walkthrough)

Click the **`[⚡ Judge Demo Tour]`** button in the top navigation bar to open the interactive guided walkthrough:

1. **Stage 1: Executive Command Center (`/dashboard`)**:
   - Review live KPI tiles (Active Shipments, 78% Disrupted vs 93% Baseline On-Time Rate, Inventory Confidence).
   - Inspect regional warehouse utilization bars and live IoT event ticker.

2. **Stage 2: Multi-State Inventory Truth (`/inventory`)**:
   - Inspect granular stock states for `SKU-IND-001`.
   - Click **`[Simulate Mismatch]`** to witness real-time ERP-to-Physical audit variance detection.

3. **Stage 3: Predictive Delay Risk Engine (`/shipments`)**:
   - Select consignment `SHP-2026-001`.
   - Adjust the **Traffic Congestion (90%)** and **Warehouse Delay (120 min)** sliders to observe live Random Forest delay forecasting and feature attribution breakdown.

4. **Stage 4: Root Cause Exception Intelligence (`/risk`)**:
   - Click **`[Simulate Warehouse Bottleneck]`** to trigger loading dock mechanical failure.
   - Inspect the **3-Tier Cascade Graph** (Warehouse &rarr; Queued Cargo &rarr; Customer SLA Risk) with ₹12.50 Lakhs loss exposure.

5. **Stage 5: Autonomous What-If Recovery Simulator (`/simulator`)**:
   - Compare 5 strategic mitigation plans scored by Action Value Score.
   - Select **`ACT-01` (Assign Backup Vehicles)** & click **`[Apply Recovery Plan to Production]`** to persist changes and restore On-Time delivery to 93%.

6. **Stage 6: Digital Twin & AI Supply Chain Copilot (`/twin` & `/copilot`)**:
   - Open **Supply Chain Twin** and toggle **Focused Node Routes Isolated** to view clean, non-congested route linkages.
   - Open **AI Copilot** and ask custom questions (*"Why is Chennai delayed?"*, *"What is the status of SHP-2026-002?"*) to experience live TF-IDF neural vector retrieval with autoregressive token streaming.

---

## 📦 Tech Stack Summary

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | High-performance reactive UI |
| **Styling & Theme** | Tailwind CSS v4 | Dark Enterprise Obsidian Aesthetic (`#060911`) |
| **Icons & Visuals** | Lucide React + SVG | Hardware acceleration & animated node mesh |
| **Backend API** | FastAPI + Uvicorn | High-throughput asynchronous REST engine |
| **Machine Learning** | Scikit-Learn + NumPy | Random Forest Regressor & Gradient Boosting |
| **NLP Engine** | TF-IDF + Cosine Vectors | Vector similarity search & entity resolution |
| **Database** | SQLite + SQLAlchemy ORM | ACID-compliant relational data persistence |

---

## 👥 Contributors & Hackathon Team
- **Platform Architecture & Development**: Mohamed Rayhan & Team
- **Repository**: [https://github.com/mohamedrayhan/SupplyChain](https://github.com/mohamedrayhan/SupplyChain)

---
*Built with ❤️ for real-time autonomous enterprise supply chain resilience.*
