import React, { useState } from 'react';
import { FlaskConical, Sliders, CheckCircle2, RotateCcw, Cpu } from 'lucide-react';

export const LabRDView: React.FC = () => {
  const [waveletFamily, setWaveletFamily] = useState<string>('Daubechies (db4)');
  const [decompLevel, setDecompLevel] = useState<number>(4);
  const [orderbookDepth, setOrderbookDepth] = useState<number>(50);
  const [volatilityWindow, setVolatilityWindow] = useState<number>(20);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleApply = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f1524] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Quantitative Research &amp; Development Lab</h2>
            <p className="text-xs text-slate-400">
              Interactive feature engineering and multi-resolution wavelet transformation hyperparameters
            </p>
          </div>
        </div>

        <button
          onClick={handleApply}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Weights Updated</span>
            </>
          ) : (
            <span>Deploy to Pipeline</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: WTDA Wavelet Parameters */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>WTDA Wavelet Transform Settings</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Wavelet Decomposition Family</label>
              <select
                value={waveletFamily}
                onChange={(e) => setWaveletFamily(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="Daubechies (db4)">Daubechies (db4) - Optimal Sharp Volatility</option>
                <option value="Symlet (sym8)">Symlet (sym8) - Symmetric Phase Response</option>
                <option value="Coiflet (coif3)">Coiflet (coif3) - Smooth Trend Extraction</option>
                <option value="Haar">Haar - Step Breakout Detection</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Decomposition Resolution Level:</span>
                <span className="font-mono text-indigo-400 font-bold">{decompLevel} levels</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={decompLevel}
                onChange={(e) => setDecompLevel(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Module 2: BVNL Orderbook Normalization */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1524] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>BVNL Bid-Volume Normalization</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>L2 Orderbook Depth Window:</span>
                <span className="font-mono text-cyan-400 font-bold">{orderbookDepth} levels</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={orderbookDepth}
                onChange={(e) => setOrderbookDepth(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Rolling Volatility Smoothing Period:</span>
                <span className="font-mono text-cyan-400 font-bold">{volatilityWindow} bars</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={volatilityWindow}
                onChange={(e) => setVolatilityWindow(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
