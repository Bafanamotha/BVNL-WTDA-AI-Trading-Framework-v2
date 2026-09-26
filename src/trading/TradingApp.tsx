import React, { useState } from 'react';
import { TradingSidebar, TradingTab } from './components/TradingSidebar';
import { TradingHeader } from './components/TradingHeader';
import { TradingMarquee } from './components/TradingMarquee';
import { DashboardView } from './components/DashboardView';
import { LiveSignalsView } from './components/LiveSignalsView';
import { AIModelsView } from './components/AIModelsView';
import { BacktesterView } from './components/BacktesterView';
import { ExecutionEngineView } from './components/ExecutionEngineView';
import { RiskManagerView } from './components/RiskManagerView';
import { TradeLogView } from './components/TradeLogView';
import { LabRDView } from './components/LabRDView';
import { InfrastructureView } from './components/InfrastructureView';

const TITLE_MAP: Record<TradingTab, string> = {
  Dashboard: 'Dashboard — Overview',
  'Live Signals': 'Live AI Signals',
  'AI Models': 'AI Model Registry',
  Backtester: 'Strategy Backtester',
  'Execution Engine': 'Execution Engine',
  'Risk Manager': 'Risk Manager',
  'Trade Log': 'Trade Log',
  'Lab / R&D': 'Lab / Research & Development',
  Infrastructure: 'Infrastructure & Compute',
};

interface TradingAppProps {
  onSwitchToInvoice?: () => void;
}

export const TradingApp: React.FC<TradingAppProps> = ({ onSwitchToInvoice }) => {
  const [activeTab, setActiveTab] = useState<TradingTab>('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Live Signals':
        return <LiveSignalsView />;
      case 'AI Models':
        return <AIModelsView />;
      case 'Backtester':
        return <BacktesterView />;
      case 'Execution Engine':
        return <ExecutionEngineView />;
      case 'Risk Manager':
        return <RiskManagerView />;
      case 'Trade Log':
        return <TradeLogView />;
      case 'Lab / R&D':
        return <LabRDView />;
      case 'Infrastructure':
        return <InfrastructureView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c17] text-slate-200 text-sm select-none antialiased">
      {/* Sidebar */}
      <TradingSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSwitchToInvoice={onSwitchToInvoice}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <TradingHeader title={TITLE_MAP[activeTab] || activeTab} />

        {/* Live Ticker Marquee */}
        <TradingMarquee />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080c17]">
          <div className="mx-auto max-w-screen-2xl">
            {renderContent()}
          </div>
        </main>

        {/* Bottom Status Bar */}
        <div className="flex-shrink-0 border-t border-slate-800 bg-[#0a0e1a] px-6 py-2 text-[10px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>BVNL/WTDA AI Trading Framework — v2.0.0 © 2026</span>
            <div className="hidden sm:flex items-center gap-3">
              <span>
                Data feeds: <strong className="text-slate-400 font-normal">Binance · Kraken · IBKR · Coinbase</strong>
              </span>
              <span>|</span>
              <span>
                Model engine: <strong className="text-slate-400 font-normal">PyTorch 2.3 · XGBoost 2.1</strong>
              </span>
              <span>|</span>
              <span>
                Latency: <span className="text-emerald-400 font-bold font-mono">1.2 ms</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
