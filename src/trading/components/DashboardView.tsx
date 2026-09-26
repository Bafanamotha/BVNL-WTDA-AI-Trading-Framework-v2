import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  BarChart2,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import {
  INITIAL_SIGNALS,
  MODULE_WIN_RATES,
  RISK_METRICS,
  INITIAL_TRADES,
  RADAR_DATA,
  ASSET_ALLOCATION,
  GENERATE_EQUITY_CURVE,
  GENERATE_CANDLESTICKS,
} from '../tradingData';

export const DashboardView: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState<number>(138240.5);
  const [todayPnl, setTodayPnl] = useState<number>(3184.2);
  const [equityTimeframe, setEquityTimeframe] = useState<'1W' | '1M' | '3M' | 'ALL'>('ALL');
  const [equityData] = useState(GENERATE_EQUITY_CURVE());
  const [candleData] = useState(() => {
    return GENERATE_CANDLESTICKS().slice(-40).map((t) => ({
      ...t,
      upBody: t.close >= t.open ? t.close - t.open : 0,
      downBody: t.close < t.open ? t.open - t.close : 0,
      baseUp: t.close >= t.open ? t.open : t.close,
      baseDown: t.close < t.open ? t.close : t.open,
      mid: (t.high + t.low) / 2,
    }));
  });

  // Simulated live micro fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setPortfolioValue((prev) => +(prev + (Math.random() - 0.45) * 20).toFixed(2));
      setTodayPnl((prev) => +(prev + (Math.random() - 0.45) * 5).toFixed(2));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Filter equity data based on timeframe
  const filteredEquity = React.useMemo(() => {
    if (equityTimeframe === '1W') return equityData.slice(-7);
    if (equityTimeframe === '1M') return equityData.slice(-30);
    if (equityTimeframe === '3M') return equityData.slice(-90);
    return equityData;
  }, [equityTimeframe, equityData]);

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Card 1: Portfolio Value */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f1524] p-5 transition hover:border-slate-700">
          <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-indigo-600/10 blur-2xl transition group-hover:bg-indigo-600/20" />
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Portfolio Value</p>
            <div className="rounded-lg bg-slate-800/80 p-2 text-indigo-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-mono">
            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400">+38.4% all-time</span>
            <span className="text-slate-600">vs $100k start</span>
          </div>
        </div>

        {/* Card 2: Today's P&L */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f1524] p-5 transition hover:border-slate-700">
          <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-600/10 blur-2xl transition group-hover:bg-emerald-600/20" />
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Today's P&amp;L</p>
            <div className="rounded-lg bg-slate-800/80 p-2 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-mono">
            {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className={`font-semibold ${todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {((todayPnl / portfolioValue) * 100).toFixed(2)}%
            </span>
            <span className="text-slate-600">since market open</span>
          </div>
        </div>

        {/* Card 3: Active Signals */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f1524] p-5 transition hover:border-slate-700">
          <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-violet-600/10 blur-2xl transition group-hover:bg-violet-600/20" />
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Active Signals</p>
            <div className="rounded-lg bg-slate-800/80 p-2 text-violet-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-mono">8</p>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-violet-400">5 LONG · 2 SHORT · 1 HOLD</span>
            <span className="text-slate-600">4 asset classes</span>
          </div>
        </div>

        {/* Card 4: Sharpe Ratio */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f1524] p-5 transition hover:border-slate-700">
          <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-cyan-600/10 blur-2xl transition group-hover:bg-cyan-600/20" />
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Sharpe Ratio</p>
            <div className="rounded-lg bg-slate-800/80 p-2 text-cyan-400">
              <BarChart2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-mono">2.63</p>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400">+0.18 vs last month</span>
            <span className="text-slate-600">120-day rolling</span>
          </div>
        </div>
      </div>

      {/* Row 2: Equity Curve & Intraday Price Chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Portfolio Equity Curve (2 cols) */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Portfolio Equity Curve</p>
              <p className="text-xs text-slate-500">Performance vs benchmark (S&amp;P 500)</p>
            </div>
            <div className="flex gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              {(['1W', '1M', '3M', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setEquityTimeframe(tf)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    equityTimeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredEquity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gEq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gBm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
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
                <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={2} fill="url(#gEq)" name="BVNL/WTDA" />
                <Area type="monotone" dataKey="benchmark" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#gBm)" name="Benchmark" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BTC/USD Intraday Candlestick Chart (1 col) */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">BTC/USD — Intraday</p>
              <p className="text-xs text-slate-500">15-min bars · AI signal overlay</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-emerald-500" />
                Bull
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-red-500" />
                Bear
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candleData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} interval={7} />
                <YAxis
                  yAxisId="price"
                  domain={['auto', 'auto']}
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  tickFormatter={(t) => `$${(t / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  contentStyle={{ background: '#0f1524', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <ReferenceLine
                  yAxisId="price"
                  y={candleData[candleData.length - 1]?.close}
                  stroke="#6366f1"
                  strokeDasharray="4 2"
                  strokeWidth={1}
                />
                <Bar
                  yAxisId="price"
                  dataKey="close"
                  fill="#34d399"
                  maxBarSize={8}
                  shape={(props: any) => {
                    const { x = 0, y = 0, width = 0, payload } = props;
                    if (!payload) return null;
                    const isUp = payload.close >= payload.open;
                    const fill = isUp ? '#34d399' : '#f87171';
                    return <rect x={x + width * 0.15} y={y} width={width * 0.7} height={props.height || 4} fill={fill} opacity={0.85} rx={1} />;
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Live AI Signals Board */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1524]">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-semibold text-white">Live AI Signals</p>
            <span className="ml-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
              {INITIAL_SIGNALS.length} active
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Updated 10s ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/50 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                <th className="px-5 py-3">Symbol</th>
                <th className="px-3 py-3">Signal</th>
                <th className="px-3 py-3">Confidence</th>
                <th className="px-3 py-3 text-right">Entry</th>
                <th className="px-3 py-3 text-right">Target</th>
                <th className="px-3 py-3 text-right">Stop</th>
                <th className="px-3 py-3 text-right">P&amp;L %</th>
                <th className="px-3 py-3 text-right">Age</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_SIGNALS.map((s) => {
                const isLong = s.status === 'LONG';
                const isShort = s.status === 'SHORT';
                return (
                  <tr key={s.id} className="group border-b border-slate-800/30 transition hover:bg-slate-800/30">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-semibold text-white">{s.symbol}</p>
                        <p className="text-[10px] text-slate-600">{s.asset}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          isLong
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isShort
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.confidence}%` }} />
                        </div>
                        <span className="font-mono text-xs text-slate-300 font-semibold">{s.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">${s.entry.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-400">${s.target.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right font-mono text-red-400">${s.stop.toLocaleString()}</td>
                    <td className={`px-3 py-3 text-right font-mono font-bold ${s.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-slate-500">{s.age}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: AI Model Win Rates & Model Comparison Radar */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-600">AI Model Analytics</p>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Win Rates Bar Chart */}
          <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
            <p className="mb-1 text-sm font-semibold text-white">Module Win Rates</p>
            <p className="mb-4 text-xs text-slate-500">Strategy-level performance across modules</p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MODULE_WIN_RATES} layout="vertical" margin={{ left: 24, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f1524', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 12 }}
                    formatter={(val: any) => [`${val}%`, 'Win Rate']}
                  />
                  <Bar dataKey="winRate" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Comparison Radar */}
          <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
            <p className="mb-1 text-sm font-semibold text-white">Model Comparison Radar</p>
            <p className="mb-4 text-xs text-slate-500">Multi-dimensional capability benchmark</p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#1e2a3a" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="BVNL" dataKey="BVNL" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="WTDA" dataKey="WTDA" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Ensemble" dataKey="Ensemble" stroke="#34d399" fill="#34d399" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Risk Metrics & Recent Trades */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Risk Metrics */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              <p className="text-sm font-semibold text-white">Risk Metrics</p>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Low Risk Regime
            </span>
          </div>

          <div className="space-y-1">
            {[
              { label: 'Max Drawdown', value: `${RISK_METRICS.maxDrawdown}%`, positive: false },
              { label: 'Sharpe Ratio', value: RISK_METRICS.sharpeRatio, positive: true },
              { label: 'Sortino Ratio', value: RISK_METRICS.sortinoRatio, positive: true },
              { label: 'Calmar Ratio', value: RISK_METRICS.calmarRatio, positive: true },
              { label: 'Win Rate', value: `${RISK_METRICS.winRate}%`, positive: true },
              { label: 'Profit Factor', value: RISK_METRICS.profitFactor, positive: true },
              { label: 'Avg Hold Time', value: RISK_METRICS.avgHoldTime, neutral: true },
              { label: 'Total Trades', value: RISK_METRICS.totalTrades.toLocaleString(), neutral: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-xs text-slate-500">{item.label}</span>
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

        {/* Recent Trades Table */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524]">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-indigo-400" />
              <p className="text-sm font-semibold text-white">Recent Executed Trades</p>
            </div>
            <span className="text-xs text-slate-500">Live order router</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/50 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-3 py-3">Symbol</th>
                  <th className="px-3 py-3">Dir</th>
                  <th className="px-3 py-3 text-right">Entry</th>
                  <th className="px-3 py-3 text-right">Exit</th>
                  <th className="px-3 py-3 text-right">P&amp;L %</th>
                  <th className="px-3 py-3 text-right">Status</th>
                  <th className="px-3 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_TRADES.slice(0, 6).map((t) => (
                  <tr key={t.id} className="border-b border-slate-800/30 transition hover:bg-slate-800/20">
                    <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="px-3 py-2.5 font-semibold text-white text-xs">{t.symbol}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          t.dir === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {t.dir}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-slate-400">${t.entry.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-slate-300">${t.exit.toLocaleString()}</td>
                    <td className={`px-3 py-2.5 text-right font-mono text-xs font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{t.status}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-xs font-mono text-slate-500">{t.ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
