import React, { useState } from 'react';
import { Brain, Cpu, RefreshCw, Zap, TrendingUp, Shield, Sliders, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import { INITIAL_MODELS, RADAR_DATA } from '../tradingData';
import { ModelItem } from '../types';

export const AIModelsView: React.FC = () => {
  const [models, setModels] = useState<ModelItem[]>(INITIAL_MODELS);
  const [retrainingName, setRetrainingName] = useState<string | null>(null);
  const [inspectModel, setInspectModel] = useState<ModelItem | null>(null);

  const handleRetrain = (name: string) => {
    setRetrainingName(name);
    setTimeout(() => {
      setModels((prev) =>
        prev.map((m) =>
          m.name === name
            ? { ...m, retrain: 'Just now', accuracy: Math.min(96, m.accuracy + 1), status: 'Active' }
            : m
        )
      );
      setRetrainingName(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0f1524] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Model Registry</h2>
            <p className="text-xs text-slate-400">
              Active predictive neural networks, tree ensembles, and wavelet decomposition engines
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Inference Engine: PyTorch 2.3 + ONNX Runtime
        </span>
      </div>

      {/* Grid of AI Models */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {models.map((m) => {
          const isRetraining = retrainingName === m.name || m.status === 'Retraining';

          return (
            <div
              key={m.name}
              className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 transition hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${m.bg}`}>
                    <Cpu className={`h-5 w-5 ${m.color}`} />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      m.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {isRetraining ? 'Retraining…' : m.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-semibold text-white text-sm">{m.name}</h3>
                  <p className="text-xs text-slate-500">{m.type}</p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-900/60 p-2 text-center border border-slate-800/60">
                  <div>
                    <p className="text-[10px] text-slate-600">Accuracy</p>
                    <p className="font-mono text-xs font-bold text-emerald-400">{m.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">Features</p>
                    <p className="font-mono text-xs font-bold text-slate-300">{m.features}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">Version</p>
                    <p className="font-mono text-xs font-bold text-slate-400">{m.version}</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400 line-clamp-2">{m.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <RefreshCw className="h-3 w-3" />
                  {m.retrain}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setInspectModel(m)}
                    className="rounded-lg border border-slate-700 px-2.5 py-1 font-medium text-slate-400 transition hover:border-indigo-500 hover:text-indigo-400 cursor-pointer"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => handleRetrain(m.name)}
                    disabled={isRetraining}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 font-medium text-slate-300 transition hover:text-white disabled:opacity-50 cursor-pointer"
                  >
                    {isRetraining ? 'Training…' : 'Retrain'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Comparison Radar Chart */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5">
        <p className="mb-1 text-sm font-semibold text-white">Model Comparison Radar</p>
        <p className="mb-4 text-xs text-slate-500">Multi-dimensional capability benchmark (BVNL vs WTDA vs Ensemble)</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#1e2a3a" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="BVNL" dataKey="BVNL" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="WTDA" dataKey="WTDA" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Ensemble" dataKey="Ensemble" stroke="#34d399" fill="#34d399" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inspect Model Modal */}
      {inspectModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#0f1524] border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold">{inspectModel.name} Configuration</h3>
                <p className="text-xs text-slate-400">{inspectModel.type} · {inspectModel.version}</p>
              </div>
              <button
                onClick={() => setInspectModel(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">{inspectModel.description}</p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hyperparameters</p>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 font-mono text-xs space-y-1.5">
                {inspectModel.hyperparams &&
                  Object.entries(inspectModel.hyperparams).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-indigo-400 font-semibold">{String(val)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectModel(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
