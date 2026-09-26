import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  BarChart2,
  Zap,
  Shield,
  ListOrdered,
  FlaskConical,
  Server,
  FileText,
} from 'lucide-react';

export type TradingTab =
  | 'Dashboard'
  | 'Live Signals'
  | 'AI Models'
  | 'Backtester'
  | 'Execution Engine'
  | 'Risk Manager'
  | 'Trade Log'
  | 'Lab / R&D'
  | 'Infrastructure';

interface TradingSidebarProps {
  activeTab: TradingTab;
  onTabChange: (tab: TradingTab) => void;
  onSwitchToInvoice?: () => void;
}

const NAV_ITEMS: { icon: React.FC<{ className?: string }>; label: TradingTab }[] = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: TrendingUp, label: 'Live Signals' },
  { icon: Brain, label: 'AI Models' },
  { icon: BarChart2, label: 'Backtester' },
  { icon: Zap, label: 'Execution Engine' },
  { icon: Shield, label: 'Risk Manager' },
  { icon: ListOrdered, label: 'Trade Log' },
  { icon: FlaskConical, label: 'Lab / R&D' },
  { icon: Server, label: 'Infrastructure' },
];

export const TradingSidebar: React.FC<TradingSidebarProps> = ({
  activeTab,
  onTabChange,
  onSwitchToInvoice,
}) => {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#0a0e1a] select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/50">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-widest text-white">BVNL/WTDA</p>
          <p className="text-[10px] font-medium tracking-widest text-indigo-400 uppercase">
            AI Trading · v2
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Core Modules
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.slice(0, 5).map(({ icon: Icon, label }) => {
              const active = activeTab === label;
              return (
                <li key={label}>
                  <button
                    onClick={() => onTabChange(label)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 transition ${
                        active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Analytics &amp; Control
          </p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.slice(5).map(({ icon: Icon, label }) => {
              const active = activeTab === label;
              return (
                <li key={label}>
                  <button
                    onClick={() => onTabChange(label)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 transition ${
                        active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Switch to Invoice Hub */}
      {onSwitchToInvoice && (
        <div className="p-3 border-t border-slate-800 bg-[#080c17]/60">
          <button
            onClick={onSwitchToInvoice}
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer border border-slate-700/60"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Transport Invoice</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              R 81,279
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};
