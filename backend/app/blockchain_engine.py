from datetime import datetime
import hashlib
import uuid
from typing import List, Dict, Any

class SmartContractEscrow:
    def __init__(
        self,
        contract_address: str,
        shipment_id: str,
        customer_name: str,
        customer_wallet: str,
        carrier_name: str,
        carrier_wallet: str,
        escrow_amount_inr: float,
        sla_max_delay_hours: float = 2.0,
        penalty_rate_per_hour: float = 15000.0,
        status: str = "LOCKED_IN_ESCROW"
    ):
        self.contract_address = contract_address
        self.shipment_id = shipment_id
        self.customer_name = customer_name
        self.customer_wallet = customer_wallet
        self.carrier_name = carrier_name
        self.carrier_wallet = carrier_wallet
        self.escrow_amount_inr = escrow_amount_inr
        self.sla_max_delay_hours = sla_max_delay_hours
        self.penalty_rate_per_hour = penalty_rate_per_hour
        self.status = status  # LOCKED_IN_ESCROW, SETTLED_100_PERCENT, PENALTY_DEDUCTED_REFUNDED
        self.nft_token_id = f"NFT-SHP-{shipment_id.replace('SHP-', '')}"
        self.driver_signature = f"0x{hashlib.sha256((shipment_id + carrier_wallet).encode()).hexdigest()[:40]}"
        self.warehouse_signature = None
        self.settlement_tx_hash = None
        self.settled_amount_carrier = 0.0
        self.refunded_amount_customer = 0.0
        self.settlement_timestamp = None
        self.block_number = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "contract_address": self.contract_address,
            "shipment_id": self.shipment_id,
            "customer_name": self.customer_name,
            "customer_wallet": self.customer_wallet,
            "carrier_name": self.carrier_name,
            "carrier_wallet": self.carrier_wallet,
            "escrow_amount_inr": self.escrow_amount_inr,
            "sla_max_delay_hours": self.sla_max_delay_hours,
            "penalty_rate_per_hour": self.penalty_rate_per_hour,
            "status": self.status,
            "nft_token_id": self.nft_token_id,
            "driver_signature": self.driver_signature,
            "warehouse_signature": self.warehouse_signature,
            "settlement_tx_hash": self.settlement_tx_hash,
            "settled_amount_carrier": self.settled_amount_carrier,
            "refunded_amount_customer": self.refunded_amount_customer,
            "settlement_timestamp": self.settlement_timestamp,
            "block_number": self.block_number
        }

class BlockchainSettlementEngine:
    def __init__(self):
        self.network_name = "Polygon PoS (Layer-2 Enterprise Mainnet)"
        self.chain_id = 137
        self.current_gas_gwei = 14.2
        self.oracle_network = "Chainlink Decentralized Oracle Network (DON v2.4)"
        self.escrows: Dict[str, SmartContractEscrow] = {}
        self._init_seed_escrows()

    def _generate_eth_address(self, seed_str: str) -> str:
        h = hashlib.sha256(seed_str.encode()).hexdigest()
        return f"0x{h[:40]}"

    def _init_seed_escrows(self):
        seed_data = [
            ("SHP-2026-001", "ABC Manufacturing Ltd.", "Express Logistics India", 95000.0, "LOCKED_IN_ESCROW"),
            ("SHP-2026-002", "Titan Components Ltd.", "Titan Freight Carriers", 120000.0, "LOCKED_IN_ESCROW"),
            ("SHP-2026-003", "Apex Industrial Automation", "Deccan Roadways Corp", 85000.0, "LOCKED_IN_ESCROW"),
            ("SHP-2026-004", "GreenEnergy Motors", "Express Logistics India", 110000.0, "LOCKED_IN_ESCROW")
        ]

        for idx, (shp_id, cust, carr, amount, status) in enumerate(seed_data):
            contract_addr = self._generate_eth_address(f"CONTRACT-{shp_id}")
            cust_wallet = self._generate_eth_address(f"WALLET-CUST-{cust}")
            carr_wallet = self._generate_eth_address(f"WALLET-CARR-{carr}")
            
            escrow = SmartContractEscrow(
                contract_address=contract_addr,
                shipment_id=shp_id,
                customer_name=cust,
                customer_wallet=cust_wallet,
                carrier_name=carr,
                carrier_wallet=carr_wallet,
                escrow_amount_inr=amount,
                sla_max_delay_hours=2.0,
                penalty_rate_per_hour=15000.0,
                status=status
            )
            self.escrows[shp_id] = escrow

    def get_all_escrows(self) -> List[Dict[str, Any]]:
        return [escrow.to_dict() for escrow in self.escrows.values()]

    def settle_via_chainlink_oracle(
        self,
        shipment_id: str,
        is_on_time: bool = True,
        actual_delay_hours: float = 0.0,
        temperature_compliant: bool = True
    ) -> Dict[str, Any]:
        escrow = self.escrows.get(shipment_id)
        if not escrow:
            contract_addr = self._generate_eth_address(f"CONTRACT-{shipment_id}")
            cust_wallet = self._generate_eth_address("WALLET-CUST-DEFAULT")
            carr_wallet = self._generate_eth_address("WALLET-CARR-DEFAULT")
            escrow = SmartContractEscrow(
                contract_address=contract_addr,
                shipment_id=shipment_id,
                customer_name="Strategic Enterprise Account",
                customer_wallet=cust_wallet,
                carrier_name="Tier-1 Logistics Carrier",
                carrier_wallet=carr_wallet,
                escrow_amount_inr=85000.0,
                status="LOCKED_IN_ESCROW"
            )
            self.escrows[shipment_id] = escrow

        now = datetime.utcnow()
        oracle_sig = hashlib.sha256(f"CHAINLINK-PROOF-{shipment_id}-{now.isoformat()}".encode()).hexdigest()
        tx_hash = f"0x{hashlib.sha256(uuid.uuid4().bytes).hexdigest()}"
        block_num = 58291042 + len(self.escrows) * 12

        warehouse_key = self._generate_eth_address(f"WH-SIGNATURE-RECEIVER-{shipment_id}")
        escrow.warehouse_signature = warehouse_key

        if is_on_time and actual_delay_hours <= escrow.sla_max_delay_hours and temperature_compliant:
            escrow.status = "SETTLED_100_PERCENT"
            escrow.settled_amount_carrier = escrow.escrow_amount_inr
            escrow.refunded_amount_customer = 0.0
            payout_message = f"Smart contract released 100% freight fee (₹{escrow.settled_amount_carrier:,.2f}) to carrier wallet `{escrow.carrier_wallet[:10]}...` in 1.4s."
        else:
            penalty = min(escrow.escrow_amount_inr, actual_delay_hours * escrow.penalty_rate_per_hour)
            escrow.status = "PENALTY_DEDUCTED_REFUNDED"
            escrow.settled_amount_carrier = max(0.0, escrow.escrow_amount_inr - penalty)
            escrow.refunded_amount_customer = penalty
            payout_message = f"Delay breach of +{actual_delay_hours} hrs. Smart contract deducted ₹{penalty:,.2f} penalty refund to customer. Net carrier payout: ₹{escrow.settled_amount_carrier:,.2f}."

        escrow.settlement_tx_hash = tx_hash
        escrow.settlement_timestamp = now.isoformat()
        escrow.block_number = block_num

        return {
            "success": True,
            "message": payout_message,
            "shipment_id": shipment_id,
            "status": escrow.status,
            "contract_address": escrow.contract_address,
            "tx_hash": tx_hash,
            "block_number": block_num,
            "gas_used_gwei": 12.8,
            "execution_speed_sec": 1.4,
            "oracle_cryptographic_proof": f"0x{oracle_sig}",
            "escrow_data": escrow.to_dict()
        }

    def get_blockchain_stats(self) -> Dict[str, Any]:
        total_tvl = sum(e.escrow_amount_inr for e in self.escrows.values())
        settled_count = len([e for e in self.escrows.values() if e.status != "LOCKED_IN_ESCROW"])
        active_count = len([e for e in self.escrows.values() if e.status == "LOCKED_IN_ESCROW"])

        return {
            "network": self.network_name,
            "chain_id": self.chain_id,
            "oracle_network": self.oracle_network,
            "total_value_locked_inr": total_tvl,
            "active_escrows_count": active_count,
            "settled_escrows_count": settled_count,
            "average_settlement_latency_sec": 1.4,
            "invoice_dispute_rate": "0.0% (Zero-Dispute Cryptographic Consensus)",
            "gas_price_gwei": self.current_gas_gwei
        }

blockchain_engine = BlockchainSettlementEngine()
