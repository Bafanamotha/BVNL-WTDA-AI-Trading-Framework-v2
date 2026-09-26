import React, { useState } from 'react';
import { ListOrdered, Search, Download, CheckCircle2 } from 'lucide-react';
import { INITIAL_TRADES } from '../tradingData';
import { TradeItem } from '../types';

export const TradeLogView: React.FC = () => {
  const [trades, setTrades] = useState<TradeItem[]>(INITIAL_TRADES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dirFilter, setDirFilter] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');

  const filtered = trades.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDir = dirFilter === 'ALL' || t.dir === dirFilter;
    return matchesSearch && matchesDir;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Symbol,Direction,Entry,Exit,PnL_Percent,Status,Timestamp,Venue\n';
    const rows = filtered
      .map((t) => `${t.id},${t.symbol},${t.dir},${t.entry},${t.exit},${t.pnl},${t.status},${t.ts},${t.venue || ''}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRADE_LOG_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0f1524] border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search symbol or trade ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
            {(['ALL', 'LONG', 'SHORT'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirFilter(d)}
                className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  dirFilter === d ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Trades Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1524] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-slate-900/60">
                <th className="px-5 py-3.5">ID</th>
                <th className="px-4 py-3.5">Symbol</th>
                <th className="px-4 py-3.5">Direction</th>
                <th className="px-4 py-3.5 text-right">Entry Price</th>
                <th className="px-4 py-3.5 text-right">Exit Price</th>
                <th className="px-4 py-3.5 text-right">Realized P&amp;L</th>
                <th className="px-4 py-3.5 text-right">Status</th>
                <th className="px-4 py-3.5 text-right">Execution Venue</th>
                <th className="px-5 py-3.5 text-right">Time (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition text-xs">
                  <td className="px-5 py-3 font-mono text-slate-400 font-semibold">{t.id}</td>
                  <td className="px-4 py-3 font-bold text-white">{t.symbol}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.dir === 'LONG'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {t.dir}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">${t.entry.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-200">${t.exit.toLocaleString()}</td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-bold ${
                      t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400 font-mono">{t.venue || 'IBKR'}</td>
                  <td className="px-5 py-3 text-right text-slate-500 font-mono">{t.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
