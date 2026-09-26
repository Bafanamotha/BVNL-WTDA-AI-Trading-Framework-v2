import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertTriangle, CheckCircle2, PieChart } from 'lucide-react';
import { RISK_METRICS, ASSET_ALLOCATION } from '../tradingData';

export const RiskManagerView: React.FC = () => {
  const [circuitBreakerTriggered, setCircuitBreakerTriggered] = useState<boolean>(false);
  const [leverageCap, setLeverageCap] = useState<number>(3.0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f1524] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Quantitative Risk Management</h2>
            <p className="text-xs text-slate-400">
              Parametric Value at Risk (VaR), stress tests, and automated liquidation guards
            </p>
          </div>
        </div>

        <button
          onClick={() => setCircuitBreakerTriggered(!circuitBreakerTriggered)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            circuitBreakerTriggered
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-slate-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{circuitBreakerTriggered ? 'CIRCUIT BREAKER ENGAGED' : 'Engage Circuit Breaker'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Risk Metrics */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <p className="text-sm font-semibold text-white">Parametric Risk Statistics</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Normal Volatility
            </span>
          </div>

          <div className="space-y-1">
            {[
              { label: 'Max Historical Drawdown', value: `${RISK_METRICS.maxDrawdown}%`, positive: false },
              { label: 'Annualized Sharpe Ratio', value: RISK_METRICS.sharpeRatio, positive: true },
              { label: 'Downside Sortino Ratio', value: RISK_METRICS.sortinoRatio, positive: true },
              { label: 'Calmar Ratio (Return/MDD)', value: RISK_METRICS.calmarRatio, positive: true },
              { label: 'Statistical Win Rate', value: `${RISK_METRICS.winRate}%`, positive: true },
              { label: 'Gross Profit Factor', value: RISK_METRICS.profitFactor, positive: true },
              { label: 'Average Position Hold Time', value: RISK_METRICS.avgHoldTime, neutral: true },
              { label: 'Total Recorded Executions', value: RISK_METRICS.totalTrades.toLocaleString(), neutral: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-xs text-slate-400">{item.label}</span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    item.neutral ? 'text-slate-300' : item.positive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Asset Class Allocation */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-white">Portfolio Asset Allocation</p>
            <p className="text-xs text-slate-500">Cross-asset risk parity distribution</p>
          </div>

          <div className="space-y-3 pt-2">
            {ASSET_ALLOCATION.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.name}</span>
                  <span className="font-mono text-slate-400 font-bold">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Global Gross Leverage Limit</span>
              <span className="font-mono font-bold text-indigo-400">{leverageCap}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={leverageCap}
              onChange={(e) => setLeverageCap(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
