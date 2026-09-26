import React, { useState, useEffect } from 'react';
import { INITIAL_TICKERS } from '../tradingData';
import { TickerItem } from '../types';

export const TradingMarquee: React.FC = () => {
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  // Subtle real-time simulated price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.49) * (t.numericPrice * 0.0004);
          const newPriceNum = Math.max(0.0001, t.numericPrice + delta);
          const isUp = delta >= 0;
          let formatted = '';
          if (newPriceNum > 1000) {
            formatted = newPriceNum.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          } else if (newPriceNum > 10) {
            formatted = newPriceNum.toFixed(2);
          } else {
            formatted = newPriceNum.toFixed(4);
          }
          return {
            ...t,
            numericPrice: newPriceNum,
            price: formatted,
            up: isUp,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-shrink-0 overflow-hidden border-b border-slate-800 bg-[#080c17] select-none">
      <div className="flex animate-marquee gap-0 whitespace-nowrap">
        {[...tickers, ...tickers].map((t, idx) => (
          <span
            key={`${t.sym}-${idx}`}
            className="inline-flex items-center gap-2 border-r border-slate-800 px-5 py-1.5 text-xs hover:bg-slate-800/40 transition cursor-default"
          >
            <span className="font-semibold text-slate-300">{t.sym}</span>
            <span className="font-mono text-white tracking-tight">{t.price}</span>
            <span className={`font-mono text-[11px] font-semibold ${t.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {t.chg}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
