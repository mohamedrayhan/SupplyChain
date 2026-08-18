import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Shipments } from './pages/Shipments';
import { RiskCenter } from './pages/RiskCenter';
import { RecoverySimulator } from './pages/RecoverySimulator';
import { DigitalTwin } from './pages/DigitalTwin';
import { AICopilot } from './pages/AICopilot';
import { AgentSwarm } from './pages/AgentSwarm';
import { BlockchainSettlement } from './pages/BlockchainSettlement';
import { GNNTopologyReroute } from './pages/GNNTopologyReroute';
import type { ChatMessage } from './pages/AICopilot';
import { DemoTourModal } from './components/DemoTourModal';
import { resetDemoData } from './api/client';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [selectedTwinNodeId, setSelectedTwinNodeId] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  // Persistent Copilot Chat History across entire session
  const [copilotMessages, setCopilotMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'copilot',
      text: "### 👋 Welcome to CHAINSIGHT AI Copilot\n\nI am your real-time **Supply Chain Operational Intelligence Assistant**. I have live, direct read access to your telemetry nodes, WMS inventory databases, and predictive recovery simulation models.\n\nAsk me any question about active shipment risks, warehouse bottlenecks, digital-physical inventory truth, or what-if mitigation scenarios.",
      timestamp: 'Just now',
      actionCards: [
        {
          title: 'Review At-Risk Shipments',
          action_type: 'navigate_tab',
          target: 'shipments',
          description: 'Inspect live vehicle telemetry and route milestones.'
        },
        {
          title: 'Open Recovery Simulator',
          action_type: 'navigate_tab',
          target: 'simulator',
          description: 'Evaluate AI-scored mitigation strategies before executing.'
        }
      ]
    }
  ]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all demo database records to initial seed state?')) {
      try {
        setIsLoading(true);
        await resetDemoData();
        handleRefresh();
      } catch (err) {
        console.error('Failed to reset demo data:', err);
        alert('Failed to reset demo data');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNavigateTab = (target: string) => {
    if (target.startsWith('twin:')) {
      const nodeId = target.replace('twin:', '');
      setSelectedTwinNodeId(nodeId);
      setActiveTab('twin');
    } else {
      setSelectedTwinNodeId(null);
      setActiveTab(target);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans bg-grid-pattern">
      <Header 
        onRefresh={handleRefresh} 
        onReset={handleReset} 
        onOpenTour={() => setIsTourOpen(true)}
        isLoading={isLoading} 
        lastUpdated={lastUpdated} 
      />

      <DemoTourModal 
        isOpen={isTourOpen} 
        onClose={() => setIsTourOpen(false)} 
        onNavigateTab={handleNavigateTab} 
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={handleNavigateTab} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              setLastUpdated={setLastUpdated} 
              setIsLoadingParent={setIsLoading} 
              refreshTrigger={refreshTrigger} 
            />
          )}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'shipments' && <Shipments />}
          {activeTab === 'risk' && <RiskCenter />}
          {activeTab === 'simulator' && <RecoverySimulator />}
          {activeTab === 'twin' && <DigitalTwin initialSelectedNodeId={selectedTwinNodeId} />}
          {activeTab === 'copilot' && (
            <AICopilot 
              onNavigateTab={handleNavigateTab} 
              messages={copilotMessages} 
              setMessages={setCopilotMessages} 
            />
          )}
          {activeTab === 'swarm' && <AgentSwarm />}
          {activeTab === 'blockchain' && <BlockchainSettlement />}
          {activeTab === 'gnn' && <GNNTopologyReroute />}
        </main>
      </div>
    </div>
  );
}

export default App;
