import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { TripLogEntry } from '../types/invoice';

interface LogbookTableProps {
  trips: TripLogEntry[];
  onOpenAuditModal: () => void;
}

export const LogbookTable: React.FC<LogbookTableProps> = ({
  trips,
  onOpenAuditModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<'All' | 'August' | 'September'>('All');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('All');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const vehicleOptions = ['All', ...Array.from(new Set(trips.map((t) => t.vehiclePlate)))];

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.displayDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.passengers.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMonth = selectedMonth === 'All' || trip.month === selectedMonth;
    const matchesVehicle = selectedVehicle === 'All' || trip.vehiclePlate === selectedVehicle;

    return matchesSearch && matchesMonth && matchesVehicle;
  });

  const exportCsv = () => {
    const headers = [
      'Trip ID',
      'Date',
      'Month',
      'Vehicle Plate',
      'Route',
      'Distance (KM)',
      'Passenger Count',
      'Passenger Names',
      'Logbook Photo Reference',
    ];

    const rows = filteredTrips.map((t) => [
      t.id,
      t.date,
      t.month,
      t.vehiclePlate,
      `"${t.route.replace(/"/g, '""')}"`,
      t.distanceKm,
      t.passengerCount,
      `"${t.passengers.join('; ').replace(/"/g, '""')}"`,
      t.photoSourceFile,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Transport_Logbook_${selectedMonth}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Digital Driver Logbook &amp; Manifest
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Complete records extracted from uploaded vehicle sheets (19 Days, 24 Journeys).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={onOpenAuditModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-500/20 transition cursor-pointer"
          >
            Check Duplicates &amp; Photos
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search passenger, route, date, vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-850 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          {(['All', 'August', 'September'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedMonth === m
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {m === 'All' ? 'All Months' : m}
            </button>
          ))}
        </div>

        <div>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            {vehicleOptions.map((v) => (
              <option key={v} value={v}>
                {v === 'All' ? 'All Vehicles' : `Vehicle: ${v}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3">Journey Details</th>
              <th className="py-3 px-3 text-right">Distance (KM)</th>
              <th className="py-3 px-3 text-center">Passengers</th>
              <th className="py-3 px-3">Log Photo Reference</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {filteredTrips.map((trip) => {
              const isExpanded = expandedTripId === trip.id;

              return (
                <React.Fragment key={trip.id}>
                  <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                    <td className="py-3 px-3 font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                      {trip.displayDate}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold border border-stone-200 dark:border-stone-700">
                        {trip.vehiclePlate}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {trip.route}
                      </div>
                      {trip.notes && (
                        <div className="text-[11px] text-stone-500">{trip.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                      {trip.distanceKm.toFixed(1)} km
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                        <Users className="w-3 h-3" /> {trip.passengerCount}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-500 font-mono text-[11px]">
                      {trip.photoSourceFile}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                        className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer font-medium"
                      >
                        {isExpanded ? (
                          <>
                            Hide <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            Manifest <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Passenger Manifest */}
                  {isExpanded && (
                    <tr className="bg-stone-50/80 dark:bg-stone-800/60">
                      <td colSpan={7} className="p-4">
                        <div className="rounded-2xl bg-white dark:bg-stone-900 p-4 border border-stone-200 dark:border-stone-700/60 shadow-xs">
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-emerald-600" /> Passenger Manifest ({trip.passengerCount} Persons)
                            </span>
                            <span className="text-[11px] font-mono text-stone-400">
                              Logged in {trip.photoSourceFile}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {trip.passengers.map((p, pIdx) => (
                              <div
                                key={pIdx}
                                className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-700/50 text-xs text-stone-700 dark:text-stone-300 font-medium"
                              >
                                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] flex items-center justify-center shrink-0 font-bold">
                                  {pIdx + 1}
                                </span>
                                <span className="truncate">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12 text-stone-500 text-xs">
          No logbook entries match your filter.
        </div>
      )}
    </div>
  );
};
