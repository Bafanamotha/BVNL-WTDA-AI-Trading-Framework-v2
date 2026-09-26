import React, { useState } from 'react';
import { Play, RotateCcw, TrendingUp, BarChart2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BACKTEST_STRATEGIES, GENERATE_EQUITY_CURVE } from '../tradingData';

export const BacktesterView: React.FC = () => {
  const [strategy, setStrategy] = useState<string>(BACKTEST_STRATEGIES[0]);
  const [capital, setCapital] = useState<string>('100000');
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');
  const [commission, setCommission] = useState<string>('5');
  const [slippage, setSlippage] = useState<string>('Fixed 1 bps');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasResults, setHasResults] = useState<boolean>(true);
  const [equityData] = useState(GENERATE_EQUITY_CURVE());

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Backtest Configuration */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 lg:col-span-1 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Backtest Configuration</h3>
            <p className="text-xs text-slate-400">Walk-forward simulation with tick-level slippage model</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Target Strategy</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
              >
                {BACKTEST_STRATEGIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Initial Capital (USD)</label>
              <input
                type="text"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Commission (bps)</label>
              <input
                type="text"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Slippage Model</label>
              <select
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Fixed 1 bps">Fixed 1 bps</option>
                <option value="Market Impact">Market Impact (Kyle's Lambda)</option>
                <option value="None">Zero Friction</option>
              </select>
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              {isRunning ? 'Simulating Historical Ticks…' : '▶ Run Backtest'}
            </button>
          </div>
        </div>

        {/* Right Column: Simulation Output */}
        {hasResults && (
          <div className="space-y-4 lg:col-span-2">
            {/* 4 Results KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Total Return</p>
                <p className="mt-1 text-xl font-bold text-emerald-400 font-mono">+38.4%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">CAGR: 29.8%</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Sharpe Ratio</p>
                <p className="mt-1 text-xl font-bold text-cyan-400 font-mono">2.63</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sortino: 3.18</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Max Drawdown</p>
                <p className="mt-1 text-xl font-bold text-red-400 font-mono">-12.4%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Recovery: 18 days</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Win Rate</p>
                <p className="mt-1 text-xl font-bold text-emerald-400 font-mono">71.2%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">1,291 / 1,813 trades</p>
              </div>
            </div>

            {/* Backtest Equity Curve */}
            <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">Backtest Equity Curve vs S&amp;P 500</p>
                <span className="text-xs text-indigo-400 font-mono font-bold">Strategy: {strategy}</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gBT" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gSPX" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                    <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fill: '#475569', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ background: '#0f1524', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 12 }}
                      formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={2} fill="url(#gBT)" name={strategy} />
                    <Area type="monotone" dataKey="benchmark" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 3" fill="url(#gSPX)" name="S&P 500" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
