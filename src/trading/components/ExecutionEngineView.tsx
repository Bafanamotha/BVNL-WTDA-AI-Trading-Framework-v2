import React, { useState } from 'react';
import { Zap, Radio, Sliders, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { VENUE_STATUS_LIST } from '../tradingData';
import { VenueStatus } from '../types';

export const ExecutionEngineView: React.FC = () => {
  const [venues, setVenues] = useState<VenueStatus[]>(VENUE_STATUS_LIST);
  const [smartRouting, setSmartRouting] = useState<boolean>(true);
  const [maxSlippageBps, setMaxSlippageBps] = useState<number>(1.5);
  const [isEmergencyHalt, setIsEmergencyHalt] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { l: 'Orders Today', v: '1,247', sub: 'Filled without rejection' },
          { l: 'Avg Latency', v: '1.2 ms', sub: 'Order-to-fill turnaround' },
          { l: 'Fill Rate', v: '99.7%', sub: 'High-speed order routing' },
          { l: 'Slippage (bps)', v: '0.8', sub: 'Average execution delta' },
        ].map(({ l, v, sub }) => (
          <div key={l} className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">{l}</p>
            <p className="mt-2 text-2xl font-bold text-white font-mono">{v}</p>
            <p className="text-xs text-slate-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Venues Status */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Order Router Gateway Status</h3>
            <p className="text-xs text-slate-400">Direct FIX protocol &amp; binary WebSocket connections</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            4 Active Venues
          </span>
        </div>

        <div className="space-y-3">
          {venues.map((v) => (
            <div
              key={v.venue}
              className="flex items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3 hover:bg-slate-800/30 transition"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  v.status === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="w-36 font-semibold text-slate-200 text-sm">{v.venue}</span>
              <span
                className={`flex-1 text-xs font-semibold ${
                  v.status === 'Connected' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {v.status}
              </span>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {v.latency}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {v.fillRate} fill rate
              </span>
              <span className="text-xs text-slate-500 font-mono">{v.orders} orders</span>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Router Parameters */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Smart Order Router Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold">Smart Volume Splitting</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Auto-fragment large blocks</span>
              <button
                onClick={() => setSmartRouting(!smartRouting)}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                  smartRouting ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {smartRouting ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold">Max Slippage Protection</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current threshold</span>
              <span className="font-mono text-emerald-400 font-bold bg-slate-800 px-2 py-1 rounded">
                {maxSlippageBps} bps
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-semibold">Emergency Router Halt</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Halt new order dispatch</span>
              <button
                onClick={() => setIsEmergencyHalt(!isEmergencyHalt)}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                  isEmergencyHalt ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-red-400'
                }`}
              >
                {isEmergencyHalt ? 'HALTED' : 'STANDBY'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
