import React, { useState } from 'react';
import {
  ExternalLink,
  RefreshCw,
  Maximize2,
  TrendingUp,
  Activity,
  Layers,
  Cpu,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

interface ArenaProjectViewProps {
  onBackToInvoice: () => void;
}

export const ArenaProjectView: React.FC<ArenaProjectViewProps> = ({ onBackToInvoice }) => {
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'overview'>('preview');

  const arenaUrl = 'https://019f7f71-ef81-7193-8d0a-46618a08f334.arena.site/';
  const localUrl = '/arena-project.html';

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Switcher Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              External Project Loaded
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live &amp; Interactive
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>BVNL/WTDA AI Trading Framework — v2</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Quantitative multi-model algorithmic trading platform featuring BVNL, WTDA, Ensemble models, 
            low-latency order router (Binance, Kraken, IBKR, Coinbase), live signals, backtester, and risk manager.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onBackToInvoice}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Transport Invoice (R 81,279)</span>
          </button>

          <a
            href={arenaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in arena.site</span>
          </a>

          <a
            href={localUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Window</span>
          </a>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reload Frame"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0f1524] border border-slate-800 rounded-xl p-3.5 text-white">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Portfolio Value</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white">$138,240.50</div>
          <div className="text-[11px] text-emerald-400 font-semibold">+38.4% all-time</div>
        </div>

        <div className="bg-[#0f1524] border border-slate-800 rounded-xl p-3.5 text-white">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Sharpe Ratio</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white">2.63</div>
          <div className="text-[11px] text-cyan-400 font-semibold">120-day rolling</div>
        </div>

        <div className="bg-[#0f1524] border border-slate-800 rounded-xl p-3.5 text-white">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Signals</span>
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-lg font-bold text-white">8 Active</div>
          <div className="text-[11px] text-violet-400 font-semibold">5 Long · 2 Short · 1 Hold</div>
        </div>

        <div className="bg-[#0f1524] border border-slate-800 rounded-xl p-3.5 text-white">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Execution Latency</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">1.2 ms</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Binance · Kraken · IBKR</div>
        </div>
      </div>

      {/* Tabs Selector: Live Interactive vs Architecture Breakdown */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Framework Frame
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Modules &amp; Architecture
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          URL: <code className="text-slate-400 font-mono">{arenaUrl}</code>
        </span>
      </div>

      {/* Main Container */}
      {activeTab === 'preview' ? (
        <div
          className={`relative bg-[#080c17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
            isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : 'h-[750px] w-full'
          }`}
        >
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-3 right-3 z-50 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold shadow hover:bg-slate-700 cursor-pointer"
            >
              Exit Fullscreen
            </button>
          )}

          <iframe
            key={iframeKey}
            src={localUrl}
            title="BVNL/WTDA AI Trading Framework"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          />
        </div>
      ) : (
        <div className="bg-[#0f1524] border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Project Modules Breakdown</h3>
            <p className="text-xs text-slate-400">
              The project retrieved from <code className="text-indigo-400 font-mono">{arenaUrl}</code> includes the following complete modules:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Activity className="w-4 h-4" />
                <span>1. AI Model Registry &amp; Radar Analysis</span>
              </div>
              <p className="text-xs text-slate-400">
                Comparison between <strong>BVNL</strong> (Bid-Volume Normalized Liquidity), <strong>WTDA</strong> (Wavelet Transform Distribution Analysis), and <strong>Ensemble Models</strong>. Includes radar charts measuring Accuracy, Latency, Sharpe, Max Drawdown, and Win Rate.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>2. Strategy Backtester &amp; Live Signals</span>
              </div>
              <p className="text-xs text-slate-400">
                Simulate historical execution across crypto (BTC/USD, ETH/USD, SOL/USD), FX (EUR/USD, GBP/USD), Commodities (Gold XAU/USD), and Equities (NVDA, SPX500, AAPL). Live confidence scoring and directional recommendations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>3. High-Speed Execution Engine</span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-venue smart order routing connected to Binance, Kraken, Interactive Brokers (IBKR), and Coinbase Advanced with fill rates above 99.7% and sub-2ms latency.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>4. Real-Time Risk Manager &amp; Trade Log</span>
              </div>
              <p className="text-xs text-slate-400">
                VaR (Value at Risk) thresholds, exposure caps per asset, circuit breakers, and audit trails of filled, cancelled, and pending orders.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-white">Want to switch this entire app to the Trading Framework?</p>
              <p className="text-xs text-slate-400">
                We can set this AI Trading Framework as your main default screen or keep it as an integrated tab alongside your transport invoices.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                View Live Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
