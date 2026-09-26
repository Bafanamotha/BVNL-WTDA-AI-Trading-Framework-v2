import React, { useState, useMemo } from 'react';
import { X, Search, Users, Calendar, Truck, ArrowRight } from 'lucide-react';
import { TripLogEntry } from '../types/invoice';

interface PassengerManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: TripLogEntry[];
}

export const PassengerManifestModal: React.FC<PassengerManifestModalProps> = ({
  isOpen,
  onClose,
  trips,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique passengers and their ride frequency
  const passengerStats = useMemo(() => {
    const map = new Map<
      string,
      { name: string; trips: { date: string; vehicle: string; route: string }[] }
    >();

    trips.forEach((trip) => {
      trip.passengers.forEach((passenger) => {
        const cleanName = passenger.trim();
        if (!cleanName) return;

        if (!map.has(cleanName)) {
          map.set(cleanName, { name: cleanName, trips: [] });
        }
        map.get(cleanName)!.trips.push({
          date: trip.displayDate,
          vehicle: trip.vehiclePlate,
          route: trip.route,
        });
      });
    });

    return Array.from(map.values()).sort((a, b) => b.trips.length - a.trips.length);
  }, [trips]);

  const filteredPassengers = passengerStats.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Staff &amp; Trainee Passenger Directory
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Index of all unique passengers recorded across the 19 transport days.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/30">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search passenger name (e.g. Khomotso, Thomas, Amanda, Dlamini)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-850 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Showing {filteredPassengers.length} passengers</span>
            <span>Sorted by journey count</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPassengers.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-emerald-400 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                    {p.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {p.trips.length} ride{p.trips.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1 text-[11px] text-stone-500">
                  {p.trips.slice(0, 3).map((t, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {t.date}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-600 dark:text-stone-400">
                        {t.vehicle}
                      </span>
                    </div>
                  ))}
                  {p.trips.length > 3 && (
                    <div className="text-[10px] text-emerald-600 font-medium">
                      +{p.trips.length - 3} more trips
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
