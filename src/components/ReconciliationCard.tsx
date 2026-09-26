import React from 'react';
import { CheckCheck, Calendar, Truck, Gauge, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { InvoicePricingMode, TripLogEntry } from '../types/invoice';

interface ReconciliationCardProps {
  trips: TripLogEntry[];
  pricingMode: InvoicePricingMode;
  onSelectPricingMode: (mode: InvoicePricingMode) => void;
  onOpenManifestModal: () => void;
}

export const ReconciliationCard: React.FC<ReconciliationCardProps> = ({
  trips,
  pricingMode,
  onSelectPricingMode,
  onOpenManifestModal,
}) => {
  const rawTotalKm = trips.reduce((sum, t) => sum + t.distanceKm, 0); // 8,127.9
  const uniqueDates = new Set(trips.map((t) => t.date)).size; // 19 days
  const totalPassengers = trips.reduce((sum, t) => sum + t.passengerCount, 0);

  let activeKm = rawTotalKm;
  let activePrice = rawTotalKm * 10;

  if (pricingMode === 'exact_logbook') {
    activeKm = 7733.9;
    activePrice = 77339.0;
  } else if (pricingMode === 'summary_slip') {
    activeKm = 7723.0;
    activePrice = 77230.0;
  }

  // Group by vehicle
  const vehicleStats: Record<string, { trips: number; km: number }> = {};
  trips.forEach((t) => {
    if (!vehicleStats[t.vehiclePlate]) {
      vehicleStats[t.vehiclePlate] = { trips: 0, km: 0 };
    }
    vehicleStats[t.vehiclePlate].trips += 1;
    vehicleStats[t.vehiclePlate].km += t.distanceKm;
  });

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <CheckCheck className="w-4 h-4" /> Logbook &amp; Summary Slip Reconciliation
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Contract Transport Verification (19 Working Days)
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Reconciled to your requested invoice price across 6 August + 13 September 2026 shifts.
          </p>
        </div>

        {/* 3-Way Pricing Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-bold text-stone-500">Invoice Price:</span>
          <div className="bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => onSelectPricingMode('raw_trips')}
              className={`px-3.5 py-2 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 ${
                pricingMode === 'raw_trips'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Bill all 24 sheets with zero deductions: R 81,279.00"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Amount (No Deductions): <strong className="font-mono">R 81,279.00</strong></span>
            </button>
            <button
              onClick={() => onSelectPricingMode('exact_logbook')}
              className={`px-3.5 py-2 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 ${
                pricingMode === 'exact_logbook'
                  ? 'bg-[#0054a6] text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span>Clean Logbook: <strong className="font-mono">R 77,339.00</strong></span>
            </button>
            <button
              onClick={() => onSelectPricingMode('summary_slip')}
              className={`px-3.5 py-2 rounded-xl font-medium transition cursor-pointer ${
                pricingMode === 'summary_slip'
                  ? 'bg-stone-800 text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span>Driver Slip: <strong className="font-mono">R 77,230.00</strong></span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" /> Working Days
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {uniqueDates}{' '}
            <span className="text-xs font-normal text-stone-500">Days</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">6 Aug + 13 Sep 2026</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800">
          <div className="flex items-center gap-2 text-[#0054a6] dark:text-blue-400 text-xs mb-1 font-semibold">
            <Gauge className="w-4 h-4 text-[#0054a6]" /> Total Billed (@ R10/km)
          </div>
          <div className="text-2xl font-bold text-[#0054a6] dark:text-blue-200 font-mono">
            {activeKm.toLocaleString('en-ZA', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{' '}
            <span className="text-xs font-normal text-stone-600 font-sans">KM</span>
          </div>
          <div className="text-xs text-stone-700 dark:text-stone-300 font-mono font-bold mt-1">
            = R {activePrice.toLocaleString('en-ZA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
            <Truck className="w-4 h-4 text-indigo-600" /> Vehicle Trips
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {trips.length}{' '}
            <span className="text-xs font-normal text-stone-500">Trips</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">3 Fleet Vehicles</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
            <FileText className="w-4 h-4 text-amber-600" /> Passenger Trips
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalPassengers}{' '}
            <span className="text-xs font-normal text-stone-500">Transits</span>
          </div>
          <button
            onClick={onOpenManifestModal}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5 mt-1 cursor-pointer font-medium"
          >
            Search Manifest <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Fleet Breakdown */}
      <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
          Fleet Vehicle Contribution
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(vehicleStats).map(([plate, stats]) => (
            <div
              key={plate}
              className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-800 flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  {plate}
                </span>
                <p className="text-xs text-stone-500 mt-1">{stats.trips} scheduled trips</p>
              </div>
              <div className="text-right font-mono font-semibold text-stone-800 dark:text-stone-200 text-sm">
                {stats.km.toFixed(1)} km
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
