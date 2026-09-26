import React, { useState, useEffect } from 'react';
import { RefreshCw, Radio, ShieldCheck, Zap } from 'lucide-react';

interface TradingHeaderProps {
  title: string;
  onRefresh?: () => void;
}

export const TradingHeader: React.FC<TradingHeaderProps> = ({ title, onRefresh }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-800 bg-[#0a0e1a]/90 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-white tracking-wide">{title}</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE PIPELINE
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="hidden sm:flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <Radio className="h-3 w-3 text-emerald-400 animate-ping" />
            Binance / Kraken / IBKR
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-indigo-400">
            <Zap className="h-3 w-3" />
            1.2 ms Latency
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            VaR Ok
          </span>
        </div>

        <span className="hidden md:inline font-mono text-slate-300 text-[11px] bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
          {time.toLocaleTimeString('en-US', { hour12: false })} UTC
        </span>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-500 hover:text-white transition cursor-pointer"
          title="Refresh Data Feeds"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>
      </div>
    </header>
  );
};
