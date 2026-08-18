# 🌐 CHAINSIGHT — Autonomous Multi-Echelon Supply Chain Intelligence & Execution Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0+-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg)](https://scikit-learn.org/)
[![Polygon L2](https://img.shields.io/badge/Blockchain-Polygon_L2-8247E5.svg)](https://polygon.technology/)
[![Chainlink Oracle](https://img.shields.io/badge/Oracles-Chainlink_DON-375BD2.svg)](https://chain.link/)

> **CHAINSIGHT** is a next-generation, self-healing **Autonomous Supply Chain Operational Intelligence Platform**. It unites **Real-Time IoT Telemetry**, **Digital-Physical Inventory Reconciliation**, **Predictive Machine Learning Delay Forecasting**, **Autonomous Multi-Agent AI Swarms**, **Polygon Layer-2 Smart Contract Escrows**, **Graph Convolutional Networks (GNN)**, and **Deep Reinforcement Learning (PPO)** to detect bottlenecks and remediate disruptions in real time.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Comprehensive Feature Capabilities](#-comprehensive-feature-capabilities)
  - [1. Executive Command Center & Telemetry Stream](#1-executive-command-center--telemetry-stream)
  - [2. Multi-State Inventory Truth Engine](#2-multi-state-inventory-truth-engine)
  - [3. Predictive Delay Risk Engine (Scikit-Learn ML)](#3-predictive-delay-risk-engine-scikit-learn-ml)
  - [4. Root Cause & Exception Intelligence](#4-root-cause--exception-intelligence)
  - [5. What-If Autonomous Recovery Simulator](#5-what-if-autonomous-recovery-simulator)
  - [6. Multi-Echelon Digital Twin & AI Copilot](#6-multi-echelon-digital-twin--ai-copilot)
  - [7. Autonomous Multi-Agent AI Swarm & Spot Auction](#7-autonomous-multi-agent-ai-swarm--spot-auction)
  - [8. Blockchain Smart Contracts & IoT Oracle Escrow](#8-blockchain-smart-contracts--iot-oracle-escrow)
  - [9. GNN Multi-Hop Risk Diffusion & Deep RL Rerouter](#9-gnn-multi-hop-risk-diffusion--deep-rl-rerouter)
  - [10. 9-Stage Hackathon Judge Demo Tour](#10-9-stage-hackathon-judge-demo-tour)
- [Mathematical & Algorithmic Formulations](#-mathematical--algorithmic-formulations)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Quickstart & Local Installation](#-quickstart--local-installation)
- [API Reference Guide](#-api-reference-guide)

---

## 🏛 Architectural Overview

CHAINSIGHT is constructed on a decoupled high-throughput architecture:

```
                      ┌────────────────────────────────────────────────────────┐
                      │             React 19 + TypeScript Frontend             │
                      │      (Tailwind CSS v4 + Lucide Icons + SVG Twin)       │
                      └───────────────────────────┬────────────────────────────┘
                                                  │ REST API / WebSocket
                      ┌───────────────────────────▼────────────────────────────┐
                      │              FastAPI Python Backend Server             │
                      │              (SQLite Database + SQLAlchemy)            │
                      └─────┬──────────────┬──────────────┬──────────────┬─────┘
                            │              │              │              │
         ┌──────────────────▼──┐    ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────────┐
         │ Scikit-Learn ML Core│    │ AI Swarm    │ │ Polygon L2 │ │ GNN & Deep RL  │
         │ - Random Forest     │    │ - Master    │ │ - Escrow   │ │ - 2-Layer GCN  │
         │ - Gradient Boosting │    │ - Spot-Bid  │ │ - Chainlink│ │ - PPO Policy   │
         │ - TF-IDF NLP Vectors│    │ - Cross-Dock│ │ - NFT Pass │ │ - Pareto Router│
         └─────────────────────┘    └─────────────┘ └────────────┘ └────────────────┘
```

---

## 🚀 Comprehensive Feature Capabilities

### 1. Executive Command Center & Telemetry Stream
- **Real-Time KPIs**: Sub-second tracking of active shipments, at-risk consignments, on-time delivery rate ($88.5\%$), and warehouse health.
- **Multi-Facility Utilization**: Live capacity monitoring across **Chennai Central DC**, **Bangalore Hub**, **Mumbai Logistics Center**, and **Hyderabad DC**.
- **IoT Event Feed**: Real-time beacon telemetry from RFID scanners, highway GPS trackers, and temperature logging sensors.

### 2. Multi-State Inventory Truth Engine
- **5 Granular Inventory States**: Eliminates phantom inventory by tracking goods across `Available`, `Reserved`, `Being Picked`, `In Transit`, and `Quality Hold`.
- **Mathematical Confidence Scoring Engine**: Dynamically calculates a $0-100\%$ inventory confidence rating based on ERP cycle audits and discrepancy reports.
- **Audit Mismatch Simulator**: Clickable one-click simulator demonstrating real-time variance detection between WMS book records and physical stock.

### 3. Predictive Delay Risk Engine (Scikit-Learn ML)
- **8-Stage Milestone Tracking**: Full lifecycle progression (`Created` &rarr; `Pickup Scheduled` &rarr; `Loaded` &rarr; `In Transit` &rarr; `Out for Delivery` &rarr; `Delivered` &rarr; `Exception` &rarr; `Held at Facility`).
- **Trained ML Ensemble**: `RandomForestRegressor` and `GradientBoostingClassifier` models forecasting ETA delay drift before vehicles get stuck.
- **Feature Attributions**: Dynamic breakdown attributing delays to Highway Traffic, Warehouse Loading Latency, and Transporter Reliability.

### 4. Root Cause & Exception Intelligence
- **3-Tier Cascade Graph**: Visual correlation mapping bottlenecks from **Warehouse Failure** &rarr; **Trapped Shipments** &rarr; **Affected Customer Accounts**.
- **Incident Clustering**: Combines noisy telemetry alarms into high-severity grouped incident clusters to prevent operator alert fatigue.
- **Financial Exposure Quantification**: Calculates contractual liquidated damages (e.g. ₹$12.50\text{ Lakhs}$) tied to active delay clusters.

### 5. What-If Autonomous Recovery Simulator
- **5 Action Strategy Models**: Evaluates backup fleets, alternate hub cross-docking, micro-batching, and 3PL carrier switching.
- **Action Value Score (AVS)**: Calculates optimal cost-to-benefit ratios ($0-100$) maximizing SLA recovery while minimizing OPEX.
- **Production Persistence**: Commits chosen recovery plans to the live database, instantly clearing delays and restoring metrics.

### 6. Multi-Echelon Digital Twin & AI Copilot
- **Interactive SVG Topology**: 4-echelon network topology visualizer displaying nodes (Warehouses, Transporters, Cargo, Customers) with isolated route focus mode.
- **Vector-Space AI Copilot**: NLP assistant powered by `TfidfVectorizer` and Cosine Similarity vector matching with streaming token responses.
- **Deep-Linking Action Cards**: Clicking action cards directly routes and filters the Digital Twin canvas to inspect referenced entities.

### 7. Autonomous Multi-Agent AI Swarm & Spot Auction
- **4 Cooperating AI Agents**:
  - **Master Orchestrator Agent**: Ingests telemetry and coordinates remediation sub-tasks.
  - **Carrier Spot-Auction Agent**: Bids on 3PL spot rate markets within supervisor budget guardrails.
  - **Inventory Rebalancing Agent**: Generates cross-dock transfer manifests to balance DC storage loads.
  - **Loading Dock Turnaround Agent**: Detects mechanical bay degradation and shifts incoming vehicles to auxiliary bays.
- **Supervisor Guardrails**: Interactive budget authorization slider (₹$50\text{K}$ to ₹$5.0\text{L}$) and autonomous kill-switch.

### 8. Blockchain Smart Contracts & IoT Oracle Escrow
- **Polygon L2 Smart Contracts (`SupplyChainEscrow.sol`)**: Locks freight fees in decentralized escrow upon consignment creation.
- **Chainlink Decentralized Oracle Network (DON)**: Cryptographically signs GPS arrival and cold-chain temperature telemetry.
- **Instant $1.4\text{s}$ Payouts**: Zero invoice dispute latency—funds release to carrier wallets immediately upon verified on-time delivery or deduct penalties for delays.
- **ERC-1155 NFT Consignment Passports**: Dual-key cryptographic handshakes (Driver Private Key &rarr; Warehouse Key).

### 9. GNN Multi-Hop Risk Diffusion & Deep RL Rerouter
- **2-Layer Graph Convolutional Network (GCN/GAT)**:
  - Models the 16-node multi-echelon network as a mathematical graph $G = (V, E)$.
  - Calculates multi-hop risk attention across 1-Hop Immediate, 2-Hop Intermediate, and 3-Hop Equilibrium diffusions.
- **Deep Reinforcement Learning (PPO) Router**:
  - Solves the dynamic Vehicle Routing Problem with Time Windows (VRPTW).
  - Optimizes Pareto detour trajectories (e.g. SH17 Bypass Corridor) saving $+3.7\text{ to }4.0\text{ hours}$ of delay with positive PPO reward deltas.

### 10. 9-Stage Hackathon Judge Demo Tour
- Comprehensive **60-second guided modal tour** accessible via the **`[⚡ Judge Demo Tour]`** button in the header, walking reviewers through all 9 modules with technical highlights and suggested interactive actions.

---

## 📐 Mathematical & Algorithmic Formulations

### 1. Multi-Hop Graph Convolutional Layer (GCN)
$$H^{(l+1)} = \sigma\left(\tilde{D}^{-\frac{1}{2}}\tilde{A}\tilde{D}^{-\frac{1}{2}}H^{(l)}W^{(l)}\right)$$
- $\tilde{A} = A + I_N$: Adjacency matrix with self-loops.
- $\tilde{D}_{ii} = \sum_j \tilde{A}_{ij}$: Degree matrix.
- $W^{(l)}$: Trainable weight matrix scaled by the Anomaly Severity Multiplier.

### 2. Action Value Score (AVS)
$$\text{AVS} = \min\left(100, \; \left(\frac{\text{Benefit Avoided (INR)}}{\text{Implementation Cost (INR)} \times 1.2} \times 40\right) + (\text{SLA Recovery Rate} \times 0.6)\right)$$

### 3. Deep Reinforcement Learning (PPO) Multi-Objective Reward
$$R(\tau) = -\lambda_1 \cdot \Delta T_{\text{delay}} - \lambda_2 \cdot C_{\text{fuel/toll}} + \lambda_3 \cdot \Phi_{\text{SLA\_Tier}} - \lambda_4 \cdot E_{\text{carbon}}$$

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- **Node.js 18+** & **npm**
- **Python 3.10+**

### 1. Clone Repository
```bash
git clone https://github.com/mohamedrayhan/SupplyChain.git
cd SupplyChain
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy pydantic numpy scikit-learn
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 API Reference Guide

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns live command center KPIs and event streams |
| `GET` | `/api/inventory` | Returns 5-state inventory reconciliation items |
| `POST` | `/api/predict-delay` | Scikit-Learn ML delay probability predictor |
| `GET` | `/api/simulator/evaluate` | Evaluates 5 what-if mitigation options |
| `POST` | `/api/copilot/query` | Vector-space NLP query processor |
| `POST` | `/api/agents/orchestrate` | Triggers autonomous multi-agent swarm cycle |
| `POST` | `/api/blockchain/escrow/oracle-settle` | Submits Chainlink proof and executes L2 payout |
| `POST` | `/api/ml/gnn/cascade-forecast` | Computes GNN multi-hop risk cascade embeddings |
| `POST` | `/api/ml/rl/optimal-reroute` | Solves Deep RL (PPO) dynamic detour trajectory |
| `POST` | `/api/reset-demo` | Resets all database tables to initial demo state |

---

## 👥 Authors & Acknowledgments

- **Lead Architecture & Engineering**: Mohamed Rayhan
- **Platform**: CHAINSIGHT Autonomous Supply Chain Intelligence Platform
- **License**: MIT Open Source License
