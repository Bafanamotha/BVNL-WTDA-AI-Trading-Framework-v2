import {
  TickerItem,
  SignalItem,
  ModelItem,
  TradeItem,
  ModuleWinRate,
  RadarMetric,
  EquityPoint,
  CandlestickPoint,
  VenueStatus,
  RiskMetricsData,
} from './types';

export const INITIAL_TICKERS: TickerItem[] = [
  { sym: 'BTC/USD', price: '42,185.50', chg: '+2.34%', up: true, numericPrice: 42185.5 },
  { sym: 'ETH/USD', price: '2,248.30', chg: '+1.12%', up: true, numericPrice: 2248.3 },
  { sym: 'EUR/USD', price: '1.0872', chg: '-0.43%', up: false, numericPrice: 1.0872 },
  { sym: 'XAU/USD', price: '2,318.70', chg: '+1.78%', up: true, numericPrice: 2318.7 },
  { sym: 'NVDA', price: '875.20', chg: '+3.91%', up: true, numericPrice: 875.2 },
  { sym: 'GBP/USD', price: '1.2701', chg: '-0.88%', up: false, numericPrice: 1.2701 },
  { sym: 'SOL/USD', price: '148.90', chg: '+0.22%', up: true, numericPrice: 148.9 },
  { sym: 'SPX500', price: '5,212.40', chg: '+0.67%', up: true, numericPrice: 5212.4 },
  { sym: 'AAPL', price: '183.42', chg: '+0.00%', up: true, numericPrice: 183.42 },
  { sym: 'DXY', price: '104.21', chg: '-0.19%', up: false, numericPrice: 104.21 },
];

export const INITIAL_SIGNALS: SignalItem[] = [
  {
    id: 1,
    symbol: 'BTC/USD',
    asset: 'Crypto',
    status: 'LONG',
    confidence: 91,
    entry: 42185.5,
    target: 44200,
    stop: 41100,
    pnl: 2.34,
    age: '2m',
    model: 'BVNL Trend-Follow',
    timeframe: '15m',
  },
  {
    id: 2,
    symbol: 'ETH/USD',
    asset: 'Crypto',
    status: 'LONG',
    confidence: 84,
    entry: 2248.3,
    target: 2410,
    stop: 2180,
    pnl: 1.12,
    age: '7m',
    model: 'WTDA Mean-Reversion',
    timeframe: '1h',
  },
  {
    id: 3,
    symbol: 'EUR/USD',
    asset: 'Forex',
    status: 'SHORT',
    confidence: 78,
    entry: 1.0872,
    target: 1.079,
    stop: 1.092,
    pnl: -0.43,
    age: '14m',
    model: 'Momentum ML',
    timeframe: '30m',
  },
  {
    id: 4,
    symbol: 'AAPL',
    asset: 'Equities',
    status: 'NEUTRAL',
    confidence: 55,
    entry: 183.42,
    target: 191,
    stop: 179.5,
    pnl: 0,
    age: '1h',
    model: 'ML Ensemble Meta',
    timeframe: '4h',
  },
  {
    id: 5,
    symbol: 'XAU/USD',
    asset: 'Commodities',
    status: 'LONG',
    confidence: 87,
    entry: 2318.7,
    target: 2390,
    stop: 2280,
    pnl: 1.78,
    age: '32m',
    model: 'BVNL Trend-Follow',
    timeframe: '1h',
  },
  {
    id: 6,
    symbol: 'GBP/USD',
    asset: 'Forex',
    status: 'SHORT',
    confidence: 72,
    entry: 1.2701,
    target: 1.258,
    stop: 1.278,
    pnl: -0.88,
    age: '45m',
    model: 'WTDA Mean-Reversion',
    timeframe: '15m',
  },
  {
    id: 7,
    symbol: 'NVDA',
    asset: 'Equities',
    status: 'LONG',
    confidence: 93,
    entry: 875.2,
    target: 940,
    stop: 840,
    pnl: 3.91,
    age: '5m',
    model: 'Momentum ML',
    timeframe: '5m',
  },
  {
    id: 8,
    symbol: 'SOL/USD',
    asset: 'Crypto',
    status: 'HOLD',
    confidence: 61,
    entry: 148.9,
    target: 165,
    stop: 138,
    pnl: 0.22,
    age: '2h',
    model: 'Arbitrage Engine',
    timeframe: '1h',
  },
];

export const INITIAL_MODELS: ModelItem[] = [
  {
    name: 'BVNL Trend-Follow',
    version: 'v2.4.1',
    type: 'Gradient Boosted Trees',
    status: 'Active',
    accuracy: 68,
    features: 142,
    retrain: '6h ago',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    sharpe: 2.1,
    description: 'Bid-Volume Normalized Liquidity tracking institutional flow orderbook skew.',
    hyperparams: { max_depth: 8, learning_rate: 0.03, colsample_bytree: 0.75, n_estimators: 450 },
  },
  {
    name: 'WTDA Mean-Reversion',
    version: 'v1.9.7',
    type: 'LSTM Neural Network',
    status: 'Active',
    accuracy: 72,
    features: 89,
    retrain: '2h ago',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    sharpe: 1.8,
    description: 'Wavelet Transform Distribution Analysis multi-resolution cycle decomposition.',
    hyperparams: { wavelet: 'db4', levels: 4, hidden_units: 128, dropout: 0.2, seq_length: 60 },
  },
  {
    name: 'Momentum ML',
    version: 'v3.1.0',
    type: 'Transformer + XGBoost',
    status: 'Active',
    accuracy: 61,
    features: 214,
    retrain: '12h ago',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    sharpe: 2.4,
    description: 'Cross-asset self-attention encoder for momentum breakout velocity.',
    hyperparams: { attention_heads: 8, num_layers: 4, d_model: 64, d_ff: 256 },
  },
  {
    name: 'Arbitrage Engine',
    version: 'v4.0.2',
    type: 'Rule + ML Hybrid',
    status: 'Active',
    accuracy: 83,
    features: 55,
    retrain: '1h ago',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    sharpe: 3.1,
    description: 'Statistical & latency arbitrage across centralized and perpetual orderbooks.',
    hyperparams: { threshold_bps: 4.5, max_exposure_usd: 50000, timeout_ms: 120 },
  },
  {
    name: 'ML Ensemble Meta',
    version: 'v2.0.0',
    type: 'Stacking Ensemble',
    status: 'Retraining',
    accuracy: 75,
    features: 500,
    retrain: 'In progress',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    sharpe: 2.8,
    description: 'Meta-learner weighting predictions by current market volatility regime.',
    hyperparams: { meta_learner: 'LogisticRegression', cv_folds: 5, blend_ratio: 0.65 },
  },
];

export const MODULE_WIN_RATES: ModuleWinRate[] = [
  { name: 'Trend-BVNL', winRate: 68, sharpe: 2.1, trades: 312, pnl: 18.4 },
  { name: 'Mean-Rev WTDA', winRate: 72, sharpe: 1.8, trades: 284, pnl: 14.2 },
  { name: 'Momentum-AI', winRate: 61, sharpe: 2.4, trades: 198, pnl: 22.7 },
  { name: 'Arbitrage', winRate: 83, sharpe: 3.1, trades: 876, pnl: 9.8 },
  { name: 'ML-Ensemble', winRate: 75, sharpe: 2.8, trades: 143, pnl: 31.5 },
];

export const RISK_METRICS: RiskMetricsData = {
  maxDrawdown: -12.4,
  sharpeRatio: 2.63,
  sortinoRatio: 3.18,
  calmarRatio: 1.94,
  winRate: 71.2,
  profitFactor: 2.41,
  avgHoldTime: '4h 22m',
  totalTrades: 1813,
};

export const INITIAL_TRADES: TradeItem[] = [
  { id: 'T-9921', symbol: 'BTC/USD', dir: 'LONG', entry: 41850, exit: 42940, pnl: 2.61, status: 'Closed', ts: '09:14:32', venue: 'Binance' },
  { id: 'T-9920', symbol: 'NVDA', dir: 'LONG', entry: 862.5, exit: 875.2, pnl: 1.47, status: 'Closed', ts: '09:02:11', venue: 'IBKR' },
  { id: 'T-9919', symbol: 'EUR/USD', dir: 'SHORT', entry: 1.0901, exit: 1.0872, pnl: 0.27, status: 'Closed', ts: '08:47:05', venue: 'IBKR' },
  { id: 'T-9918', symbol: 'ETH/USD', dir: 'LONG', entry: 2210, exit: 2190, pnl: -0.91, status: 'Closed', ts: '08:31:47', venue: 'Kraken' },
  { id: 'T-9917', symbol: 'XAU/USD', dir: 'LONG', entry: 2298, exit: 2318.7, pnl: 0.9, status: 'Open', ts: '08:12:00', venue: 'IBKR' },
  { id: 'T-9916', symbol: 'SOL/USD', dir: 'LONG', entry: 142.1, exit: 148.9, pnl: 4.78, status: 'Closed', ts: '07:44:19', venue: 'Coinbase Adv' },
  { id: 'T-9915', symbol: 'AAPL', dir: 'SHORT', entry: 185.0, exit: 183.42, pnl: 0.85, status: 'Closed', ts: '07:15:02', venue: 'IBKR' },
  { id: 'T-9914', symbol: 'GBP/USD', dir: 'SHORT', entry: 1.275, exit: 1.2701, pnl: 0.38, status: 'Closed', ts: '06:58:30', venue: 'IBKR' },
];

export const RADAR_DATA: RadarMetric[] = [
  { metric: 'Accuracy', BVNL: 68, WTDA: 72, Ensemble: 75 },
  { metric: 'Speed', BVNL: 90, WTDA: 65, Ensemble: 55 },
  { metric: 'Robustness', BVNL: 74, WTDA: 80, Ensemble: 88 },
  { metric: 'Adaptability', BVNL: 60, WTDA: 70, Ensemble: 82 },
  { metric: 'Sharpe', BVNL: 78, WTDA: 65, Ensemble: 85 },
  { metric: 'Coverage', BVNL: 55, WTDA: 68, Ensemble: 90 },
];

export const ASSET_ALLOCATION = [
  { name: 'Crypto', value: 35, color: '#6366f1' },
  { name: 'Equities', value: 28, color: '#22d3ee' },
  { name: 'Forex', value: 22, color: '#a78bfa' },
  { name: 'Commodities', value: 15, color: '#34d399' },
];

export const BACKTEST_STRATEGIES = [
  'BVNL Trend-Follow v2',
  'WTDA Mean Reversion',
  'ML Momentum Ensemble',
  'Arbitrage HFT',
];

export const VENUE_STATUS_LIST: VenueStatus[] = [
  { venue: 'Binance', status: 'Connected', latency: '0.8 ms', orders: 487, fillRate: '99.9%' },
  { venue: 'Kraken', status: 'Connected', latency: '1.4 ms', orders: 231, fillRate: '99.5%' },
  { venue: 'IBKR', status: 'Connected', latency: '2.1 ms', orders: 312, fillRate: '99.8%' },
  { venue: 'Coinbase Adv', status: 'Degraded', latency: '4.8 ms', orders: 217, fillRate: '98.9%' },
];

// Generate 120-day equity points
export const GENERATE_EQUITY_CURVE = (): EquityPoint[] => {
  return Array.from({ length: 120 }, (_, t) => {
    const r = t * 320;
    const l = Math.sin(t * 0.4) * 4200 + Math.cos(t * 0.7) * 2100;
    const u = t >= 55 && t <= 68 ? -(t - 55) * 900 : 0;
    return {
      date: new Date(Date.now() - (119 - t) * 864e5).toISOString().slice(0, 10),
      equity: +(1e5 + r + l + u).toFixed(2),
      benchmark: +(1e5 + t * 180 + Math.sin(t * 0.3) * 2000).toFixed(2),
    };
  });
};

// Generate 80 15-min candlestick bars
export const GENERATE_CANDLESTICKS = (): CandlestickPoint[] => {
  return Array.from({ length: 80 }, (_, t) => {
    const n = 42300 + Math.sin(t * 0.35) * 800 + t * 12;
    const r = n + (Math.random() - 0.48) * 350;
    const l = Math.max(n, r) + Math.random() * 180;
    const u = Math.min(n, r) - Math.random() * 180;
    return {
      time: `${String(9 + Math.floor(t / 4)).padStart(2, '0')}:${String((t % 4) * 15).padStart(2, '0')}`,
      open: +n.toFixed(2),
      close: +r.toFixed(2),
      high: +l.toFixed(2),
      low: +u.toFixed(2),
      volume: Math.floor(Math.random() * 5000 + 1200),
      signal: r > n ? 60 : 40,
    };
  });
};
