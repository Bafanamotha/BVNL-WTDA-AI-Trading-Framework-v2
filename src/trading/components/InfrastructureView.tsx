import React from 'react';
import { Server, Cpu, Database, Activity, CheckCircle2, ShieldCheck } from 'lucide-react';

export const InfrastructureView: React.FC = () => {
  const nodes = [
    { name: 'Cluster Node 01 (Frankfurt)', role: 'PyTorch Inference & Features', status: 'Operational', cpu: '28%', gpu: '44% (NVIDIA A100)', memory: '48.2 / 128 GB', ping: '1.1 ms' },
    { name: 'Cluster Node 02 (London)', role: 'L2 Orderbook WebSocket Ingestion', status: 'Operational', cpu: '18%', gpu: 'N/A (CPU Optimized)', memory: '24.1 / 64 GB', ping: '0.8 ms' },
    { name: 'Cluster Node 03 (New York)', role: 'FIX Execution Gateway to IBKR', status: 'Operational', cpu: '14%', gpu: 'N/A', memory: '16.5 / 64 GB', ping: '1.4 ms' },
    { name: 'Cluster Node 04 (Tokyo)', role: 'Async Backtester & Model Retrainer', status: 'Idle', cpu: '8%', gpu: '12% (NVIDIA H100)', memory: '62.0 / 256 GB', ping: '2.6 ms' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#0f1524] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Distributed Infrastructure &amp; Compute Cluster</h2>
            <p className="text-xs text-slate-400">
              Low-latency bare-metal instances, PyTorch 2.3 tensor engines, and Redis pub/sub message brokers
            </p>
          </div>
        </div>

        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 font-mono">
          System Health: 100% Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <div key={node.name} className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white text-sm">{node.name}</h3>
                <p className="text-xs text-slate-500">{node.role}</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {node.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <div>
                <span className="text-slate-500">CPU Usage:</span>
                <p className="font-mono text-white font-semibold">{node.cpu}</p>
              </div>
              <div>
                <span className="text-slate-500">GPU VRAM:</span>
                <p className="font-mono text-indigo-400 font-semibold">{node.gpu}</p>
              </div>
              <div className="mt-1">
                <span className="text-slate-500">RAM:</span>
                <p className="font-mono text-slate-300">{node.memory}</p>
              </div>
              <div className="mt-1">
                <span className="text-slate-500">Gateway RTT:</span>
                <p className="font-mono text-emerald-400 font-semibold">{node.ping}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
