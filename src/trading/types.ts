export type AssetClass = 'Crypto' | 'Forex' | 'Equities' | 'Commodities';
export type SignalDirection = 'LONG' | 'SHORT' | 'HOLD' | 'NEUTRAL';
export type TradeStatus = 'Open' | 'Closed' | 'Cancelled';

export interface TickerItem {
  sym: string;
  price: string;
  chg: string;
  up: boolean;
  numericPrice: number;
}

export interface SignalItem {
  id: number;
  symbol: string;
  asset: AssetClass;
  status: SignalDirection;
  confidence: number;
  entry: number;
  target: number;
  stop: number;
  pnl: number;
  age: string;
  model?: string;
  timeframe?: string;
}

export interface ModelItem {
  name: string;
  version: string;
  type: string;
  status: 'Active' | 'Retraining' | 'Degraded' | 'Offline';
  accuracy: number;
  features: number;
  retrain: string;
  color: string;
  bg: string;
  sharpe?: number;
  description?: string;
  hyperparams?: Record<string, string | number>;
}

export interface TradeItem {
  id: string;
  symbol: string;
  dir: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  pnl: number;
  status: TradeStatus;
  ts: string;
  venue?: string;
}

export interface ModuleWinRate {
  name: string;
  winRate: number;
  sharpe: number;
  trades: number;
  pnl: number;
}

export interface RadarMetric {
  metric: string;
  BVNL: number;
  WTDA: number;
  Ensemble: number;
}

export interface EquityPoint {
  date: string;
  equity: number;
  benchmark: number;
}

export interface CandlestickPoint {
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  signal: number;
  upBody?: number;
  downBody?: number;
  baseUp?: number;
  baseDown?: number;
  mid?: number;
}

export interface VenueStatus {
  venue: string;
  status: 'Connected' | 'Degraded' | 'Maintenance';
  latency: string;
  orders: number;
  fillRate: string;
}

export interface RiskMetricsData {
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRate: number;
  profitFactor: number;
  avgHoldTime: string;
  totalTrades: number;
}
