import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Link2, 
  Coins, 
  FileCheck2, 
  CheckCircle, 
  Cpu
} from 'lucide-react';
import { fetchBlockchainEscrows, fetchBlockchainStats, settleViaChainlinkOracle } from '../api/client';
import type { SmartContractEscrow, BlockchainStats, OracleSettleResponse } from '../types';

export const BlockchainSettlement: React.FC = () => {
  const [escrows, setEscrows] = useState<SmartContractEscrow[]>([]);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [settling, setSettling] = useState<boolean>(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('SHP-2026-001');
  const [isOnTime, setIsOnTime] = useState<boolean>(true);
  const [delayHours, setDelayHours] = useState<number>(0.0);
  const [tempCompliant, setTempCompliant] = useState<boolean>(true);
  const [latestReceipt, setLatestReceipt] = useState<OracleSettleResponse | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [escrowList, statsData] = await Promise.all([
        fetchBlockchainEscrows(),
        fetchBlockchainStats()
      ]);
      setEscrows(escrowList);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load blockchain escrow data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettle = async () => {
    try {
      setSettling(true);
      const response = await settleViaChainlinkOracle(
        selectedShipmentId,
        isOnTime,
        delayHours,
        tempCompliant
      );
      setLatestReceipt(response);
      await loadData();
    } catch (err) {
      console.error('Failed to settle escrow via oracle:', err);
      alert('Failed to settle escrow via oracle');
    } finally {
      setSettling(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Blockchain Smart Contracts & IoT Escrow</h2>
            <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono font-bold">
              Phase 11 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Decentralized zero-dispute freight escrow settlement powered by Polygon Layer-2 smart contracts and Chainlink IoT telemetry oracles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono">
            <Link2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Polygon L2 • Chain ID 137</span>
          </div>
        </div>
      </div>

      {/* Web3 Network Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="tech-card border-t-2 border-t-purple-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Value Locked (TVL)</span>
              <div className="text-3xl font-black text-purple-400 mt-1">
                ₹{stats ? (stats.total_value_locked_inr / 100000).toFixed(2) : '4.10'} L
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Locked in `SupplyChainEscrow.sol`</div>
        </div>

        <div className="tech-card border-t-2 border-t-emerald-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Settlement Speed</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">1.4s</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Instant Carrier Wallet Release</div>
        </div>

        <div className="tech-card border-t-2 border-t-cyan-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Oracle Consensus</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">Chainlink DON</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Cryptographic GPS & Temp Proof</div>
        </div>

        <div className="tech-card border-t-2 border-t-blue-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Invoice Dispute Rate</span>
              <div className="text-3xl font-black text-blue-400 mt-1">0.0%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Zero Disputation Latency</div>
        </div>
      </div>

      {/* Interactive Chainlink Oracle Settlement Playground */}
      <div className="tech-card border-t-2 border-t-purple-500 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>Chainlink Decentralized Oracle Settlement Terminal</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate real-world GPS and cold-chain sensor proofs triggering autonomous smart contract payouts.
            </p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
            Smart Contract: `SupplyChainEscrow.sol`
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* 1. Select Shipment */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-slate-400 block uppercase font-bold">Select Active Escrow</label>
            <select
              value={selectedShipmentId}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono cursor-pointer focus:outline-none focus:border-purple-500"
            >
              {escrows.map((e) => (
                <option key={e.shipment_id} value={e.shipment_id}>
                  {e.shipment_id} — {e.customer_name} (₹{(e.escrow_amount_inr / 1000).toFixed(0)}K)
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500">
              NFT Passport: `NFT-SHP-{selectedShipmentId.replace('SHP-', '')}`
            </div>
          </div>

          {/* 2. Oracle Sensor Proof Conditions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-slate-400 block uppercase font-bold">Oracle Delivery Parameters</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setIsOnTime(true); setDelayHours(0.0); }}
                className={`flex-1 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                  isOnTime 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                On-Time (0h)
              </button>
              <button
                onClick={() => { setIsOnTime(false); setDelayHours(3.5); }}
                className={`flex-1 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                  !isOnTime 
                    ? 'bg-rose-950 text-rose-300 border-rose-700' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Delayed (+3.5h)
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Cold-Chain Compliant:</span>
              <button
                onClick={() => setTempCompliant(!tempCompliant)}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                  tempCompliant ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {tempCompliant ? 'VERIFIED (2-8°C)' : 'EXCURSION DETECTED'}
              </button>
            </div>
          </div>

          {/* 3. Execute On-Chain */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <label className="text-slate-400 block uppercase font-bold">Trigger Proof</label>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Chainlink Oracle will sign payload and invoke `submitDeliveryProof()` on-chain.
              </p>
            </div>
            <button
              onClick={handleSettle}
              disabled={settling}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold transition cursor-pointer shadow-lg shadow-purple-950/80 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${settling ? 'animate-spin' : ''}`} />
              <span>{settling ? 'Mining Tx on Polygon L2...' : 'Submit Proof & Settle'}</span>
            </button>
          </div>
        </div>

        {/* Live On-Chain Settlement Receipt */}
        {latestReceipt && (
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-600/50 space-y-3 font-mono animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/40 pb-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>On-Chain Settlement Confirmed (Block #{latestReceipt.block_number})</span>
              </div>
              <span className="text-purple-300 text-[11px]">
                Execution Latency: <strong className="text-white">{latestReceipt.execution_speed_sec}s</strong> • Gas: <strong className="text-white">{latestReceipt.gas_used_gwei} Gwei</strong>
              </span>
            </div>

            <p className="text-xs text-slate-200 font-sans">
              {latestReceipt.message}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase block">Polygon Transaction Hash</span>
                <span className="text-cyan-300 truncate block">{latestReceipt.tx_hash}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase block">Chainlink Oracle Cryptographic Proof</span>
                <span className="text-purple-300 truncate block">{latestReceipt.oracle_cryptographic_proof}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Contract Escrows Registry */}
      <div className="tech-card rounded-2xl overflow-hidden font-mono text-xs">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white font-sans">Smart Contract Escrow Master Registry</h3>
          </div>
          <span className="text-slate-400">{escrows.length} Active On-Chain Contracts</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {escrows.map((escrow) => {
            const isSettled = escrow.status !== 'LOCKED_IN_ESCROW';

            return (
              <div key={escrow.shipment_id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-900/40 transition">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{escrow.shipment_id}</span>
                    <span className="text-slate-300 font-sans">{escrow.customer_name}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      escrow.status === 'SETTLED_100_PERCENT'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : escrow.status === 'PENALTY_DEDUCTED_REFUNDED'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}>
                      {escrow.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Wallets & Signatures */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Contract:</span>
                      <span className="text-slate-300 truncate">{escrow.contract_address.slice(0, 16)}...</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Carrier Wallet:</span>
                      <span className="text-cyan-400 truncate">{escrow.carrier_wallet.slice(0, 16)}...</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Driver Sig:</span>
                      <span className="text-emerald-400 truncate">{escrow.driver_signature.slice(0, 16)}...</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Receiver Sig:</span>
                      <span className="text-purple-400 truncate">
                        {escrow.warehouse_signature ? `${escrow.warehouse_signature.slice(0, 16)}...` : 'Pending Handshake'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-purple-400">₹{(escrow.escrow_amount_inr / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    {isSettled ? `Settled Tx #${escrow.block_number}` : 'Locked in Escrow'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
